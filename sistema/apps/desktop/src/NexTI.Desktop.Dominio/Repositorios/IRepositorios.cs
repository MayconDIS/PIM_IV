using NexTI.Desktop.Dominio.Entidades;

namespace NexTI.Desktop.Dominio.Repositorios;

// Contratos de acesso aos dados. O domínio e a aplicação só conhecem estas interfaces;
// quem as implementa (com EF Core e SQLite) é a camada de Infraestrutura.

public interface IRepositorioDeFases
{
    /// <summary>As fases na ordem da trilha, cada uma com as suas cartas.</summary>
    IReadOnlyList<Fase> ListarComCartas();
    Fase? ObterComCartas(string codigo);
}

public interface IRepositorioDeAlunos
{
    Aluno? ObterPorNickname(string nickname);
    void Adicionar(Aluno aluno);
}

public interface IRepositorioDeRevisoes
{
    IReadOnlyList<Revisao> DoAluno(int alunoId);
    void Adicionar(Revisao revisao);
}

/// <summary>Grava de uma vez tudo o que mudou (alunos, revisões e fases concluídas).</summary>
public interface IUnidadeDeTrabalho
{
    void Salvar();
}
