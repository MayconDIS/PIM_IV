import React, { useEffect, useState } from 'react';
import '@nexti/shared/css/global.css';
import '@nexti/shared/css/sobre.css';
import logo from '@nexti/shared/img/logo.png';

/** Porte de apps/web/pages/sobre/index.html: páginas institucionais, de ecossistema e legais. */
const GRUPOS = [
  {
    titulo: 'Institucional',
    classe: 'mod-inst',
    cor: 'green',
    secoes: [
      {
        id: 'sobre',
        icone: 'corporate_fare',
        menu: 'Sobre a Nex_TI',
        titulo: 'Sobre a Nex_TI',
        corpo: [
          'A Nex_TI é uma EdTech nascida de um Projeto Integrado Multidisciplinar (PIM IV). Nosso objetivo principal é combater a Curva de Esquecimento de Ebbinghaus no processo de aprendizado de tecnologia através do uso massivo do Algoritmo SM-2 (Repetição Espaçada) acoplado a um ecossistema gamificado.',
          'Nossa plataforma foi desenhada por estudantes de Análise e Desenvolvimento de Sistemas para ser a ferramenta de extensão universitária definitiva.',
        ],
      },
      {
        id: 'metodologia',
        icone: 'menu_book',
        menu: 'Metodologia',
        titulo: 'Metodologia de Ensino',
        corpo: [
          'Substituímos o aprendizado passivo por estímulos de Estudo Ativo. Ao invés de vídeos longos, o aluno consome conceitos atômicos através de "Flashcards" interativos, onde a performance no recall do conhecimento (Erro/Acerto) dita quando aquela informação será apresentada novamente.',
        ],
      },
      {
        id: 'opensource',
        icone: 'code',
        menu: 'Open Source',
        titulo: 'Manifesto Open Source',
        corpo: [
          'Acreditamos que o código que molda o futuro da educação deve ser aberto. O núcleo do Nex_TI, incluindo a lógica do algoritmo de repetição espaçada (SM-2), a arquitetura em Vanilla JS e o backend C# (.NET 10), está disponível livremente no GitHub para auditoria, extensão e bifurcação pela comunidade.',
        ],
      },
      {
        id: 'carreiras',
        icone: 'work',
        menu: 'Carreiras & Vagas',
        titulo: 'Carreiras & Vagas',
        corpo: [
          'Estamos sempre em busca de talentos que queiram revolucionar a educação no Brasil. No momento, somos um projeto de extensão universitária e não possuímos vagas CLT abertas.',
          'Contribuições via Pull Request no repositório oficial do GitHub são muito bem-vindas e contam como experiência comprovada!',
        ],
      },
    ],
  },
  {
    titulo: 'Ecossistema',
    classe: 'mod-ecos',
    cor: 'yellow',
    secoes: [
      {
        id: 'trilhas',
        icone: 'route',
        menu: 'Trilhas e Disciplinas',
        titulo: 'Trilhas e Disciplinas',
        corpo: [
          'Nossa plataforma é modular. Oferecemos pacotes curriculares focados em Engenharia de Software, Lógica de Programação, Cibersegurança e Arquitetura de Nuvem. Cada trilha é dividida em missões progressivas que dão XP ao serem concluídas.',
        ],
      },
      {
        id: 'enade',
        icone: 'school',
        menu: 'Simulado ENADE',
        titulo: 'Simulado ENADE',
        corpo: [
          'Módulo exclusivo de preparação para o ENADE, contendo questões reais de provas anteriores de Análise e Desenvolvimento de Sistemas formatadas no modelo de Flashcard. Responda, verifique o verso para explicação detalhada e ganhe pontuação dobrada.',
        ],
      },
      {
        id: 'comunidade',
        icone: 'groups',
        menu: 'Comunidade Devs',
        titulo: 'Comunidade Devs',
        corpo: [
          'A seção de comunidade visa conectar alunos em diferentes níveis (Júnior, Pleno e Sênior) baseados no XP da plataforma. É um espaço assíncrono para tirar dúvidas de código e trocar experiências sobre carreira.',
          <em key="v2">(Funcionalidade prevista para implantação na Versão 2.0).</em>,
        ],
      },
      {
        id: 'loja',
        icone: 'store',
        menu: 'Loja de Bônus',
        titulo: 'Loja de Bônus (Coins)',
        corpo: [
          'As Moedas Virtuais (Coins) que você minera estudando diariamente servem para desbloquear Flashcards ocultos de disciplinas avançadas ou "Easter Eggs" sobre cultura hacker e curiosidades de TI. Quanto mais você estuda, mais acesso você tem ao conteúdo premium gratuito.',
        ],
      },
    ],
  },
  {
    titulo: 'Suporte & Legal',
    classe: 'mod-sup',
    cor: 'red',
    secoes: [
      {
        id: 'faq',
        icone: 'help',
        menu: 'Central de Ajuda',
        titulo: 'Central de Ajuda',
        corpo: [
          <React.Fragment key="p1">
            <strong>P: Como recomeço o meu progresso?</strong>
            <br />
            R: No Dashboard, abra o menu superior direito e clique em "Formatar Sistema". ISSO APAGARÁ TODO SEU PROGRESSO ATUAL.
          </React.Fragment>,
          <React.Fragment key="p2">
            <strong>P: Como o algoritmo decide quando vou ver a carta de novo?</strong>
            <br />
            R: Usamos o SM-2 modificado. Se você errar, verá a carta logo em seguida. Se acertar, ela vai para a caixa de revisão de amanhã. Acertos consecutivos multiplicam o tempo de distância.
          </React.Fragment>,
        ],
      },
      {
        id: 'termos',
        icone: 'gavel',
        menu: 'Termos de Uso',
        titulo: 'Termos de Uso',
        corpo: [
          'Ao acessar o Nex_TI, você compreende que trata-se de um sistema de avaliação e extensão acadêmica. É estritamente proibido o uso de automação, scripts, ou bots para inflar XP e farmar Moedas falsamente.',
          'Contas identificadas com comportamento anômalo serão expurgadas sumariamente do nosso servidor SQL.',
        ],
      },
      {
        id: 'privacidade',
        icone: 'shield',
        menu: 'Privacidade (LGPD)',
        titulo: 'Aviso de Privacidade',
        corpo: [
          'A Nex_TI atua em conformidade estrita com a LGPD. Não capturamos cookies de rastreamento de terceiros em nossa aplicação.',
          'Seu E-mail e Username são mantidos em banco de dados isolado e protegido, e suas senhas são armazenadas exclusivamente através de hash criptográfico unidirecional. Você possui total controle para solicitar a deleção definitiva do seu perfil ("Direito ao Esquecimento").',
        ],
      },
      {
        id: 'contato',
        icone: 'mail',
        menu: 'Contato',
        titulo: 'Contato',
        corpo: [
          'Para suporte técnico, instabilidades na API ou para reportar vulnerabilidades de segurança (Bug Bounty), por favor abra uma "Issue" no repositório oficial do GitHub.',
          'Para assuntos administrativos, comunique-se com a equipe de desenvolvimento do PIM IV através dos canais de comunicação da coordenação UNIP.',
        ],
      },
    ],
  },
];

const SECOES = GRUPOS.flatMap((g) => g.secoes.map((s) => ({ ...s, cor: g.cor })));
const PADRAO = 'sobre';

const secaoDoHash = () => {
  const id = window.location.hash.slice(1);
  return SECOES.some((s) => s.id === id) ? id : PADRAO;
};

/** Endereço do app: tira ?pagina=sobre e o hash, voltando ao login/dashboard. */
const URL_APP = `${window.location.pathname}`;

export default function SobrePage() {
  const [ativa, setAtiva] = useState(secaoDoHash);

  useEffect(() => {
    document.title = 'Sobre - Nex_TI';
    const aoMudarHash = () => setAtiva(secaoDoHash());
    window.addEventListener('hashchange', aoMudarHash);
    return () => window.removeEventListener('hashchange', aoMudarHash);
  }, []);

  return (
    <>
      <header role="banner">
        <div className="logo logo-header-box cursor-pointer" onClick={() => window.location.assign(URL_APP)}>
          <img src={logo} alt="Nex_TI" className="logo-image-header" />
        </div>
        <div className="header-right">
          <a href={URL_APP} className="btn-back tech-font">
            <span className="material-symbols-outlined">arrow_back</span> Voltar ao App
          </a>
        </div>
      </header>

      <div className="container-docs">
        <nav className="left-panel">
          {GRUPOS.map((grupo) => (
            <React.Fragment key={grupo.titulo}>
              <div className={`dia-header ${grupo.classe}`}>
                <span className="tech-font">{grupo.titulo}</span>
                <div className="dia-line" />
              </div>
              {grupo.secoes.map((s) => (
                <a key={s.id} href={`#${s.id}`} className={`aula-item${ativa === s.id ? ' active' : ''}`}>
                  <span className={`material-symbols-outlined icon-${grupo.cor}`}>{s.icone}</span>
                  <span>{s.menu}</span>
                </a>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <main className="right-panel">
          {SECOES.map((s) => (
            <div key={s.id} id={`content-${s.id}`} className={`content-section${ativa === s.id ? ' active' : ''}`}>
              <h1>
                <span className={`material-symbols-outlined title-icon-${s.cor}`}>{s.icone}</span> {s.titulo}
              </h1>
              {s.corpo.map((paragrafo, i) => (
                <p key={i}>{paragrafo}</p>
              ))}
            </div>
          ))}
        </main>
      </div>
    </>
  );
}
