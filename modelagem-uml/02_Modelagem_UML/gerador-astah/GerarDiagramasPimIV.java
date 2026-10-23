import com.change_vision.jude.api.inf.AstahAPI;
import com.change_vision.jude.api.inf.editor.ActivityDiagramEditor;
import com.change_vision.jude.api.inf.editor.BasicModelEditor;
import com.change_vision.jude.api.inf.editor.ClassDiagramEditor;
import com.change_vision.jude.api.inf.editor.ModelEditorFactory;
import com.change_vision.jude.api.inf.editor.TransactionManager;
import com.change_vision.jude.api.inf.editor.UseCaseDiagramEditor;
import com.change_vision.jude.api.inf.editor.UseCaseModelEditor;
import com.change_vision.jude.api.inf.model.IAssociation;
import com.change_vision.jude.api.inf.model.IAttribute;
import com.change_vision.jude.api.inf.model.IClass;
import com.change_vision.jude.api.inf.model.IElement;
import com.change_vision.jude.api.inf.model.IFlow;
import com.change_vision.jude.api.inf.model.IModel;
import com.change_vision.jude.api.inf.model.IOperation;
import com.change_vision.jude.api.inf.model.IPackage;
import com.change_vision.jude.api.inf.model.IUseCase;
import com.change_vision.jude.api.inf.presentation.ILinkPresentation;
import com.change_vision.jude.api.inf.presentation.INodePresentation;
import com.change_vision.jude.api.inf.project.ProjectAccessor;
import java.awt.geom.Point2D;
import java.util.HashMap;
import java.util.Map;

/**
 * Gera "Diagrams Nex_TI - PIM IV.asta" pela API do Astah UML (10.1), com os diagramas
 * do código atual: casos de uso por perfil, classes (entidades e camadas da API) e a
 * atividade da sessão de estudo. O arquivo do PIM III não é tocado.
 *
 * A API exige Java 21; o Astah já traz um (pasta jre). Uso:
 *   "C:\Program Files\astah-uml\jre\bin\java.exe" -cp "C:\Program Files\astah-uml\astah-uml.jar;C:\Program Files\astah-uml\astah-api.jar;C:\Program Files\astah-uml\lib\*" GerarDiagramasPimIV.java "<saida.asta>" "<base.asta>"
 */
public class GerarDiagramasPimIV {

    private static ProjectAccessor projeto;
    private static BasicModelEditor modelo;
    private static final Map<String, IClass> classes = new HashMap<>();

    public static void main(String[] args) throws Exception {
        // Com a licença acadêmica, a API não salva um projeto criado do zero (LicenseNotFoundException),
        // mas salva um arquivo aberto. Por isso parte de uma CÓPIA de um .asta existente (args[1]),
        // apaga todo o conteúdo dela e monta os diagramas. O arquivo-base não é alterado.
        java.nio.file.Files.copy(java.nio.file.Path.of(args[1]), java.nio.file.Path.of(args[0]),
            java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        projeto = AstahAPI.getAstahAPI().getProjectAccessor();
        projeto.open(args[0], true, false, false);
        try {
            TransactionManager.beginTransaction();
            modelo = ModelEditorFactory.getBasicModelEditor();
            IModel raiz = projeto.getProject();
            for (IElement antigo : raiz.getDiagrams()) modelo.delete(antigo);
            for (IElement antigo : raiz.getOwnedElements()) modelo.delete(antigo);
            IPackage pimIV = modelo.createPackage(raiz, "Nex_TI - PIM IV");

            casosDeUso(modelo.createPackage(pimIV, "Casos de uso"));
            entidades(modelo.createPackage(pimIV, "Modelo (entidades)"));
            camadas(modelo.createPackage(pimIV, "API (camadas)"));
            atividade(pimIV);

            TransactionManager.endTransaction();
            projeto.save();
            System.out.println("Gerado: " + args[0]);
        } catch (Exception e) {
            // O Astah desvia o System.err para o log dele; o erro vai para a saída normal.
            System.out.println("FALHOU: " + e);
            e.printStackTrace(System.out);
            TransactionManager.abortTransaction();
            System.exit(1);
        } finally {
            projeto.close();
        }
    }

    // ------------------------------------------------------------------ casos de uso

    private static void casosDeUso(IPackage pacote) throws Exception {
        UseCaseModelEditor uc = ModelEditorFactory.getUseCaseModelEditor();
        UseCaseDiagramEditor d = projeto.getDiagramEditorFactory().getUseCaseDiagramEditor();
        d.createUseCaseDiagram(pacote, "1. Casos de Uso - perfis do PIM IV");

        d.createRect(new Point2D.Double(250, 20), 600, 780);
        d.createText("Sistema Nex_TI (site, app e API)", new Point2D.Double(270, 30));

        IClass aluno = uc.createActor(pacote, "Aluno");
        IClass tutor = uc.createActor(pacote, "Tutor");
        IClass admin = uc.createActor(pacote, "Administrador");
        INodePresentation pAluno = d.createNodePresentation(aluno, new Point2D.Double(70, 200));
        INodePresentation pTutor = d.createNodePresentation(tutor, new Point2D.Double(70, 470));
        INodePresentation pAdmin = d.createNodePresentation(admin, new Point2D.Double(70, 680));
        d.createLinkPresentation(modelo.createGeneralization(tutor, aluno, ""), pTutor, pAluno);
        d.createLinkPresentation(modelo.createGeneralization(admin, tutor, ""), pAdmin, pTutor);

        String[] doAluno = {
            "Cadastrar-se e fazer login", "Fazer diagnóstico de nivelamento", "Estudar flashcards",
            "Realizar simulado ENADE", "Ver estatísticas e progresso", "Ajustar acessibilidade", "Gerenciar minha conta",
        };
        Map<String, IUseCase> casos = new HashMap<>();
        Map<String, INodePresentation> pCasos = new HashMap<>();
        double y = 70;
        for (String nome : doAluno) {
            IUseCase caso = uc.createUseCase(pacote, nome);
            INodePresentation p = d.createNodePresentation(caso, new Point2D.Double(300, y));
            p.setWidth(230);
            p.setHeight(46);
            d.createLinkPresentation(modelo.createAssociation(aluno, caso, "", "", ""), pAluno, p);
            casos.put(nome, caso);
            pCasos.put(nome, p);
            y += 62;
        }
        y = 520;
        for (String[] item : new String[][] {
                {"Acompanhar alunos (painel do Tutor)", "Tutor"}, {"Editar ou excluir cartas", "Tutor"},
                {"Definir perfis de acesso", "Administrador"}}) {
            IUseCase caso = uc.createUseCase(pacote, item[0]);
            INodePresentation p = d.createNodePresentation(caso, new Point2D.Double(300, y));
            p.setWidth(230);
            p.setHeight(46);
            boolean doTutor = item[1].equals("Tutor");
            d.createLinkPresentation(modelo.createAssociation(doTutor ? tutor : admin, caso, "", "", ""), doTutor ? pTutor : pAdmin, p);
            y += doTutor ? 70 : 90;
        }

        // Inclusões e extensões, à direita
        IUseCase sm2 = uc.createUseCase(pacote, "Calcular revisão (SM-2)");
        INodePresentation pSm2 = d.createNodePresentation(sm2, new Point2D.Double(600, 165));
        pSm2.setWidth(210);
        pSm2.setHeight(46);
        d.createLinkPresentation(uc.createInclude(sm2, casos.get("Estudar flashcards"), ""), pCasos.get("Estudar flashcards"), pSm2);
        d.createLinkPresentation(uc.createInclude(sm2, casos.get("Realizar simulado ENADE"), ""), pCasos.get("Realizar simulado ENADE"), pSm2);

        IUseCase offline = uc.createUseCase(pacote, "Estudar sem internet (fila no app)");
        INodePresentation pOffline = d.createNodePresentation(offline, new Point2D.Double(600, 60));
        pOffline.setWidth(210);
        pOffline.setHeight(46);
        d.createLinkPresentation(uc.createExtend(casos.get("Estudar flashcards"), offline, ""), pOffline, pCasos.get("Estudar flashcards"));

        IUseCase exportar = uc.createUseCase(pacote, "Exportar ou excluir meus dados");
        INodePresentation pExportar = d.createNodePresentation(exportar, new Point2D.Double(600, 440));
        pExportar.setWidth(210);
        pExportar.setHeight(46);
        d.createLinkPresentation(uc.createExtend(casos.get("Gerenciar minha conta"), exportar, ""), pExportar, pCasos.get("Gerenciar minha conta"));

        d.createNote("Generalização: o Tutor faz tudo o que o Aluno faz,\ne o Administrador tudo o que o Tutor faz\n(campo Perfil de Usuario, conferido pela API).",
            new Point2D.Double(560, 640));
    }

    // ------------------------------------------------------------------ classes: entidades

    private static void entidades(IPackage pacote) throws Exception {
        ClassDiagramEditor d = projeto.getDiagramEditorFactory().getClassDiagramEditor();
        d.createClassDiagram(pacote, "2. Classes - entidades do domínio");

        Map<String, INodePresentation> p = new HashMap<>();
        p.put("Usuario", classe(d, pacote, "Usuario", 20, 200, new String[] {
            "Id : int", "Username : string", "Email : string", "SenhaHash : string", "Perfil : string = \"Aluno\"",
            "Nivel : int = 1", "XP : int = 0", "Moedas : int = 0", "DataCriacao : DateTime"}, new String[0]));
        p.put("Aluno", classe(d, pacote, "Aluno", 20, 470, new String[0], new String[] {"EstudarFlashCard() : void"}));
        p.put("Tutor", classe(d, pacote, "Tutor", 230, 470, new String[0], new String[] {"GerenciarConteudo() : void"}));
        p.put("Fase", classe(d, pacote, "Fase", 480, 40, new String[] {"CodigoFase : string", "Descricao : string"}, new String[0]));
        p.put("Flashcard", classe(d, pacote, "Flashcard", 460, 220, new String[] {
            "Id : int", "CodigoFase : string", "Frente : string", "Verso : string", "Dica : string [0..1]",
            "Opcoes : List<string> [0..1]", "Correta : int [0..1]"}, new String[0]));
        p.put("ProgressoFlashcard", classe(d, pacote, "ProgressoFlashcard", 460, 470, new String[] {
            "UsuarioId : int", "FlashcardId : int", "Repeticoes : int = 0", "IntervaloDias : double = 0",
            "FatorFacilidade : double = 2.5", "DataProximaRevisao : DateTime"}, new String[0]));
        p.put("CartaModerada", classe(d, pacote, "CartaModerada", 740, 220, new String[] {
            "Id : int", "CodigoFase : string", "Frente : string", "DataModeracao : DateTime"}, new String[0]));
        p.put("AreaConhecimento", classe(d, pacote, "AreaConhecimento", 1000, 40, new String[] {"Id : int", "NomeArea : string"}, new String[0]));
        p.put("Questao", classe(d, pacote, "Questao", 1000, 220, new String[] {
            "Id : int", "IdArea : int", "Enunciado : string", "Origem : string [0..1]"}, new String[0]));
        p.put("Alternativa", classe(d, pacote, "Alternativa", 940, 470, new String[] {
            "Id : int", "IdQuestao : int", "Texto : string", "IsCorreta : bool"}, new String[0]));
        p.put("Prova", classe(d, pacote, "Prova", 1150, 470, new String[] {"Id : int", "Ano : int", "Tipo : string"}, new String[0]));

        heranca(d, p, "Aluno", "Usuario");
        heranca(d, p, "Tutor", "Usuario");
        associacao(d, p, "Fase", "1", "Flashcard", "0..*", "contém", true);
        associacao(d, p, "Fase", "1", "CartaModerada", "0..*", "lembra", false);
        associacao(d, p, "Usuario", "1", "ProgressoFlashcard", "0..*", "possui", false);
        associacao(d, p, "Flashcard", "1", "ProgressoFlashcard", "0..*", "revisado em", false);
        associacao(d, p, "AreaConhecimento", "1", "Questao", "0..*", "classifica", false);
        associacao(d, p, "Questao", "1", "Alternativa", "0..*", "tem", true);
        associacao(d, p, "Questao", "0..*", "Prova", "0..*", "aparece em", false);

        INodePresentation nota = d.createNote("Estado do SM-2 por aluno e carta\n(chave composta UsuarioId + FlashcardId).", new Point2D.Double(460, 640));
        d.createNoteAnchor(nota, p.get("ProgressoFlashcard"));
    }

    // ------------------------------------------------------------------ classes: camadas

    private static void camadas(IPackage pacote) throws Exception {
        ClassDiagramEditor d = projeto.getDiagramEditorFactory().getClassDiagramEditor();
        d.createClassDiagram(pacote, "3. Classes - camadas da API");
        IPackage rotas = modelo.createPackage(pacote, "Endpoints");
        IPackage servicos = modelo.createPackage(pacote, "Services");
        IPackage dados = modelo.createPackage(pacote, "Data");
        Map<String, INodePresentation> p = new HashMap<>();

        d.createText("Apresentação (Endpoints)", new Point2D.Double(20, 10));
        p.put("EndpointExtensions", classe(d, rotas, "EndpointExtensions", 20, 30, new String[0], new String[] {
            "MapNexTiEndpoints(app : IEndpointRouteBuilder) : void", "IdDoUsuario(usuario : ClaimsPrincipal) : int [0..1]",
            "ParaHttp<T>(resultado : Resultado<T>, sucesso : Func<T, IResult>) : IResult"}));
        p.put("ContaEndpoints", classe(d, rotas, "ContaEndpoints", 640, 30, new String[0], new String[] {
            "MapContaEndpoints(app : IEndpointRouteBuilder) : void"}));
        classes.get("EndpointExtensions").addStereotype("static");
        classes.get("ContaEndpoints").addStereotype("static");

        d.createText("Serviços (regras de negócio): cada interface tem uma classe que a implementa", new Point2D.Double(20, 168));
        String[][] pares = {
            {"IAuthService", "AuthService", "CadastrarAsync(...) : Task<Resultado<Usuario>>", "EntrarAsync(...) : Task<Resultado<Sessao>>"},
            {"IProgressoService", "ProgressoService", "RegistrarRespostaAsync(...) : Task<ProgressoFlashcard>", "EstatisticasAsync(username : string) : Task<Resultado<...>>"},
            {"IGamificacaoService", "GamificacaoService", "PerfilAsync(username : string) : Task<PerfilUsuario>", "AtualizarAsync(...) : Task<Resultado<Usuario>>"},
            {"IConteudoService", "ConteudoService", "ListarFlashcardsAsync(codigoFase : string) : Task<List<Flashcard>>", "EditarFlashcardAsync(...) : Task<Resultado<Flashcard>>"},
            {"IAdminService", "AdminService", "PainelDosAlunosAsync() : Task<List<AlunoNoPainel>>", "DefinirPerfilAsync(...) : Task<Resultado<UsuarioResumo>>"},
            {"IContaService", "ContaService", "AlterarSenhaAsync(...) : Task<Resultado<bool>>", "ExcluirAsync(...) : Task<Resultado<bool>>"},
        };
        double x = 20;
        for (int i = 0; i < pares.length; i++) {
            String[] par = pares[i];
            double linha = i < 3 ? 200 : 430;
            if (i == 3) x = 20;
            INodePresentation pi = interfaceNo(d, servicos, par[0], x, linha, new String[] {par[2], par[3]});
            INodePresentation pc = classe(d, servicos, par[1], x + 60, linha + 130, new String[0], new String[0]);
            d.createLinkPresentation(modelo.createRealization(classes.get(par[1]), classes.get(par[0]), ""), pc, pi);
            p.put(par[0], pi);
            p.put(par[1], pc);
            x += pi.getWidth() + 40;
        }
        for (String[] par : pares)
            d.createLinkPresentation(modelo.createDependency(classes.get(par[0]),
                classes.get(par[0].equals("IContaService") ? "ContaEndpoints" : "EndpointExtensions"), "usa"),
                p.get(par[0].equals("IContaService") ? "ContaEndpoints" : "EndpointExtensions"), p.get(par[0]));

        d.createText("Dados (persistência)", new Point2D.Double(20, 650));
        p.put("AppDbContext", classe(d, dados, "AppDbContext", 20, 670, new String[] {
            "Usuarios : DbSet<Usuario>", "Flashcards : DbSet<Flashcard>", "Progresso_Flashcards : DbSet<ProgressoFlashcard>",
            "Questoes : DbSet<Questao>", "CartasModeradas : DbSet<CartaModerada>"}, new String[0]));
        p.put("DbContext", classe(d, dados, "DbContext", 420, 690, new String[0], new String[0]));
        classes.get("DbContext").addStereotype("EF Core");
        heranca(d, p, "AppDbContext", "DbContext");
        for (String[] par : pares)
            d.createLinkPresentation(modelo.createDependency(classes.get("AppDbContext"), classes.get(par[1]), ""), p.get(par[1]), p.get("AppDbContext"));

        d.createNote("Os endpoints dependem só das interfaces;\no Program.cs liga cada uma à sua classe\n(injeção de dependência).", new Point2D.Double(700, 680));
    }

    // ------------------------------------------------------------------ atividade

    private static void atividade(IPackage pacote) throws Exception {
        ActivityDiagramEditor a = projeto.getDiagramEditorFactory().getActivityDiagramEditor();
        a.createActivityDiagram(pacote, "4. Atividade - sessão de estudo com flashcards");

        String[] raias = {"Aluno", "Site ou app", "API (.NET)", "Banco de dados"};
        INodePresentation[] raia = new INodePresentation[raias.length];
        double[] centro = new double[raias.length];
        for (int i = 0; i < raias.length; i++)
            raia[i] = a.createPartition(null, i == 0 ? null : raia[i - 1], raias[i], false);
        // Todas com a mesma largura. Depois de setWidth o Astah ainda devolve as posições
        // antigas das raias vizinhas, então o centro de cada uma é calculado a partir da primeira.
        final double LARGURA = 280;
        for (INodePresentation r : raia) {
            r.setWidth(LARGURA);
            r.setHeight(1540);
        }
        double inicio = raia[0].getLocation().getX();
        for (int i = 0; i < raias.length; i++) centro[i] = inicio + LARGURA * i + LARGURA / 2;

        final int ALUNO = 0, FRONT = 1, API = 2, BANCO = 3;
        Map<INodePresentation, Integer> naRaia = new java.util.LinkedHashMap<>();
        INodePresentation ini = a.createInitialNode("Início", ponto(centro[ALUNO] - 10, 60));
        naRaia.put(ini, ALUNO);
        INodePresentation escolhe = acao(a, "Seleciona uma fase na trilha", centro[ALUNO], 110);
        naRaia.put(escolhe, ALUNO);
        INodePresentation liberada = a.createDecisionMergeNode(null, ponto(centro[FRONT] - 15, 190));
        naRaia.put(liberada, FRONT);
        INodePresentation bloqueio = acao(a, "Mostra \"Acesso bloqueado\"", centro[ALUNO], 230);
        naRaia.put(bloqueio, ALUNO);
        INodePresentation fimBloqueio = a.createFinalNode("Fim (fase bloqueada)", ponto(centro[ALUNO] - 12, 310));
        naRaia.put(fimBloqueio, ALUNO);
        INodePresentation online = a.createDecisionMergeNode(null, ponto(centro[FRONT] - 15, 290));
        naRaia.put(online, FRONT);
        INodePresentation busca = acao(a, "GET /api/fases/{codigo}/flashcards", centro[API], 340);
        naRaia.put(busca, API);
        INodePresentation consulta = acao(a, "Consulta as cartas da fase", centro[BANCO], 410);
        naRaia.put(consulta, BANCO);
        INodePresentation devolve = acao(a, "Devolve a lista de cartas", centro[API], 480);
        naRaia.put(devolve, API);
        INodePresentation local = acao(a, "Usa o deck local (packages/shared)", centro[FRONT], 400);
        naRaia.put(local, FRONT);
        INodePresentation junta = a.createDecisionMergeNode(null, ponto(centro[FRONT] - 15, 550));
        naRaia.put(junta, FRONT);
        INodePresentation monta = acao(a, "Monta o deck: revisões vencidas primeiro (SM-2)", centro[FRONT], 610);
        naRaia.put(monta, FRONT);
        INodePresentation exibe = acao(a, "Mostra a frente da carta", centro[FRONT], 690);
        naRaia.put(exibe, FRONT);
        INodePresentation avalia = acao(a, "Vira a carta e avalia (Errei, Difícil, Bom, Fácil)", centro[ALUNO], 760);
        naRaia.put(avalia, ALUNO);
        INodePresentation atualiza = acao(a, "Atualiza o SM-2 local", centro[FRONT], 830);
        naRaia.put(atualiza, FRONT);
        INodePresentation fork = a.createForkNode(null, ponto(centro[FRONT] - 60, 900));
        naRaia.put(fork, FRONT);
        INodePresentation proxima = acao(a, "Avança para a próxima carta", centro[FRONT], 960);
        naRaia.put(proxima, FRONT);
        INodePresentation logado = a.createDecisionMergeNode(null, ponto(centro[API] - 15, 950));
        naRaia.put(logado, API);
        INodePresentation post = acao(a, "POST /api/progresso/atualizar (JWT) e Sm2Engine.Calcular", centro[API], 1010);
        naRaia.put(post, API);
        INodePresentation grava = acao(a, "Grava progresso_flashcards (trigger guarda o histórico)", centro[BANCO], 1080);
        naRaia.put(grava, BANCO);
        INodePresentation fimSync = a.createDecisionMergeNode(null, ponto(centro[API] - 15, 1150));
        naRaia.put(fimSync, API);
        INodePresentation join = a.createJoinNode(null, ponto(centro[FRONT] - 60, 1200));
        naRaia.put(join, FRONT);
        INodePresentation resta = a.createDecisionMergeNode(null, ponto(centro[FRONT] - 15, 1240));
        naRaia.put(resta, FRONT);
        INodePresentation premio = acao(a, "Dá XP e moedas e libera a próxima fase", centro[FRONT], 1300);
        naRaia.put(premio, FRONT);
        INodePresentation stats = acao(a, "PUT /api/usuarios/stats", centro[API], 1360);
        naRaia.put(stats, API);
        INodePresentation salva = acao(a, "Atualiza XP, moedas e nível (trigger: nunca diminuem)", centro[BANCO], 1420);
        naRaia.put(salva, BANCO);
        INodePresentation fim = a.createFinalNode("Fim", ponto(centro[BANCO] - 12, 1480));
        naRaia.put(fim, BANCO);

        fluxo(a, ini, escolhe, null);
        fluxo(a, escolhe, liberada, null);
        fluxo(a, liberada, bloqueio, "não liberada");
        fluxo(a, bloqueio, fimBloqueio, null);
        fluxo(a, liberada, online, "liberada");
        fluxo(a, online, busca, "API online");
        fluxo(a, busca, consulta, null);
        fluxo(a, consulta, devolve, null);
        fluxo(a, devolve, junta, null);
        fluxo(a, online, local, "sem API");
        fluxo(a, local, junta, null);
        fluxo(a, junta, monta, null);
        fluxo(a, monta, exibe, null);
        fluxo(a, exibe, avalia, null);
        fluxo(a, avalia, atualiza, null);
        fluxo(a, atualiza, fork, null);
        fluxo(a, fork, proxima, null);
        fluxo(a, fork, logado, null);
        fluxo(a, logado, post, "logado e online");
        fluxo(a, post, grava, null);
        fluxo(a, grava, fimSync, null);
        fluxo(a, logado, fimSync, "sem conexão (o app guarda na fila)");
        fluxo(a, proxima, join, null);
        fluxo(a, fimSync, join, null);
        fluxo(a, join, resta, null);
        fluxo(a, resta, exibe, "ainda há cartas");
        fluxo(a, resta, premio, "fase concluída");
        fluxo(a, premio, stats, null);
        fluxo(a, stats, salva, null);
        fluxo(a, salva, fim, null);

        // O Astah estica as raias enquanto os nós são criados. No fim, cada nó volta para o
        // centro da sua raia, usando a posição final das raias.
        for (Map.Entry<INodePresentation, Integer> e : naRaia.entrySet()) {
            INodePresentation r = raia[e.getValue()], n = e.getKey();
            double x = r.getLocation().getX() + (r.getWidth() - n.getWidth()) / 2;
            n.setLocation(ponto(x, n.getLocation().getY()));
        }
    }

    // ------------------------------------------------------------------ ajudantes

    private static Point2D ponto(double x, double y) {
        return new Point2D.Double(x, y);
    }

    private static INodePresentation acao(ActivityDiagramEditor a, String texto, double centroX, double y) throws Exception {
        INodePresentation n = a.createAction(texto, ponto(centroX - 105, y));
        n.setWidth(210);
        n.setHeight(texto.length() > 34 ? 48 : 34);
        return n;
    }

    private static void fluxo(ActivityDiagramEditor a, INodePresentation de, INodePresentation para, String guarda) throws Exception {
        ILinkPresentation link = a.createFlow(de, para);
        if (guarda != null) ((IFlow) link.getModel()).setGuard(guarda);
    }

    private static INodePresentation classe(ClassDiagramEditor d, IPackage pacote, String nome, double x, double y,
                                            String[] atributos, String[] operacoes) throws Exception {
        IClass c = modelo.createClass(pacote, nome);
        classes.put(nome, c);
        membros(c, atributos, operacoes);
        return no(d, c, x, y, nome, atributos, operacoes);
    }

    private static INodePresentation interfaceNo(ClassDiagramEditor d, IPackage pacote, String nome, double x, double y, String[] operacoes) throws Exception {
        IClass c = modelo.createInterface(pacote, nome);
        classes.put(nome, c);
        membros(c, new String[0], operacoes);
        INodePresentation n = no(d, c, x, y, nome, new String[0], operacoes);
        n.setProperty("notation_type", "normal"); // caixa com as operações, não o ícone de bolinha
        return n;
    }

    /** "Nome : Tipo [= padrão]" vira atributo; "Nome(params) : Retorno" vira operação (parâmetros como texto). */
    private static void membros(IClass c, String[] atributos, String[] operacoes) throws Exception {
        for (String a : atributos) {
            String[] partes = a.split(" : ", 2);
            String tipo = partes[1];
            String padrao = null;
            if (tipo.contains(" = ")) {
                padrao = tipo.substring(tipo.indexOf(" = ") + 3);
                tipo = tipo.substring(0, tipo.indexOf(" = "));
            }
            IAttribute at = modelo.createAttribute(c, partes[0], tipo);
            at.setVisibility("public");
            if (padrao != null) at.setInitialValue(padrao);
        }
        for (String o : operacoes) {
            int abre = o.indexOf('('), fecha = o.lastIndexOf(')');
            String retorno = o.substring(o.lastIndexOf(" : ") + 3);
            IOperation op = modelo.createOperation(c, o.substring(0, abre), retorno);
            op.setVisibility("public");
            String params = o.substring(abre + 1, fecha).trim();
            // "(...)" é só abreviação no diagrama: o Astah não aceita parâmetro sem tipo.
            if (!params.isEmpty() && !params.equals("...")) {
                for (String prm : params.split(", (?=[a-z]+ : )")) {
                    String[] pp = prm.split(" : ", 2);
                    modelo.createParameter(op, pp[0], pp[1]);
                }
            }
        }
    }

    /** Coloca a classe no diagrama com um tamanho que cabe o texto mais longo. */
    private static INodePresentation no(ClassDiagramEditor d, IElement c, double x, double y, String nome, String[] atributos, String[] operacoes) throws Exception {
        INodePresentation n = d.createNodePresentation(c, ponto(x, y));
        int maior = nome.length() + 4;
        for (String s : atributos) maior = Math.max(maior, s.length() + 3);
        for (String s : operacoes) maior = Math.max(maior, s.length() + 3);
        n.setWidth(Math.max(120, maior * 6.6 + 16));
        n.setHeight(34 + 16 * (atributos.length + operacoes.length) + 14);
        return n;
    }

    private static void heranca(ClassDiagramEditor d, Map<String, INodePresentation> p, String filha, String mae) throws Exception {
        d.createLinkPresentation(modelo.createGeneralization(classes.get(filha), classes.get(mae), ""), p.get(filha), p.get(mae));
    }

    private static void associacao(ClassDiagramEditor d, Map<String, INodePresentation> p, String a, String multA,
                                   String b, String multB, String nome, boolean composicaoEmA) throws Exception {
        IAssociation as = modelo.createAssociation(classes.get(a), classes.get(b), nome, "", "");
        for (IAttribute ponta : as.getMemberEnds()) {
            boolean ehA = ponta.getType() == classes.get(a);
            ponta.setMultiplicityStrings(new String[][] {ehA ? faixa(multA) : faixa(multB)});
            if (ehA && composicaoEmA) ponta.setComposite();
        }
        d.createLinkPresentation(as, p.get(a), p.get(b));
    }

    private static String[] faixa(String mult) {
        return mult.contains("..") ? mult.split("\\.\\.") : new String[] {mult};
    }
}
