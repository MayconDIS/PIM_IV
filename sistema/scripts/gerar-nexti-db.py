"""
Gera database/NexTI_DB.sql: o script completo do banco do Nex_TI
(estrutura + procedures, triggers, funções e views + todos os dados).

A estrutura vem das migrations (database/azure-sql/schema.sql) e os dados
vêm de um banco que a API já povoou. Para gerar de novo:

  1. dotnet ef migrations script --idempotent -o ../../database/azure-sql/schema.sql
     (dentro de apps/api)
  2. suba a API apontando para um banco vazio, por exemplo:
     ConnectionStrings__DefaultConnection="Server=(localdb)\\mssqllocaldb;Database=NexTI_Export;Trusted_Connection=True;TrustServerCertificate=True;"
  3. python scripts/gerar-nexti-db.py NexTI_Export
"""
import json
import pathlib
import subprocess
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SERVIDOR = r"(localdb)\mssqllocaldb"

# Tabelas na ordem das chaves estrangeiras; True = tem coluna IDENTITY.
TABELAS = [
    ("fases", ["codigo_fase", "descricao"], False),
    ("flashcards", ["id", "codigo_fase", "frente", "verso", "dica", "opcoes", "correta"], True),
    ("tb_areas_conhecimento", ["id_area", "nome_area"], True),
    ("tb_provas", ["id_prova", "ano", "tipo"], True),
    ("tb_questoes", ["id_questao", "id_area", "enunciado", "origem"], True),
    ("tb_alternativas", ["id_alternativa", "id_questao", "texto", "is_correta"], True),
    ("tb_prova_questao", ["id_prova", "id_questao"], False),
]


def ler(banco, tabela, colunas):
    ordem = colunas[0] if tabela != "tb_prova_questao" else "id_prova, id_questao"
    consulta = f"SET NOCOUNT ON; SELECT {', '.join(colunas)} FROM {tabela} ORDER BY {ordem} FOR JSON PATH, INCLUDE_NULL_VALUES"
    saida = subprocess.run(
        ["sqlcmd", "-S", SERVIDOR, "-d", banco, "-y", "0", "-Q", consulta],
        capture_output=True, text=True, encoding="utf-8", check=True,
    ).stdout
    texto = "".join(linha.strip("\r") for linha in saida.splitlines()).strip()
    return json.loads(texto) if texto else []


def valor(v):
    if v is None:
        return "NULL"
    if isinstance(v, bool):
        return "1" if v else "0"
    if isinstance(v, (int, float)):
        return str(v)
    return "N'" + str(v).replace("'", "''") + "'"


def bloco_insert(tabela, colunas, identidade, linhas):
    partes = [f"-- {tabela}: {len(linhas)} registro(s)",
              f"IF NOT EXISTS (SELECT 1 FROM {tabela})",
              "BEGIN"]
    if identidade:
        partes.append(f"    SET IDENTITY_INSERT {tabela} ON;")
    for i in range(0, len(linhas), 100):  # INSERT ... VALUES aceita até 1000 linhas; 100 deixa o arquivo legível
        lote = linhas[i:i + 100]
        partes.append(f"    INSERT INTO {tabela} ({', '.join(colunas)}) VALUES")
        partes.append(",\n".join("        (" + ", ".join(valor(l.get(c)) for c in colunas) + ")" for l in lote) + ";")
    if identidade:
        partes.append(f"    SET IDENTITY_INSERT {tabela} OFF;")
    partes.append("END;")
    partes.append("GO")
    return "\n".join(partes)


def main():
    banco = sys.argv[1] if len(sys.argv) > 1 else "NexTI_Export"
    esquema = (RAIZ / "database" / "azure-sql" / "schema.sql").read_text(encoding="utf-8-sig")
    contagem = {tabela: len(ler(banco, tabela, colunas)) for tabela, colunas, _ in TABELAS[:2]}
    cabecalho = f"""-- =====================================================================
-- Nex_TI — script completo do banco de dados (SQL Server / Azure SQL)
-- PIM IV · Etapa 7 · Programação de Banco de Dados
--
-- 1. Cria o banco NexTI_DB (se não existir).
-- 2. Cria as tabelas, a tabela de histórico, os 2 triggers, as 2 funções,
--    as 2 views e as 4 procedures (mesmas migrations que a API aplica).
-- 3. Insere as {contagem['fases']} fases, as {contagem['flashcards']} cartas e os simulados ENADE.
--
-- Pode ser executado mais de uma vez: cada parte confere se já existe.
-- Gerado por sistema/scripts/gerar-nexti-db.py — não editar à mão.
-- =====================================================================

IF DB_ID(N'NexTI_DB') IS NULL
    CREATE DATABASE NexTI_DB;
GO

USE NexTI_DB;
GO

-- =====================================================================
-- ESTRUTURA (tabelas, chaves, índices, triggers, funções, views e procedures)
-- =====================================================================
"""
    dados = ["", "-- =====================================================================",
             "-- DADOS (conteúdo de estudo e simulados ENADE)",
             "-- =====================================================================", ""]
    for tabela, colunas, identidade in TABELAS:
        linhas = ler(banco, tabela, colunas)
        dados.append(bloco_insert(tabela, colunas, identidade, linhas))
        dados.append("")
        print(f"{tabela}: {len(linhas)}")
    destino = RAIZ / "database" / "NexTI_DB.sql"
    destino.write_text(cabecalho + esquema.strip() + "\nGO\n" + "\n".join(dados), encoding="utf-8")
    print(f"gerado: {destino}")


if __name__ == "__main__":
    main()
