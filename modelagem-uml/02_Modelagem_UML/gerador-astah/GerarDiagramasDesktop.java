import com.change_vision.jude.api.inf.AstahAPI;
import com.change_vision.jude.api.inf.editor.ActivityDiagramEditor;
import com.change_vision.jude.api.inf.editor.BasicModelEditor;
import com.change_vision.jude.api.inf.editor.ClassDiagramEditor;
import com.change_vision.jude.api.inf.editor.ModelEditorFactory;
import com.change_vision.jude.api.inf.editor.SequenceDiagramEditor;
import com.change_vision.jude.api.inf.editor.TransactionManager;
import com.change_vision.jude.api.inf.editor.UseCaseDiagramEditor;
import com.change_vision.jude.api.inf.editor.UseCaseModelEditor;
import com.change_vision.jude.api.inf.model.IAssociation;
import com.change_vision.jude.api.inf.model.IAttribute;
import com.change_vision.jude.api.inf.model.IClass;
import com.change_vision.jude.api.inf.model.IElement;
import com.change_vision.jude.api.inf.model.IFlow;
import com.change_vision.jude.api.inf.model.IModel;
import com.change_vision.jude.api.inf.model.INamedElement;
import com.change_vision.jude.api.inf.model.IOperation;
import com.change_vision.jude.api.inf.model.IPackage;
import com.change_vision.jude.api.inf.model.IUseCase;
import com.change_vision.jude.api.inf.presentation.ILinkPresentation;
import com.change_vision.jude.api.inf.presentation.INodePresentation;
import com.change_vision.jude.api.inf.presentation.IPresentation;
import com.change_vision.jude.api.inf.project.ProjectAccessor;
import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Gera "Diagrams Nex_TI Desktop - PA DotNet.asta" (guardado em sistema/apps/desktop/docs/diagramas): os quatro diagramas UML pedidos na
 * apresentação de P.A. em .NET (caso de uso, classes, sequência e atividade), todos tirados do
 * código de sistema/apps/desktop. Todo elemento recebe uma Definition.
 *
 * Uso (PowerShell, nesta pasta; a API do Astah precisa do Java 21 que vem com ele):
 *   $A = "C:\Program Files\astah-uml"
 *   & "$A\jre\bin\java.exe" -cp "$A\astah-uml.jar;$A\astah-api.jar;$A\lib\*" `
 *     GerarDiagramasDesktop.java "..\..\..\sistema\apps\desktop\docs\diagramas\Diagrams Nex_TI Desktop - PA DotNet.asta" ["<base.asta>"]
 * Como no outro gerador, a licença acadêmica só deixa salvar um arquivo aberto: na primeira vez,
 * passe um .asta qualquer como base (ele é copiado, não alterado).
 */
public class GerarDiagramasDesktop {

    private static ProjectAccessor projeto;
    private static BasicModelEditor modelo;
    private static final Map<String, IClass> classes = new HashMap<>();
    private static final Map<String, IElement> relacoes = new HashMap<>();

    public static void main(String[] args) throws Exception {
        java.nio.file.Path saida = java.nio.file.Path.of(args[0]).toAbsolutePath().normalize();
        java.nio.file.Path base = args.length > 1 ? java.nio.file.Path.of(args[1]).toAbsolutePath().normalize() : saida;
        if (!base.equals(saida))
            java.nio.file.Files.copy(base, saida, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        projeto = AstahAPI.getAstahAPI().getProjectAccessor();
        projeto.open(saida.toString(), true, false, false);
        try {
            TransactionManager.beginTransaction();
            modelo = ModelEditorFactory.getBasicModelEditor();
            IModel raiz = projeto.getProject();
            limpar(raiz);
            raiz.setDefinition("Nex_TI Desktop: versão em Windows Forms (.NET 10) do estudo com flashcards, feita para a apresentação de P.A. em .NET.");
            IPackage desktop = pacote(raiz, "Nex_TI Desktop", "Modelagem do programa em sistema/apps/desktop: orientação a objetos, camadas e módulos.");

            casoDeUso(pacote(desktop, "Casos de uso", "O que o aluno faz no programa."));
            IPackage pClasses = pacote(desktop, "Classes", "As classes do programa, uma pasta por camada (cada camada é um projeto .csproj).");
            classesDoPrograma(pClasses);
            sequencia(pacote(desktop, "Sequência", "A troca de mensagens ao responder uma carta e concluir a fase."));
            atividade(pacote(desktop, "Atividade", "O fluxo completo de uma sessão de estudo."));
            linhasEmAnguloReto();
            definirTodos();

            TransactionManager.endTransaction();
            projeto.save();
            System.out.println("Gerado: " + saida);
        } catch (Exception e) {
            System.out.println("FALHOU: " + e);
            e.printStackTrace(System.out);
            TransactionManager.abortTransaction();
            System.exit(1);
        } finally {
            projeto.close();
        }
    }

    // ------------------------------------------------------------------ 1. caso de uso

    private static void casoDeUso(IPackage pacote) throws Exception {
        UseCaseModelEditor uc = ModelEditorFactory.getUseCaseModelEditor();
        UseCaseDiagramEditor d = projeto.getDiagramEditorFactory().getUseCaseDiagramEditor();
        d.createUseCaseDiagram(pacote, "1. Casos de Uso - Nex_TI Desktop")
            .setDefinition("Os casos de uso do programa desktop: o aluno entra, vê a trilha, estuda uma fase respondendo as cartas e conclui a fase.");

        d.createRect(ponto(200, 20), 560, 420);
        d.createText("Nex_TI Desktop (Windows Forms + SQLite)", ponto(220, 30));

        IClass aluno = uc.createActor(pacote, "Aluno");
        aluno.setDefinition("Quem estuda no programa. Entra só com o nickname (os dados ficam no computador dele).");
        INodePresentation pAluno = d.createNodePresentation(aluno, ponto(40, 200));

        // {nome, definição, x, y, ligado ao ator?}
        String[][] casos = {
            {"Entrar com nickname", "O aluno digita o nickname (3 a 20 letras). Se ainda não existe neste computador, o programa cria o aluno. ServicoDeAlunos.Entrar.", "240", "70", "s"},
            {"Ver painel e trilha", "Mostra XP, moedas, nível e as 25 fases com a situação de cada uma (concluída, liberada ou trancada). ServicoDeEstudo.Painel e ListarFases.", "240", "170", "s"},
            {"Estudar fase", "Abre uma fase liberada com as cartas vencidas primeiro, depois as novas. ServicoDeEstudo.IniciarSessao.", "240", "290", "s"},
            {"Responder carta", "O aluno vê a pergunta, mostra a resposta e escolhe Errei, Difícil, Bom ou Fácil; o SM-2 marca a próxima revisão. ServicoDeEstudo.Responder.", "520", "250", ""},
            {"Concluir fase", "Quando todas as cartas foram acertadas: paga XP e moedas só na primeira vez e libera a próxima fase. ServicoDeEstudo.ConcluirFase.", "520", "360", ""},
        };
        Map<String, IUseCase> uso = new HashMap<>();
        Map<String, INodePresentation> pUso = new HashMap<>();
        for (String[] c : casos) {
            IUseCase u = uc.createUseCase(pacote, c[0]);
            u.setDefinition(c[1]);
            uso.put(c[0], u);
            INodePresentation n = d.createNodePresentation(u, ponto(Double.parseDouble(c[2]), Double.parseDouble(c[3])));
            n.setWidth(200);
            pUso.put(c[0], n);
            if (c[4].equals("s")) d.createLinkPresentation(modelo.createAssociation(aluno, u, "", "", ""), pAluno, n);
        }
        d.createLinkPresentation(uc.createInclude(uso.get("Estudar fase"), uso.get("Responder carta"), ""), pUso.get("Estudar fase"), pUso.get("Responder carta"));
        d.createLinkPresentation(uc.createExtend(uso.get("Estudar fase"), uso.get("Concluir fase"), ""), pUso.get("Concluir fase"), pUso.get("Estudar fase"));
    }

    // ------------------------------------------------------------------ 2. classes

    /** {nome, camada, tipo (classe, abstrata, interface), definição, atributos (;), operações (;)} */
    private static final String[][] CLASSES = {
        {"TelaEntrada", "Apresentação", "classe", "Tela de entrada (Form): o aluno digita o nickname.", "AlunoQueEntrou : Aluno", "Entrar() : void"},
        {"TelaPrincipal", "Apresentação", "classe", "Painel do aluno (Form): XP, moedas, nível e a lista de fases.", "", "Atualizar() : void;EstudarSelecionada() : void"},
        {"TelaEstudo", "Apresentação", "classe", "Tela de estudo (Form): pergunta, resposta e os quatro botões do SM-2.", "", "MostrarResposta() : void;Responder(resposta : Resposta) : void;Concluir() : void"},
        {"ServicoDeAlunos", "Aplicação", "classe", "Caso de uso Entrar: acha o aluno pelo nickname ou cria um novo.", "", "Entrar(nickname : string) : Aluno"},
        {"ServicoDeEstudo", "Aplicação", "classe", "Casos de uso do estudo: painel, trilha, abrir a fase, responder e concluir. Só conhece interfaces.", "",
            "Painel(aluno : Aluno) : PainelDoAluno;ListarFases(aluno : Aluno) : ResumoDaFase[*];IniciarSessao(aluno : Aluno, codigoFase : string) : SessaoDeEstudo;Responder(aluno : Aluno, sessao : SessaoDeEstudo, resposta : Resposta) : void;ConcluirFase(aluno : Aluno, sessao : SessaoDeEstudo) : ResultadoDaConclusao"},
        {"SessaoDeEstudo", "Aplicação", "classe", "A fase aberta: fila de cartas; carta com Errei volta para o fim da fila.", "TotalDeCartas : int;Respondidas : int;Terminou : bool", "Avancar(resposta : Resposta) : Flashcard"},
        {"TabelaDeRecompensas", "Aplicação", "classe", "XP e moedas de cada fase e as faixas de nível, lidos do recompensas.json da API.", "", "PremioDe(codigoFase : string) : Premio;NivelPorXp(xp : int) : int"},
        {"IRelogio", "Aplicação", "interface", "De onde vem o dia de hoje (nos testes, um relógio falso).", "", "Hoje() : DateOnly"},
        {"Usuario", "Domínio", "abstrata", "Classe abstrata: quem usa o programa. O construtor confere o nickname.", "Id : int;Nickname : string;DataCriacao : DateTime", "Perfil() : string"},
        {"Aluno", "Domínio", "classe", "O aluno. XP e moedas só mudam por ReceberPremio (encapsulamento), uma vez por fase.", "Xp : int;Moedas : int", "JaConcluiu(codigoFase : string) : bool;ReceberPremio(codigoFase : string, premio : Premio) : bool"},
        {"FaseConcluida", "Domínio", "classe", "Registro de que o aluno concluiu uma fase e já recebeu o prêmio.", "CodigoFase : string;DataConclusao : DateTime", ""},
        {"Fase", "Domínio", "classe", "Uma disciplina da trilha, com as suas cartas.", "Codigo : string;Descricao : string;Ordem : int", ""},
        {"Flashcard", "Domínio", "classe", "Uma carta: pergunta, resposta e dica.", "Frente : string;Verso : string;Dica : string", ""},
        {"Revisao", "Domínio", "classe", "Estado de uma carta para um aluno: repetições, intervalo, fator e próxima revisão.", "Repeticoes : int;IntervaloDias : double;FatorFacilidade : double;ProximaRevisao : DateOnly",
            "Registrar(resposta : Resposta, agendador : IAgendadorDeRevisao, hoje : DateOnly) : void;VenceAte(dia : DateOnly) : bool"},
        {"IAgendadorDeRevisao", "Domínio", "interface", "Calcula quando a carta volta (permite trocar o algoritmo).", "", "Calcular(atual : Agendamento, resposta : Resposta) : Agendamento"},
        {"AgendadorSm2", "Domínio", "classe", "SM-2 no estilo do Anki, a mesma regra do site, do app e da API.", "", "Calcular(atual : Agendamento, resposta : Resposta) : Agendamento"},
        {"IRepositorioDeAlunos", "Domínio", "interface", "Contrato para buscar e guardar alunos.", "", "ObterPorNickname(nickname : string) : Aluno;Adicionar(aluno : Aluno) : void"},
        {"IRepositorioDeFases", "Domínio", "interface", "Contrato para ler as fases com as cartas.", "", "ListarComCartas() : Fase[*];ObterComCartas(codigo : string) : Fase"},
        {"IRepositorioDeRevisoes", "Domínio", "interface", "Contrato para ler e guardar as revisões do aluno.", "", "DoAluno(alunoId : int) : Revisao[*];Adicionar(revisao : Revisao) : void"},
        {"IUnidadeDeTrabalho", "Domínio", "interface", "Grava de uma vez tudo o que mudou.", "", "Salvar() : void"},
        {"ContextoNexTI", "Infraestrutura", "classe", "DbContext do EF Core com SQLite: cada DbSet vira uma tabela (migration Inicial).", "", "OnModelCreating(modelo : ModelBuilder) : void"},
        {"RepositorioDeAlunos", "Infraestrutura", "classe", "Implementa IRepositorioDeAlunos com EF Core.", "", ""},
        {"RepositorioDeFases", "Infraestrutura", "classe", "Implementa IRepositorioDeFases com EF Core.", "", ""},
        {"RepositorioDeRevisoes", "Infraestrutura", "classe", "Implementa IRepositorioDeRevisoes com EF Core.", "", ""},
        {"UnidadeDeTrabalho", "Infraestrutura", "classe", "Implementa IUnidadeDeTrabalho: chama SaveChanges do contexto.", "", ""},
    };

    /** Dois diagramas: as camadas (quem usa quem) e o domínio (herança, associações e composição). */
    private static void classesDoPrograma(IPackage pacote) throws Exception {
        Map<String, IPackage> camadas = new LinkedHashMap<>();
        for (String[] c : new String[][] {
            {"Apresentação", "Projeto NexTI.Desktop.Apresentacao (Windows Forms): as telas. Só fala com a Aplicação."},
            {"Aplicação", "Projeto NexTI.Desktop.Aplicacao: os casos de uso. Usa o Domínio e as interfaces dele."},
            {"Domínio", "Projeto NexTI.Desktop.Dominio: entidades, regras (SM-2) e interfaces dos repositórios. Não depende de nenhum outro projeto."},
            {"Infraestrutura", "Projeto NexTI.Desktop.Infraestrutura: EF Core com SQLite; implementa as interfaces do Domínio."},
        }) camadas.put(c[0], pacote(pacote, c[0], c[1]));

        for (String[] c : CLASSES) {
            IPackage dono = camadas.get(c[1]);
            IClass k;
            try {
                k = c[2].equals("interface") ? modelo.createInterface(dono, c[0]) : modelo.createClass(dono, c[0]);
            } catch (com.change_vision.jude.api.inf.exception.InvalidEditingException ex) {
                throw new IllegalStateException("Não consegui criar " + c[0] + " em " + c[1] + ": " + ex.getMessage(), ex);
            }
            if (c[2].equals("abstrata")) k.setAbstract(true);
            k.setDefinition(c[3] + " (camada " + c[1] + ")");
            classes.put(c[0], k);
        }
        // Membros só depois de todas as classes existirem: um parâmetro de tipo ainda inexistente
        // faria o Astah criar sozinho uma classe provisória com o mesmo nome.
        for (String[] c : CLASSES)
            membros(classes.get(c[0]), c[4].isEmpty() ? new String[0] : c[4].split(";"), c[5].isEmpty() ? new String[0] : c[5].split(";"));

        // Uma linha por camada; cada implementação fica logo abaixo da sua interface.
        String[][] nasCamadas = {
            {"TelaEntrada", "TelaPrincipal", "TelaEstudo", "SessaoDeEstudo", "IRelogio"},
            {"ServicoDeAlunos", "ServicoDeEstudo", "", "TabelaDeRecompensas", ""},
            {"IRepositorioDeAlunos", "IRepositorioDeFases", "IRepositorioDeRevisoes", "IUnidadeDeTrabalho", "IAgendadorDeRevisao"},
            {"RepositorioDeAlunos", "RepositorioDeFases", "RepositorioDeRevisoes", "UnidadeDeTrabalho", "AgendadorSm2"},
            {"", "", "ContextoNexTI", "", ""},
        };
        String[][] relCamadas = {
            {"usa", "TelaEntrada", "ServicoDeAlunos"}, {"usa", "TelaPrincipal", "ServicoDeEstudo"}, {"usa", "TelaEstudo", "ServicoDeEstudo"},
            {"usa", "TelaEstudo", "SessaoDeEstudo"},
            {"usa", "ServicoDeAlunos", "IRepositorioDeAlunos"}, {"usa", "ServicoDeAlunos", "IUnidadeDeTrabalho"},
            {"usa", "ServicoDeEstudo", "IRepositorioDeFases"}, {"usa", "ServicoDeEstudo", "IRepositorioDeRevisoes"},
            {"usa", "ServicoDeEstudo", "IUnidadeDeTrabalho"}, {"usa", "ServicoDeEstudo", "IAgendadorDeRevisao"},
            {"usa", "ServicoDeEstudo", "TabelaDeRecompensas"}, {"usa", "ServicoDeEstudo", "IRelogio"}, {"usa", "ServicoDeEstudo", "SessaoDeEstudo"},
            {"implementa", "AgendadorSm2", "IAgendadorDeRevisao"},
            {"implementa", "RepositorioDeAlunos", "IRepositorioDeAlunos"}, {"implementa", "RepositorioDeFases", "IRepositorioDeFases"},
            {"implementa", "RepositorioDeRevisoes", "IRepositorioDeRevisoes"}, {"implementa", "UnidadeDeTrabalho", "IUnidadeDeTrabalho"},
            {"usa", "RepositorioDeAlunos", "ContextoNexTI"}, {"usa", "RepositorioDeFases", "ContextoNexTI"},
            {"usa", "RepositorioDeRevisoes", "ContextoNexTI"}, {"usa", "UnidadeDeTrabalho", "ContextoNexTI"},
        };
        diagramaDeClasses(pacote, "2. Classes - camadas",
            "As quatro camadas do programa (cada uma é um projeto): telas → serviços → interfaces do domínio ← implementações com EF Core. As linhas tracejadas com seta aberta são \"usa\"; as com triângulo, \"implementa\".",
            nasCamadas, relCamadas, Map.of());

        String[][] doDominio = {
            {"", "Usuario", ""},
            {"FaseConcluida", "Aluno", ""},
            {"Fase", "Revisao", "IAgendadorDeRevisao"},
            {"Flashcard", "", "AgendadorSm2"},
        };
        String[][] relDominio = {
            {"herda", "Aluno", "Usuario"},
            {"associa", "Aluno", "FaseConcluida", "concluiu"}, {"associa", "Fase", "Flashcard", "tem"},
            {"associa", "Aluno", "Revisao", "revisa"}, {"associa", "Revisao", "Flashcard", "da carta"},
            {"usa", "Revisao", "IAgendadorDeRevisao"}, {"implementa", "AgendadorSm2", "IAgendadorDeRevisao"},
        };
        // multiplicidades (lado "de", lado "para") e composição no lado "de"
        Map<String, String[]> mult = Map.of(
            "Aluno|FaseConcluida", new String[] {"1", "0..*", "composta"}, "Fase|Flashcard", new String[] {"1", "1..*", "composta"},
            "Aluno|Revisao", new String[] {"1", "0..*", ""}, "Revisao|Flashcard", new String[] {"0..*", "1", ""});
        diagramaDeClasses(pacote, "3. Classes - domínio",
            "As entidades do domínio: herança (Aluno é um Usuario), composição (o aluno é dono das fases concluídas; a fase, das cartas), associações com multiplicidade e a interface do SM-2.",
            doDominio, relDominio, mult);
    }

    private static void diagramaDeClasses(IPackage pacote, String nome, String definicao, String[][] grade, String[][] rels,
                                          Map<String, String[]> mult) throws Exception {
        String[] nomes = java.util.Arrays.stream(grade).flatMap(java.util.Arrays::stream).filter(c -> !c.isEmpty()).toArray(String[]::new);
        ClassDiagramEditor d = projeto.getDiagramEditorFactory().getClassDiagramEditor();
        d.createClassDiagram(pacote, nome).setDefinition(definicao);
        Map<String, INodePresentation> p = new HashMap<>();
        for (String c : nomes) {
            INodePresentation n = d.createNodePresentation(classes.get(c), ponto(30, 30));
            IClass k = classes.get(c);
            int maior = c.length() + 14;
            for (IAttribute a : k.getAttributes()) maior = Math.max(maior, (a.getName() + " : " + a.getTypeExpression()).length() + 3);
            for (IOperation o : k.getOperations()) maior = Math.max(maior, textoDaOperacao(o).length() + 3);
            n.setWidth(Math.max(130, maior * 6.6 + 16));
            n.setHeight(40 + 16 * (k.getAttributes().length + k.getOperations().length) + 14);
            if (java.util.Arrays.asList(k.getStereotypes()).contains("interface")) n.setProperty("notation_type", "normal");
            p.put(c, n);
        }
        emGrade(grade, p);
        for (String[] r : rels) {
            if (r[0].equals("associa")) {
                String[] m = mult.get(r[1] + "|" + r[2]);
                IAssociation as = modelo.createAssociation(classes.get(r[1]), classes.get(r[2]), r[3], "", "");
                for (IAttribute ponta : as.getMemberEnds()) {
                    boolean doDe = ponta.getType() == classes.get(r[1]);
                    ponta.setMultiplicityStrings(new String[][] {faixa(doDe ? m[0] : m[1])});
                    if (doDe && m[2].equals("composta")) ponta.setComposite();
                }
                d.createLinkPresentation(as, p.get(r[1]), p.get(r[2]));
            } else {
                d.createLinkPresentation(relacao(r[0], r[1], r[2]), p.get(r[1]), p.get(r[2]));
            }
        }
    }

    private static String textoDaOperacao(IOperation o) {
        StringBuilder s = new StringBuilder(o.getName()).append("(");
        var params = o.getParameters();
        for (int i = 0; i < params.length; i++) s.append(i > 0 ? ", " : "").append(params[i].getName()).append(" : ").append(params[i].getTypeExpression());
        return s.append(") : ").append(o.getReturnTypeExpression()).toString();
    }

    private static IElement relacao(String tipo, String de, String para) throws Exception {
        String chave = tipo + "|" + de + "|" + para;
        IElement r = relacoes.get(chave);
        if (r != null) return r;
        IClass a = classes.get(de), b = classes.get(para);
        r = switch (tipo) {
            case "implementa" -> modelo.createRealization(a, b, "");
            case "herda" -> modelo.createGeneralization(a, b, "");
            default -> modelo.createDependency(b, a, "usa");   // "de" usa "para"
        };
        relacoes.put(chave, r);
        return r;
    }

    // ------------------------------------------------------------------ 4. sequência

    private static void sequencia(IPackage pacote) throws Exception {
        SequenceDiagramEditor sd = projeto.getDiagramEditorFactory().getSequenceDiagramEditor();
        sd.createSequenceDiagram(pacote, "4. Sequência - responder carta e concluir fase")
            .setDefinition("O aluno responde a última carta da fase: a tela chama o serviço, o SM-2 calcula a próxima revisão, o EF Core grava, e a fase é concluída com o prêmio (só na primeira vez).");
        String[][] linhas = {
            {"aluno", "Aluno", "O aluno usando o programa."},
            {"tela", ":TelaEstudo", "A tela de estudo (Apresentação)."},
            {"servico", ":ServicoDeEstudo", "O serviço com os casos de uso do estudo (Aplicação)."},
            {"sessao", ":SessaoDeEstudo", "A fila de cartas da fase aberta (Aplicação)."},
            {"revisao", ":Revisao", "O estado da carta para este aluno (Domínio)."},
            {"sm2", ":AgendadorSm2", "A regra do SM-2 (Domínio)."},
            {"alunoObj", ":Aluno", "A entidade do aluno, com XP e moedas (Domínio)."},
            {"unidade", ":UnidadeDeTrabalho", "Grava no SQLite pelo EF Core (Infraestrutura)."},
        };
        // {de, para, texto} = chamada; {de, para, texto, "retorno"} = resposta à última chamada de "para" para "de"
        String[][] msgs = {
            {"aluno", "tela", "clica \"3 Bom\""},
            {"tela", "servico", "Responder(aluno, sessao, Bom)"},
            {"servico", "sessao", "Avancar(Bom)"},
            {"sessao", "servico", "carta", "retorno"},
            {"servico", "revisao", "Registrar(Bom, agendador, hoje)"},
            {"revisao", "sm2", "Calcular(atual, Bom)"},
            {"sm2", "revisao", "novo agendamento", "retorno"},
            {"revisao", "servico", "próxima revisão marcada", "retorno"},
            {"servico", "unidade", "Salvar()"},
            {"unidade", "servico", "gravado", "retorno"},
            {"servico", "tela", "ok", "retorno"},
            {"tela", "sessao", "Terminou()"},
            {"sessao", "tela", "true (era a última carta)", "retorno"},
            {"tela", "servico", "ConcluirFase(aluno, sessao)"},
            {"servico", "alunoObj", "ReceberPremio(codigoFase, premio)"},
            {"alunoObj", "servico", "true (primeira vez: XP e moedas somados)", "retorno"},
            {"servico", "unidade", "Salvar()"},
            {"unidade", "servico", "gravado", "retorno"},
            {"servico", "tela", "ResultadoDaConclusao (prêmio, próxima fase)", "retorno"},
            {"tela", "aluno", "mostra \"Fase concluída! +XP e moedas\""},
        };

        Map<String, INodePresentation> vida = new HashMap<>();
        for (int i = 0; i < linhas.length; i++) {
            INodePresentation l = sd.createLifeline(linhas[i][1], 30 + i * 170);
            ((INamedElement) l.getModel()).setDefinition(linhas[i][2]);
            vida.put(linhas[i][0], l);
        }
        // 1ª passada: altura de cada mensagem e qual mensagem responde cada chamada.
        double[] alturas = new double[msgs.length];
        int[] respostaDe = new int[msgs.length];
        java.util.Arrays.fill(respostaDe, -1);
        Map<String, java.util.Deque<Integer>> abertas = new HashMap<>();
        double y = 110;
        for (int i = 0; i < msgs.length; i++) {
            String[] m = msgs[i];
            alturas[i] = y;
            boolean retorno = m.length > 3;
            if (retorno) {
                java.util.Deque<Integer> pilha = abertas.get(m[1] + ">" + m[0]);
                if (pilha != null && !pilha.isEmpty()) respostaDe[pilha.pop()] = i;
            } else if (!m[0].equals(m[1])) {
                abertas.computeIfAbsent(m[0] + ">" + m[1], k -> new java.util.ArrayDeque<>()).push(i);
            }
            y += retorno ? 35 : 45;
        }
        // 2ª passada: quem atende uma chamada faz as chamadas internas a partir da ativação dela,
        // assim o Astah estica a ativação e a resposta sai depois das chamadas internas.
        Map<Integer, ILinkPresentation> chamadas = new HashMap<>();
        Map<String, java.util.Deque<INodePresentation>> ativas = new HashMap<>();
        for (int i = 0; i < msgs.length; i++) {
            String[] m = msgs[i];
            if (m.length > 3) {
                for (var c : chamadas.entrySet())
                    if (respostaDe[c.getKey()] == i) {
                        sd.createReturnMessage(m[2], c.getValue());
                        java.util.Deque<INodePresentation> pilha = ativas.get(m[0]);
                        if (pilha != null && !pilha.isEmpty()) pilha.pop();
                        break;
                    }
                continue;
            }
            java.util.regex.Matcher chamada = java.util.regex.Pattern.compile("^([A-Za-z_][\\w.]*)\\((.*)\\)$").matcher(m[2]);
            java.util.Deque<INodePresentation> daOrigem = ativas.get(m[0]);
            INodePresentation origem = daOrigem != null && !daOrigem.isEmpty() ? daOrigem.peek() : vida.get(m[0]);
            ILinkPresentation msg = sd.createMessage(chamada.matches() ? chamada.group(1) : m[2], origem, vida.get(m[1]), alturas[i]);
            if (chamada.matches()) ((com.change_vision.jude.api.inf.model.IMessage) msg.getModel()).setArgument(chamada.group(2));
            else msg.setProperty("parameter_visibility", "false");
            if (respostaDe[i] >= 0) ativas.computeIfAbsent(m[1], k -> new java.util.ArrayDeque<>()).push(msg.getTarget());
            chamadas.put(i, msg);
        }
        for (INodePresentation l : vida.values()) l.setProperty("lifeline_length", String.valueOf(y + 20 - l.getLocation().getY()));
    }

    // ------------------------------------------------------------------ 5. atividade

    private static void atividade(IPackage pacote) throws Exception {
        ActivityDiagramEditor a = projeto.getDiagramEditorFactory().getActivityDiagramEditor();
        a.createActivityDiagram(pacote, "5. Atividade - sessão de estudo no desktop")
            .setDefinition("Do nickname até a conclusão da fase, com uma raia para o aluno e uma para cada camada do programa.");
        String[] raias = {"Aluno", "Apresentação (telas)", "Aplicação (serviços)", "Domínio (regras)", "Infraestrutura (SQLite)"};
        INodePresentation[] raia = new INodePresentation[raias.length];
        for (int i = 0; i < raias.length; i++) raia[i] = a.createPartition(null, i == 0 ? null : raia[i - 1], raias[i], false);
        final double LARGURA = 250;
        for (INodePresentation r : raia) {
            r.setWidth(LARGURA);
            r.setHeight(1440);
        }
        double inicio = raia[0].getLocation().getX();
        double[] c = new double[raias.length];
        for (int i = 0; i < raias.length; i++) c[i] = inicio + LARGURA * i + LARGURA / 2;
        final int ALUNO = 0, TELA = 1, APP = 2, DOM = 3, INFRA = 4;

        Map<INodePresentation, Integer> naRaia = new LinkedHashMap<>();
        java.util.function.BiFunction<Integer, INodePresentation, INodePresentation> registrar = (r, n) -> { naRaia.put(n, r); return n; };
        INodePresentation ini = registrar.apply(ALUNO, a.createInitialNode("Início", ponto(c[ALUNO] - 10, 50)));
        INodePresentation digita = registrar.apply(ALUNO, acao(a, "Digita o nickname", c[ALUNO], 100));
        INodePresentation entrar = registrar.apply(APP, acao(a, "Entrar(nickname)", c[APP], 100));
        INodePresentation buscaAluno = registrar.apply(INFRA, acao(a, "Busca ou cria o aluno no banco", c[INFRA], 100));
        INodePresentation trilha = registrar.apply(TELA, acao(a, "Mostra XP, moedas, nível e a trilha", c[TELA], 190));
        INodePresentation escolhe = registrar.apply(ALUNO, acao(a, "Escolhe uma fase", c[ALUNO], 270));
        INodePresentation liberada = registrar.apply(APP, a.createDecisionMergeNode(null, ponto(c[APP] - 15, 270)));
        INodePresentation trancada = registrar.apply(TELA, acao(a, "Avisa \"Fase trancada\"", c[TELA], 350));
        INodePresentation fimTrancada = registrar.apply(TELA, a.createFinalNode("Fim (fase trancada)", ponto(c[TELA] - 12, 420)));
        INodePresentation monta = registrar.apply(APP, acao(a, "Monta a fila: vencidas, novas e as demais", c[APP], 420));
        INodePresentation pergunta = registrar.apply(TELA, acao(a, "Mostra a pergunta", c[TELA], 510));
        INodePresentation pede = registrar.apply(ALUNO, acao(a, "Pede a resposta e escolhe Errei, Difícil, Bom ou Fácil", c[ALUNO], 590));
        INodePresentation registra = registrar.apply(APP, acao(a, "Responder: tira a carta da fila (Errei volta para o fim)", c[APP], 680));
        INodePresentation sm2 = registrar.apply(DOM, acao(a, "SM-2 calcula a próxima revisão", c[DOM], 760));
        INodePresentation gravaRevisao = registrar.apply(INFRA, acao(a, "Grava a revisão", c[INFRA], 840));
        INodePresentation restam = registrar.apply(TELA, a.createDecisionMergeNode(null, ponto(c[TELA] - 15, 920)));
        INodePresentation conclui = registrar.apply(APP, acao(a, "ConcluirFase", c[APP], 1010));
        INodePresentation primeira = registrar.apply(APP, a.createDecisionMergeNode(null, ponto(c[APP] - 15, 1080)));
        INodePresentation paga = registrar.apply(DOM, acao(a, "Paga XP e moedas e libera a próxima fase", c[DOM], 1072));
        INodePresentation soRevisao = registrar.apply(APP, acao(a, "Só revisão: prêmio já recebido", c[APP], 1150));
        INodePresentation junta = registrar.apply(INFRA, a.createDecisionMergeNode(null, ponto(c[INFRA] - 15, 1230)));
        INodePresentation gravaAluno = registrar.apply(INFRA, acao(a, "Grava o aluno e a fase concluída", c[INFRA], 1290));
        INodePresentation resultado = registrar.apply(TELA, acao(a, "Mostra o resultado da fase", c[TELA], 1290));
        INodePresentation fim = registrar.apply(TELA, a.createFinalNode("Fim", ponto(c[TELA] - 12, 1370)));

        fluxo(a, ini, digita, null);
        fluxo(a, digita, entrar, null);
        fluxo(a, entrar, buscaAluno, null);
        fluxo(a, buscaAluno, trilha, null);
        fluxo(a, trilha, escolhe, null);
        fluxo(a, escolhe, liberada, null);
        fluxo(a, liberada, trancada, "trancada");
        fluxo(a, trancada, fimTrancada, null);
        fluxo(a, liberada, monta, "liberada");
        fluxo(a, monta, pergunta, null);
        fluxo(a, pergunta, pede, null);
        fluxo(a, pede, registra, null);
        fluxo(a, registra, sm2, null);
        fluxo(a, sm2, gravaRevisao, null);
        fluxo(a, gravaRevisao, restam, null);
        fluxo(a, restam, pergunta, "ainda há cartas");
        fluxo(a, restam, conclui, "fila vazia");
        fluxo(a, conclui, primeira, null);
        fluxo(a, primeira, paga, "primeira vez");
        fluxo(a, primeira, soRevisao, "já concluída");
        fluxo(a, paga, junta, null);
        fluxo(a, soRevisao, junta, null);
        fluxo(a, junta, gravaAluno, null);
        fluxo(a, gravaAluno, resultado, null);
        fluxo(a, resultado, fim, null);

        // O Astah estica as raias enquanto os nós são criados. No fim, cada nó volta para o
        // centro da sua raia, usando a posição final das raias (como no GerarDiagramasPimIV).
        for (Map.Entry<INodePresentation, Integer> e : naRaia.entrySet()) {
            INodePresentation r = raia[e.getValue()], n = e.getKey();
            n.setLocation(ponto(r.getLocation().getX() + (r.getWidth() - n.getWidth()) / 2, n.getLocation().getY()));
        }
    }

    private static INodePresentation acao(ActivityDiagramEditor a, String texto, double centroX, double y) throws Exception {
        INodePresentation n = a.createAction(texto, ponto(centroX - 100, y));
        n.setWidth(200);
        n.setHeight(texto.length() > 32 ? 48 : 34);
        return n;
    }

    private static void fluxo(ActivityDiagramEditor a, INodePresentation de, INodePresentation para, String guarda) throws Exception {
        ILinkPresentation link = a.createFlow(de, para);
        if (guarda != null) ((IFlow) link.getModel()).setGuard(guarda);
    }

    // ------------------------------------------------------------------ apoio (mesmas regras do GerarDiagramasPimIV)

    private static void limpar(IModel raiz) throws Exception {
        for (IElement antigo : raiz.getDiagrams()) apagar(antigo);
        for (IElement antigo : raiz.getOwnedElements()) apagar(antigo);
        if (raiz.getDiagrams().length > 0 || raiz.getOwnedElements().length > 0)
            throw new IllegalStateException("Não consegui limpar o arquivo-base.");
    }

    private static void apagar(IElement elemento) {
        try {
            modelo.delete(elemento);
        } catch (com.change_vision.jude.api.inf.exception.InvalidEditingException jaRemovido) {
            // removido junto com o pacote que o continha
        }
    }

    private static IPackage pacote(IPackage pai, String nome, String definicao) throws Exception {
        IPackage p = modelo.createPackage(pai, nome);
        p.setDefinition(definicao);
        return p;
    }

    private static Point2D ponto(double x, double y) {
        return new Point2D.Double(x, y);
    }

    private static String[] faixa(String mult) {
        return mult.contains("..") ? mult.split("\\.\\.") : new String[] {mult};
    }

    /** "Nome : Tipo" vira atributo; "Nome(p : T, ...) : Retorno" vira operação. "[*]" no tipo vira multiplicidade 0..*. */
    private static void membros(IClass c, String[] atributos, String[] operacoes) throws Exception {
        for (String a : atributos) {
            String[] partes = a.split(" : ", 2);
            IAttribute at = modelo.createAttribute(c, partes[0].trim(), partes[1].trim());
            at.setVisibility("public");
        }
        for (String o : operacoes) {
            int abre = o.indexOf('('), fecha = o.lastIndexOf(')');
            String retorno = o.substring(o.lastIndexOf(" : ") + 3).trim();
            IOperation op = modelo.createOperation(c, o.substring(0, abre).trim(), retorno.replace("[*]", ""));
            if (retorno.endsWith("[*]")) op.setReturnTypeExpression(retorno.replace("[*]", "[]"));
            op.setVisibility("public");
            String params = o.substring(abre + 1, fecha).trim();
            if (!params.isEmpty())
                for (String prm : params.split(", ")) {
                    String[] pp = prm.split(" : ", 2);
                    modelo.createParameter(op, pp[0].trim(), pp[1].trim());
                }
        }
    }

    /**
     * Arruma as classes numa grade: cada coluna tem a largura da sua classe mais larga e cada
     * caixa fica no centro da sua célula, então quem está na mesma coluna se liga por uma reta.
     */
    private static void emGrade(String[][] grade, Map<String, INodePresentation> p) throws Exception {
        int colunas = grade[0].length;
        double[] largura = new double[colunas];
        for (String[] linha : grade)
            for (int c = 0; c < colunas; c++)
                if (!linha[c].isEmpty()) largura[c] = Math.max(largura[c], p.get(linha[c]).getWidth());
        double y = 30;
        for (String[] linha : grade) {
            double x = 30, altura = 0;
            for (int c = 0; c < colunas; c++) {
                if (!linha[c].isEmpty()) {
                    INodePresentation n = p.get(linha[c]);
                    n.setLocation(ponto(x + (largura[c] - n.getWidth()) / 2, y));
                    altura = Math.max(altura, n.getHeight());
                }
                x += largura[c] + 80;
            }
            y += altura + 120;
        }
    }

    /** Linhas dos diagramas de classes em ângulo reto, desviando das outras caixas (mesma ideia do outro gerador). */
    private static void linhasEmAnguloReto() throws Exception {
        for (INamedElement e : projeto.findElements(com.change_vision.jude.api.inf.model.IDiagram.class)) {
            if (e instanceof com.change_vision.jude.api.inf.model.IActivityDiagram atividade) {
                for (IPresentation p : atividade.getPresentations())
                    if (p instanceof ILinkPresentation l) l.setProperty("line.shape", "line_right_angle");
                continue;
            }
            if (!(e instanceof com.change_vision.jude.api.inf.model.IClassDiagram)) continue;
            var diagrama = (com.change_vision.jude.api.inf.model.IDiagram) e;
            Map<INodePresentation, Integer> saidas = new HashMap<>();
            for (IPresentation p : diagrama.getPresentations()) {
                if (!(p instanceof ILinkPresentation l)) continue;
                INodePresentation a = l.getSource(), b = l.getTarget();
                if (a == null || b == null || a == b) continue;
                int k = saidas.merge(a, 1, Integer::sum) - 1;
                double desvio = (k % 2 == 0 ? 1 : -1) * ((k + 1) / 2) * 14.0;
                List<Rectangle2D> outras = new ArrayList<>();
                for (IPresentation q : diagrama.getPresentations())
                    if (q instanceof INodePresentation n && n != a && n != b) outras.add(caixa(n));
                try {
                    l.setPoints(rota(a, b, desvio, outras));
                    l.setProperty("line.shape", "line_right_angle");
                } catch (com.change_vision.jude.api.inf.exception.InvalidEditingException recusada) {
                    // generalização não aceita pontos: fica reta (mãe e filha estão alinhadas)
                }
            }
        }
    }

    private static Point2D[] rota(INodePresentation a, INodePresentation b, double desvio, List<Rectangle2D> outras) {
        Rectangle2D ra = caixa(a), rb = caixa(b);
        double acx = ra.getCenterX(), acy = ra.getCenterY(), bcx = rb.getCenterX(), bcy = rb.getCenterY();
        List<double[]> candidatas = new ArrayList<>();
        double x0 = Math.max(ra.getMinX(), rb.getMinX()) + 15, x1 = Math.min(ra.getMaxX(), rb.getMaxX()) - 15;
        if (x1 > x0) {
            double x = limitar((x0 + x1) / 2 + desvio, x0, x1);
            candidatas.add(new double[] {x, acy, x, bcy});
        }
        double y0 = Math.max(ra.getMinY(), rb.getMinY()) + 15, y1 = Math.min(ra.getMaxY(), rb.getMaxY()) - 15;
        if (y1 > y0) {
            double y = limitar((y0 + y1) / 2 + desvio, y0, y1);
            candidatas.add(new double[] {acx, y, bcx, y});
        }
        double xa = limitar(acx + desvio, ra.getMinX() + 10, ra.getMaxX() - 10);
        double ya = limitar(acy + desvio, ra.getMinY() + 10, ra.getMaxY() - 10);
        candidatas.add(new double[] {xa, acy, xa, bcy, bcx, bcy});
        candidatas.add(new double[] {acx, ya, bcx, ya, bcx, bcy});
        double meioY = rb.getMinY() > ra.getMaxY() ? (ra.getMaxY() + rb.getMinY()) / 2
                     : ra.getMinY() > rb.getMaxY() ? (rb.getMaxY() + ra.getMinY()) / 2 : Double.NaN;
        if (!Double.isNaN(meioY)) candidatas.add(new double[] {xa, acy, xa, meioY + desvio, bcx, meioY + desvio, bcx, bcy});
        double meioX = rb.getMinX() > ra.getMaxX() ? (ra.getMaxX() + rb.getMinX()) / 2
                     : ra.getMinX() > rb.getMaxX() ? (rb.getMaxX() + ra.getMinX()) / 2 : Double.NaN;
        if (!Double.isNaN(meioX)) candidatas.add(new double[] {acx, ya, meioX + desvio, ya, meioX + desvio, bcy, bcx, bcy});
        double[] melhor = null;
        double nota = Double.MAX_VALUE;
        for (double[] c : candidatas) {
            double n = c.length * 20;
            for (int k = 0; k + 3 < c.length; k += 2) {
                java.awt.geom.Line2D seg = new java.awt.geom.Line2D.Double(c[k], c[k + 1], c[k + 2], c[k + 3]);
                n += seg.getP1().distance(seg.getP2());
                for (Rectangle2D r : outras) if (seg.intersects(r)) n += 100000;
            }
            if (n < nota) {
                nota = n;
                melhor = c;
            }
        }
        Point2D[] pontos = new Point2D[melhor.length / 2];
        for (int k = 0; k < pontos.length; k++) pontos[k] = ponto(melhor[2 * k], melhor[2 * k + 1]);
        return pontos;
    }

    private static Rectangle2D caixa(INodePresentation n) {
        return new Rectangle2D.Double(n.getLocation().getX(), n.getLocation().getY(), n.getWidth(), n.getHeight());
    }

    private static double limitar(double v, double min, double max) {
        return Math.max(min, Math.min(max, v));
    }

    // ------------------------------------------------------------------ definições

    /** Dá uma Definition a tudo o que ainda não tem: relações, mensagens, fluxos, nós, atributos e operações. */
    private static void definirTodos() throws Exception {
        for (INamedElement e : projeto.findElements(com.change_vision.jude.api.inf.model.IDiagram.class)) {
            var diagrama = (com.change_vision.jude.api.inf.model.IDiagram) e;
            for (IPresentation p : diagrama.getPresentations())
                if (p.getModel() instanceof INamedElement n && vazio(n.getDefinition())) {
                    String texto = definicao(n, diagrama.getName());
                    if (texto != null) n.setDefinition(texto);
                }
        }
        for (INamedElement e : projeto.findElements(IClass.class)) {
            IClass c = (IClass) e;
            for (IAttribute a : c.getAttributes())
                if (vazio(a.getDefinition()))
                    a.setDefinition(a.getAssociation() != null
                        ? "Ponta da associação de " + c.getName() + " com " + a.getType().getName() + "."
                        : "Campo " + a.getName() + " de " + c.getName() + ", do tipo " + a.getTypeExpression() + ".");
            for (IOperation o : c.getOperations()) {
                if (vazio(o.getDefinition()))
                    o.setDefinition("Operação " + o.getName() + " de " + c.getName() + "; devolve " + o.getReturnTypeExpression() + ".");
                for (var prm : o.getParameters())
                    if (vazio(prm.getDefinition())) prm.setDefinition("Parâmetro " + prm.getName() + " de " + o.getName() + " (" + prm.getTypeExpression() + ").");
            }
        }
    }

    private static boolean vazio(String texto) {
        return texto == null || texto.isBlank();
    }

    private static String nome(IElement e) {
        return e instanceof INamedElement n ? n.getName() : "?";
    }

    private static String definicao(INamedElement e, String diagrama) {
        if (e instanceof com.change_vision.jude.api.inf.model.IGeneralization g)
            return g.getSubType().getName() + " herda de " + g.getSuperType().getName() + ": é um " + g.getSuperType().getName() + " (herança).";
        if (e instanceof com.change_vision.jude.api.inf.model.IRealization r)
            return r.getClient().getName() + " implementa a interface " + r.getSupplier().getName() + ".";
        if (e instanceof com.change_vision.jude.api.inf.model.IDependency dep)
            return dep.getClient().getName() + " usa " + dep.getSupplier().getName() + " (recebe pelo construtor).";
        if (e instanceof com.change_vision.jude.api.inf.model.IInclude inc)
            return inc.getIncludingCase().getName() + " sempre inclui " + inc.getAddition().getName() + " («include»).";
        if (e instanceof com.change_vision.jude.api.inf.model.IExtend ext)
            return ext.getExtension().getName() + " estende " + ext.getExtendedCase().getName() + " quando a última carta é acertada («extend»).";
        if (e instanceof IAssociation as) {
            IAttribute[] pontas = as.getMemberEnds();
            String a = pontas[0].getType().getName(), b = pontas[1].getType().getName();
            if (pontas[0].getType() instanceof IUseCase || pontas[1].getType() instanceof IUseCase)
                return "O aluno participa deste caso de uso: " + a + " — " + b + ".";
            boolean composicao = pontas[0].isComposite() || pontas[1].isComposite();
            return (composicao ? "Composição" : "Associação") + (vazio(as.getName()) ? "" : " \"" + as.getName() + "\"") + " entre " + a + " e " + b
                + (composicao ? " (a parte não existe sem o todo)." : ".");
        }
        if (e instanceof com.change_vision.jude.api.inf.model.IMessage msg)
            return "Mensagem de " + nome(msg.getSource()) + " para " + nome(msg.getTarget()) + ": " + msg.getName() + (msg.isReturnMessage() ? " (resposta)." : ".");
        if (e instanceof com.change_vision.jude.api.inf.model.IPartition raia && raia.getName().startsWith("Dimension"))
            return "Cabeçalho das raias do diagrama de atividade.";
        if (e instanceof com.change_vision.jude.api.inf.model.IPartition raia)
            return "Raia " + raia.getName() + ": o que acontece nesta parte do programa.";
        if (e instanceof IFlow f)
            return "Fluxo de \"" + nome(f.getSource()) + "\" para \"" + nome(f.getTarget()) + "\"" + (vazio(f.getGuard()) ? "." : " quando [" + f.getGuard() + "].");
        if (e instanceof com.change_vision.jude.api.inf.model.IControlNode no) {
            if (no.isInitialNode()) return "Início: o aluno abre o programa.";
            if (no.isFinalNode()) return "Fim do fluxo: " + no.getName() + ".";
            StringBuilder saidas = new StringBuilder();
            for (IFlow f : no.getOutgoings())
                if (!vazio(f.getGuard())) saidas.append(saidas.length() == 0 ? "" : " ou ").append(f.getGuard());
            return saidas.length() == 0 ? "Junta os caminhos antes de gravar." : "Decisão: segue conforme " + saidas + ".";
        }
        if (e instanceof com.change_vision.jude.api.inf.model.IAction acao) return "Ação: " + acao.getName() + ".";
        if (e instanceof IClass || e instanceof IUseCase) return null;
        return e.getName() + " (elemento de " + diagrama + ").";
    }
}
