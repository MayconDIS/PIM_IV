"""Refaz o sumário do relatório e numera as páginas.

Uso (na pasta relatorio/docs/Relatorio_PIM_IV_Nex_TI): python atualizar-sumario.py
Lê os títulos de cada página (seções, subseções numeradas e apêndices), dá uma âncora a quem não tem,
renumera as páginas e monta o sumário com link e número de página em cada linha.
"""
import html as H
import re
import sys

arq = sys.argv[1] if len(sys.argv) > 1 else 'index.html'
por_folha = int(sys.argv[2]) if len(sys.argv) > 2 else 33  # linhas por folha do sumário
h = open(arq, encoding='utf-8').read()

# Folhas antes da introdução: capa, folha de rosto, resumo e abstract (4) + as folhas do sumário.
PRE_TEXTUAIS = 4

# 1. Títulos das páginas numeradas, na ordem do documento: h2, h3 e as subseções numeradas em h4.
#    Subseção numerada sem âncora ganha uma (sec-2-9-1) para o link do sumário.
inicio_main = h.index('<main>')
corpo = h[inicio_main:]


def ancorar(m):
    tag, attrs, conteudo = m.group(1), m.group(2), m.group(3)
    texto = re.sub(r'<[^>]+>', '', conteudo).strip()
    num = re.match(r'(\d+(?:\.\d+)+)\s', texto)
    if 'id="' in attrs or not num:
        return m.group(0)
    return f'<h{tag}{attrs} id="sec-{num.group(1).replace(".", "-")}">{conteudo}</h{tag}>'


corpo = re.sub(r'<h([34])([^>]*)>(.*?)</h\1>', ancorar, corpo, flags=re.S)
h = h[:inicio_main] + corpo
entradas = []
for sec in re.finditer(r'<section class="page page-numerada"[^>]*>(.*?)</section>', corpo, re.S):
    for m in re.finditer(r'<h([234])[^>]*\sid="([^"]+)"[^>]*>(.*?)</h\1>', sec.group(1), re.S):
        texto = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', m.group(3))).strip()
        if m.group(1) != '2' and not re.match(r'(\d+|[A-Z])\.\d', texto):
            continue
        num = re.match(r'(\d+(?:\.\d+)*|[A-Z]\.\d+)\s', texto)
        nivel = num.group(1).count('.') if num else 0
        entradas.append((nivel, m.group(2), texto))

folhas = [entradas[i:i + por_folha] for i in range(0, len(entradas), por_folha)]

# 2. Renumera as páginas: a introdução vem depois das pré-textuais e das folhas do sumário
pagina = [PRE_TEXTUAIS + len(folhas)]


def r(m):
    pagina[0] += 1
    return f'<span class="num-pagina">{pagina[0]}</span>'


h = re.sub(r'<span class="num-pagina">\d+</span>', r, h)
pag = {}
for sec in re.finditer(r'<section class="page[^"]*"[^>]*>(.*?)</section>', h, re.S):
    m = re.search(r'<span class="num-pagina">(\d+)</span>', sec.group(1))
    if m:
        for idm in re.findall(r'id="([^"]+)"', sec.group(1)):
            pag[idm] = m.group(1)


# 3. Monta as folhas do sumário
def linha(nivel, ident, texto):
    recuo = f' sumario-recuo-{min(nivel, 2)}' if nivel else ''
    return (f'<a href="#{ident}" class="sumario-link"><div class="sumario-item{recuo}">'
            f'<span class="sumario-titulo">{H.escape(texto, quote=False)}</span><span class="sumario-pontos"></span>'
            f'<span class="sumario-pagina">{pag[ident]}</span></div></a>')


novas = []
for i, folha in enumerate(folhas):
    titulo = '<h2 class="center">SUMÁRIO</h2>' if i == 0 else ''
    rotulo = 'Sumário' if i == 0 else 'Sumário (continuação)'
    novas.append(f'<section class="page" aria-label="{rotulo}">{titulo}<nav class="sumario-container" aria-label="Navegação do documento">'
                 + '\n'.join(linha(*e) for e in folha) + '</nav></section>')

ini = h.index('<section class="page" aria-label="Sumário">')
fim = h.index('<main>')
h = h[:ini] + '\n'.join(novas) + '\n' + h[fim:]
open(arq, 'w', encoding='utf-8', newline='').write(h)
print(f'{len(entradas)} linhas em {len(folhas)} folhas; introdução na página {PRE_TEXTUAIS + len(folhas) + 1}')
