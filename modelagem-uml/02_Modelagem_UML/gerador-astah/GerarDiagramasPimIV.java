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
 * do código atual, como o PIM III melhorado: os mesmos casos de uso, cada um com um diagrama
 * de classes e um de sequência, mais as classes globais (entidades e camadas da API) e a
 * atividade da sessão de estudo. Todo elemento recebe uma Definition.
 *
 * A API exige Java 21; o Astah já traz um (pasta jre). Uso:
 *   "C:\Program Files\astah-uml\jre\bin\java.exe" -cp "C:\Program Files\astah-uml\astah-uml.jar;C:\Program Files\astah-uml\astah-api.jar;C:\Program Files\astah-uml\lib\*" GerarDiagramasPimIV.java "<saida.asta>" ["<base.asta>"]
 */
public class GerarDiagramasPimIV {

    private static ProjectAccessor projeto;
    private static BasicModelEditor modelo;
    private static final Map<String, IClass> classes = new HashMap<>();

    public static void main(String[] args) throws Exception {
        // Com a licença acadêmica, a API não salva um projeto criado do zero (LicenseNotFoundException),
        // mas salva um arquivo aberto. Por isso abre um .asta existente, apaga todo o conteúdo e monta
        // os diagramas. Sem base (ou com a base igual à saída), reaproveita o próprio arquivo de saída.
        java.nio.file.Path saida = java.nio.file.Path.of(args[0]).toAbsolutePath().normalize();
        java.nio.file.Path base = args.length > 1 ? java.nio.file.Path.of(args[1]).toAbsolutePath().normalize() : saida;
        if (!base.equals(saida))
            java.nio.file.Files.copy(base, saida, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        projeto = AstahAPI.getAstahAPI().getProjectAccessor();
        projeto.open(args[0], true, false, false);
        try {
            TransactionManager.beginTransaction();
            modelo = ModelEditorFactory.getBasicModelEditor();
            IModel raiz = projeto.getProject();
            limpar(raiz);
            IPackage pimIV = modelo.createPackage(raiz, "Nex_TI - PIM IV");

            pimIV.setDefinition("Modelagem do Nex_TI no PIM IV: o PIM III melhorado, com cada diagrama ligado ao código atual.");
            IPackage pacoteCasos = pacote(pimIV, "Casos de uso", "Os 15 casos de uso do PIM III, com os mesmos nomes, mais os 2 novos do PIM IV. Cada um tem um diagrama de classes e um de sequência.");
            casosDeUso(pacoteCasos);
            entidades(pacote(pimIV, "Modelo (entidades)", "Classes de domínio da API (pasta Models), mapeadas para as tabelas do SQL Server."));
            camadas(pacote(pimIV, "API (camadas)", "Camadas da API em .NET 10: rotas, serviços (com interfaces) e dados."));
            apoioEFrontEnd(pimIV);
            casosDetalhados(pacoteCasos);
            atividade(pimIV);
            raiz.setDefinition("Nex_TI: plataforma de estudo de TI com flashcards, SM-2 e gamificação (PIM IV, UNIP).");
            definirTipos();

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

    /** Apaga tudo o que havia no arquivo. Um elemento pode sumir junto com o pacote dele, então
     *  os que já foram removidos são ignorados; no fim a raiz precisa estar vazia. */
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

    // ------------------------------------------------------------------ casos de uso

    /**
     * Os 15 casos de uso do PIM III, com os mesmos nomes, mais os 2 novos do PIM IV.
     * Os dois que não foram implementados ficam com o estereótipo «planejado».
     */
    private static void casosDeUso(IPackage pacote) throws Exception {
        UseCaseModelEditor uc = ModelEditorFactory.getUseCaseModelEditor();
        UseCaseDiagramEditor d = projeto.getDiagramEditorFactory().getUseCaseDiagramEditor();
        d.createUseCaseDiagram(pacote, "1. Casos de Uso - PIM III melhorado").setDefinition("Os casos de uso do PIM III com os mesmos nomes, agora ligados ao código; «planejado» = ainda não feito, «novo no PIM IV» = não existia.");

        d.createRect(new Point2D.Double(250, 20), 640, 840);
        d.createText("Sistema Nex_TI (site, app e API)", new Point2D.Double(270, 30));

        Map<String, IClass> atores = new HashMap<>();
        Map<String, INodePresentation> pAtores = new HashMap<>();
        double[][] posicao = {{70, 150}, {70, 400}, {70, 640}, {70, 770}};
        String[] nomesAtores = {"Usuário", "Aluno", "Tutor", "Administrador"};
        for (int i = 0; i < nomesAtores.length; i++) {
            atores.put(nomesAtores[i], uc.createActor(pacote, nomesAtores[i]));
            definir(atores.get(nomesAtores[i]), nomesAtores[i]);
            pAtores.put(nomesAtores[i], d.createNodePresentation(atores.get(nomesAtores[i]), ponto(posicao[i][0], posicao[i][1])));
        }
        for (int i = 1; i < nomesAtores.length; i++)
            d.createLinkPresentation(modelo.createGeneralization(atores.get(nomesAtores[i]), atores.get(nomesAtores[i - 1]), ""),
                pAtores.get(nomesAtores[i]), pAtores.get(nomesAtores[i - 1]));

        // {nome, ator (vazio = sem ator direto), x, y, estereótipo}
        String[][] lista = {
            {"Cadastrar Novo Usuário", "Usuário", "300", "60", ""},
            {"Realizar Login", "Usuário", "300", "115", ""},
            {"Ajustar Acessibilidade", "Usuário", "300", "170", ""},
            {"Gerenciar Minha Conta", "Usuário", "300", "225", "novo no PIM IV"},
            {"Estudar Flashcards", "Aluno", "300", "320", ""},
            {"Realizar Teste de Nivelamento", "Aluno", "300", "375", ""},
            {"Realizar Simulado ENADE", "Aluno", "300", "430", ""},
            {"Visualizar Painel de Desempenho", "Aluno", "300", "485", ""},
            {"Criar Flashcards", "Aluno", "300", "540", ""},
            {"Acompanhar Desempenho dos Usuários", "Tutor", "300", "625", ""},
            {"Gerenciar Conteúdo das Cartas", "Tutor", "300", "680", ""},
            {"Gerenciar Perfis e Acessos", "Administrador", "300", "780", ""},
            {"Estudar sem Internet (app)", "", "620", "250", "novo no PIM IV"},
            {"Atribuir XP e Moedas", "", "620", "340", ""},
            {"Desbloquear Fases e Módulos", "", "620", "420", ""},
            {"Consultar Agente Especialista (IA)", "Aluno", "620", "560", "planejado"},
            {"Escalar Dúvida para Tutor", "", "620", "680", "planejado"},
        };
        Map<String, IUseCase> casos = new HashMap<>();
        Map<String, INodePresentation> pCasos = new HashMap<>();
        for (String[] c : lista) {
            IUseCase caso = uc.createUseCase(pacote, c[0]);
            if (!c[4].isEmpty()) caso.addStereotype(c[4]);
            caso.setDefinition(DEF_CASOS.getOrDefault(c[0], c[0]));
            INodePresentation p = d.createNodePresentation(caso, ponto(Double.parseDouble(c[2]), Double.parseDouble(c[3])));
            p.setWidth(250);
            p.setHeight(c[4].isEmpty() ? 44 : 54);
            if (!c[1].isEmpty())
                d.createLinkPresentation(modelo.createAssociation(atores.get(c[1]), caso, "", "", ""), pAtores.get(c[1]), p);
            casos.put(c[0], caso);
            pCasos.put(c[0], p);
        }
        // inclusão: o caso base sempre executa o incluído; extensão: só em certa condição
        String[][] inclui = {{"Estudar Flashcards", "Atribuir XP e Moedas"}, {"Realizar Simulado ENADE", "Atribuir XP e Moedas"}};
        for (String[] r : inclui)
            d.createLinkPresentation(uc.createInclude(casos.get(r[1]), casos.get(r[0]), ""), pCasos.get(r[0]), pCasos.get(r[1]));
        String[][] estende = {
            {"Estudar sem Internet (app)", "Estudar Flashcards"},
            {"Desbloquear Fases e Módulos", "Estudar Flashcards"},
            {"Escalar Dúvida para Tutor", "Consultar Agente Especialista (IA)"},
        };
        for (String[] r : estende)
            d.createLinkPresentation(uc.createExtend(casos.get(r[1]), casos.get(r[0]), ""), pCasos.get(r[0]), pCasos.get(r[1]));

        d.createNote("Mesmos casos de uso do PIM III, agora ligados ao código.\n«planejado»: ainda não implementado.\n«novo no PIM IV»: não existia no PIM III.\nCada perfil herda o anterior (Usuário → Aluno → Tutor → Administrador).",
            ponto(560, 770));
    }

    // ------------------------------------------------------------------ classes: entidades

    private static void entidades(IPackage pacote) throws Exception {
        ClassDiagramEditor d = projeto.getDiagramEditorFactory().getClassDiagramEditor();
        d.createClassDiagram(pacote, "2. Classes - entidades do domínio").setDefinition("Entidades da API (pasta Models) com atributos, herança e multiplicidades. Evolui o diagrama de classes do PIM III.");

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
        d.createClassDiagram(pacote, "3. Classes - camadas da API").setDefinition("Rotas, interfaces dos serviços, serviços e dados. As rotas dependem só das interfaces (injeção de dependência).");
        IPackage rotas = pacote(pacote, "Endpoints", "Rotas HTTP da API.");
        IPackage servicos = pacote(pacote, "Services", "Serviços com as regras de negócio, cada um com sua interface.");
        IPackage dados = pacote(pacote, "Data", "Acesso ao banco pelo Entity Framework Core.");
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
            d.createLinkPresentation(relacao("implementa", par[1], par[0], ""), pc, pi);
            p.put(par[0], pi);
            p.put(par[1], pc);
            x += pi.getWidth() + 40;
        }
        for (String[] par : pares)
            d.createLinkPresentation(relacao("usa", par[0].equals("IContaService") ? "ContaEndpoints" : "EndpointExtensions", par[0], "usa"),
                p.get(par[0].equals("IContaService") ? "ContaEndpoints" : "EndpointExtensions"), p.get(par[0]));

        d.createText("Dados (persistência)", new Point2D.Double(20, 650));
        p.put("AppDbContext", classe(d, dados, "AppDbContext", 20, 670, new String[] {
            "Usuarios : DbSet<Usuario>", "Flashcards : DbSet<Flashcard>", "Progresso_Flashcards : DbSet<ProgressoFlashcard>",
            "Questoes : DbSet<Questao>", "CartasModeradas : DbSet<CartaModerada>"}, new String[0]));
        p.put("DbContext", classe(d, dados, "DbContext", 420, 690, new String[0], new String[0]));
        classes.get("DbContext").addStereotype("EF Core");
        heranca(d, p, "AppDbContext", "DbContext");
        for (String[] par : pares)
            d.createLinkPresentation(relacao("usa", par[1], "AppDbContext", ""), p.get(par[1]), p.get("AppDbContext"));

        d.createNote("Os endpoints dependem só das interfaces;\no Program.cs liga cada uma à sua classe\n(injeção de dependência).", new Point2D.Double(700, 680));
    }

    // ------------------------------------------------------------------ atividade

    private static void atividade(IPackage pacote) throws Exception {
        ActivityDiagramEditor a = projeto.getDiagramEditorFactory().getActivityDiagramEditor();
        a.createActivityDiagram(pacote, "4. Atividade - sessão de estudo com flashcards").setDefinition("Fluxo da sessão de estudo, com raias para o aluno, o site ou app, a API e o banco.");

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

    // ------------------------------------------------------------------ definições (campo Definition do Astah)

    private static final Map<String, String> DEF = new HashMap<>();
    static {
        String[][] d = {
            {"Usuario", "Conta de quem usa o sistema (tabela usuarios). O campo Perfil diz o que a pessoa pode fazer: Aluno, Tutor ou Admin. XP e nível só sobem (trigger tg_usuarios_protege_gamificacao)."},
            {"Aluno", "Especialização de Usuario no modelo de domínio. No banco todos ficam em usuarios, diferenciados pelo campo Perfil."},
            {"Tutor", "Especialização de Usuario que acompanha os alunos e modera as cartas. No banco é um usuario com Perfil = Tutor."},
            {"Fase", "Disciplina da trilha de estudo (tabela fases), identificada pelo código, por exemplo fase1."},
            {"Flashcard", "Carta de estudo de uma fase (tabela flashcards). Com Opcoes e Correta, vira questão de múltipla escolha no estilo ENADE."},
            {"ProgressoFlashcard", "Estado do SM-2 de um aluno numa carta: repetições, intervalo em dias, fator de facilidade e data da próxima revisão. Chave composta UsuarioId + FlashcardId."},
            {"CartaModerada", "Carta editada ou excluída por um Tutor. A carga inicial consulta esta tabela para não recriar a carta."},
            {"AreaConhecimento", "Área das questões do ENADE, por exemplo Engenharia de Software ou Banco de Dados."},
            {"Questao", "Questão de prova do ENADE. Origem guarda de onde veio, por exemplo ENADE 2017 - questão 12."},
            {"Alternativa", "Uma das cinco alternativas de uma questão; IsCorreta marca a resposta certa."},
            {"Prova", "Prova oficial do ENADE (ano e tipo), ligada às questões numa relação N:N."},
            {"EndpointExtensions", "Rotas HTTP da API (Minimal APIs). Lê o pedido e o token, chama o serviço e traduz o Resultado em status HTTP. Não acessa o banco."},
            {"ContaEndpoints", "Rotas de Minha conta (/api/conta). O usuário vem sempre do token: ninguém altera a conta de outra pessoa."},
            {"IAuthService", "Contrato de cadastro e login. As rotas dependem da interface; o Program.cs liga a interface à classe."},
            {"AuthService", "Cadastro e login: valida os dados, grava a senha com BCrypt e gera o token JWT com id, nome e perfil."},
            {"IProgressoService", "Contrato do progresso de estudo (SM-2) e das estatísticas do aluno."},
            {"ProgressoService", "Grava cada resposta do aluno, aplica o SM-2 pelo Sm2Engine e calcula as estatísticas."},
            {"IGamificacaoService", "Contrato de XP, moedas, nível e ranking."},
            {"GamificacaoService", "Atualiza XP, moedas e nível aceitando só aumentos de até 200 por vez (regra contra trapaça)."},
            {"IConteudoService", "Contrato do conteúdo: fases, flashcards e questões dos simulados."},
            {"ConteudoService", "Lista fases, cartas e questões; cria, edita e exclui cartas, registrando as moderadas."},
            {"IAdminService", "Contrato da área administrativa: painel do Tutor e perfis de acesso."},
            {"AdminService", "Monta o painel dos alunos para o Tutor e define o perfil de cada usuário (o Admin não muda o próprio)."},
            {"IContaService", "Contrato de Minha conta: consultar, exportar, alterar e excluir a própria conta."},
            {"ContaService", "Minha conta: confere a senha atual antes de alterar e protege o último Administrador."},
            {"AppDbContext", "Contexto do Entity Framework Core: tabelas, chaves e relações do SQL Server, com as migrations."},
            {"DbContext", "Classe base do Entity Framework Core."},
            {"IPoliticaDeSenha", "Contrato das regras de senha forte."},
            {"PoliticaDeSenha", "Regras de senha no servidor: de 8 a 72 caracteres, letras, números e símbolo, sem usar o nickname nem o e-mail."},
            {"ISm2Engine", "Contrato do algoritmo de repetição espaçada."},
            {"Sm2Engine", "Algoritmo SM-2: nota 3 ou mais volta em 1 dia, depois 6, depois multiplica pelo fator; nota menor recomeça em 1 dia."},
            {"LoginPage", "Tela de login e cadastro do site (React)."},
            {"EstudoContext", "Estado do estudo no site (React): deck, respostas, XP, moedas e fases liberadas. Fala com a API pelo ApiService."},
            {"ApiService", "Cliente da API usado pelo site e pelo app (packages/shared/src/api.js). Envia o token JWT no cabeçalho."},
            {"senha.js", "Regras de senha forte no navegador, iguais às da API, para avisar antes de enviar."},
            {"senhaVazada.js", "Confere se a senha já apareceu em vazamentos (Have I Been Pwned), enviando só os 5 primeiros caracteres do hash SHA-1."},
            {"gamificacao.js", "Regras de progressão: ordem das fases, recompensas, nota de corte dos testes e compra de bônus."},
            {"diagnostico.js", "Perguntas do teste de nivelamento e a fase inicial de acordo com os acertos."},
            {"deck.js", "Monta o deck da fase (revisões vencidas primeiro) e os testes de módulo com 20 questões."},
            {"enadeOficial.js", "Provas oficiais do ENADE de ADS (2017 e 2021), com gabarito do INEP, e o guia de estudos."},
            {"ModalNivelamento", "Janela do teste de nivelamento (diagnóstico) no site."},
            {"ModalProgresso", "Janela Minhas Estatísticas, com os números do SM-2 do aluno."},
            {"ModalAdmin", "Painel do Tutor/Admin no site: abas Alunos, Cartas e Usuários."},
            {"ModalCriacao", "Janela Criar Carta, onde o aluno cria um flashcard numa fase."},
            {"ModalConta", "Janela Minha conta: dados, troca de e-mail e senha, exportação e exclusão da conta."},
            {"Topo", "Barra superior do site, com o menu do usuário e os botões de acessibilidade."},
            {"acessibilidade.js", "Zoom da fonte e modo de alto contraste, guardados no navegador."},
            {"EstudoScreen", "Tela de estudo do aplicativo (React Native com Expo)."},
            {"sincronizacao.js", "No app, envia as respostas à API e as guarda numa fila quando não há internet."},
            {"armazenamento.js", "No app, guarda a sessão no SecureStore (cofre do sistema) e o progresso e a fila no AsyncStorage."},
            {"Usuário", "Qualquer pessoa com conta no Nex_TI. É a base dos outros perfis."},
            {"Administrador", "Perfil que, além de tudo o que o Tutor faz, define o perfil de cada usuário."},
        };
        for (String[] par : d) DEF.put(par[0], par[1]);
    }

    private static void definir(IElement e, String nome) throws Exception {
        String texto = DEF.get(nome);
        if (texto != null && e instanceof com.change_vision.jude.api.inf.model.INamedElement n) n.setDefinition(texto);
    }

    // ------------------------------------------------------------------ elementos de apoio, do front-end e do app

    private static final Map<String, String[][]> membrosDe = new HashMap<>();
    private static final Map<String, IElement> relacoes = new HashMap<>();

    /** Cria a classe só no modelo (sem desenhar), para os diagramas de cada caso de uso. */
    private static void elemento(IPackage pacote, String nome, String estereotipo, boolean ehInterface, String[] operacoes) throws Exception {
        IClass c = ehInterface ? modelo.createInterface(pacote, nome) : modelo.createClass(pacote, nome);
        if (estereotipo != null) c.addStereotype(estereotipo);
        classes.put(nome, c);
        membrosDe.put(nome, new String[][] {new String[0], operacoes});
        membros(c, new String[0], operacoes);
        definir(c, nome);
    }

    private static void apoioEFrontEnd(IPackage pimIV) throws Exception {
        IPackage apoio = modelo.createPackage(classes.get("AppDbContext").getOwner() instanceof IPackage p ? (IPackage) p.getOwner() : pimIV, "Services (apoio)");
        apoio.setDefinition("Serviços de apoio da API: regras de senha e algoritmo SM-2.");
        elemento(apoio, "IPoliticaDeSenha", null, true, new String[] {"Validar(senha : string, nickname : string, email : string) : IReadOnlyList<string>"});
        elemento(apoio, "PoliticaDeSenha", null, false, new String[] {"Validar(senha : string, nickname : string, email : string) : IReadOnlyList<string>"});
        elemento(apoio, "ISm2Engine", null, true, new String[] {"Calcular(progresso : ProgressoFlashcard, qualidade : int) : void"});
        elemento(apoio, "Sm2Engine", null, false, new String[] {"Calcular(progresso : ProgressoFlashcard, qualidade : int) : void"});

        IPackage front = modelo.createPackage(pimIV, "Front-end (site e app)");
        front.setDefinition("Telas e módulos JavaScript do site (React), do app (React Native) e do pacote compartilhado packages/shared.");
        elemento(front, "LoginPage", "React", false, new String[] {"entrar() : void", "cadastrar() : void"});
        elemento(front, "EstudoContext", "React", false, new String[] {"carregarAula(faseId : string) : void", "responder(resultado : string) : void",
            "concluirRotina() : void", "concluirDiagnostico(acertos : int) : void", "criarCarta(dados : object) : bool"});
        elemento(front, "ApiService", "módulo JS", false, new String[] {"login(usuario : string, senha : string) : Promise", "register(nickname : string, email : string, senha : string) : Promise",
            "getFlashcardsPorFase(codigo : string) : Promise", "atualizarProgresso(usuarioId : int, flashcardId : int, qualidade : int) : Promise",
            "updateUserStats(xp : int, moedas : int, nivel : int) : Promise", "getEstatisticasDetalhadas(username : string) : Promise"});
        elemento(front, "senha.js", "módulo JS", false, new String[] {"senhaEhForte(senha : string) : bool"});
        elemento(front, "senhaVazada.js", "módulo JS", false, new String[] {"verificarSenhaVazada(senha : string) : Promise<int>"});
        elemento(front, "gamificacao.js", "módulo JS", false, new String[] {"recompensa(faseId : string) : object", "proximaFase(faseId : string) : string",
            "passouNoTeste(faseId : string, acertos : int, total : int) : bool", "podeComprarBonus(moedas : int, custo : int) : bool"});
        elemento(front, "diagnostico.js", "módulo JS", false, new String[] {"resultadoDoDiagnostico(acertos : int) : object"});
        elemento(front, "deck.js", "módulo JS", false, new String[] {"montarDeckDaFase(cards : array) : array", "montarTesteDoModulo(testeId : string) : array"});
        elemento(front, "enadeOficial.js", "módulo JS", false, new String[] {"cartasDaProva(ano : int) : array"});
        for (String m : new String[] {"ModalNivelamento", "ModalProgresso", "ModalAdmin", "ModalCriacao", "ModalConta", "Topo"})
            elemento(front, m, "React", false, new String[0]);
        elemento(front, "acessibilidade.js", "módulo JS", false, new String[] {"mudarZoom(direcao : int) : void", "alternarAltoContraste() : void"});
        elemento(front, "EstudoScreen", "React Native", false, new String[0]);
        elemento(front, "sincronizacao.js", "módulo JS", false, new String[] {"responder(carta : object, resultado : string) : Promise", "sincronizar() : Promise"});
        elemento(front, "armazenamento.js", "módulo JS", false, new String[] {"lerSessao() : Promise", "gravar(chave : string, valor : object) : Promise"});
    }

    /** Relação reaproveitada entre diagramas: a mesma dependência não é criada duas vezes no modelo. */
    private static IElement relacao(String tipo, String de, String para, String rotulo) throws Exception {
        String chave = tipo + "|" + de + "|" + para;
        IElement r = relacoes.get(chave);
        if (r != null) return r;
        IClass a = classes.get(de), b = classes.get(para);
        if (a == null || b == null) throw new IllegalStateException("Classe desconhecida em " + chave);
        r = switch (tipo) {
            case "implementa" -> modelo.createRealization(a, b, "");
            case "herda" -> modelo.createGeneralization(a, b, "");
            case "associa" -> modelo.createAssociation(a, b, rotulo, "", "");
            default -> modelo.createDependency(b, a, rotulo); // "de" usa "para"
        };
        relacoes.put(chave, r);
        return r;
    }

    // ------------------------------------------------------------------ um par de diagramas por caso de uso

    /**
     * Cria o pacote do caso de uso com o diagrama de classes (elementos já existentes no modelo)
     * e o de sequência. Linhas de vida: "chave=Rótulo". Mensagens: {de, para, texto} ou
     * {de, para, texto, "retorno"} (resposta à última chamada de "para" para "de").
     */
    private static void detalhe(IPackage casos, String nome, String definicao, String[] noDiagrama, String[][] rels,
                                String[] linhas, String[][] msgs, String nota) throws Exception {
        IPackage pacote = modelo.createPackage(casos, nome);
        pacote.setDefinition(definicao);

        ClassDiagramEditor cd = projeto.getDiagramEditorFactory().getClassDiagramEditor();
        cd.createClassDiagram(pacote, "Classes - " + nome).setDefinition("Classes envolvidas em " + nome + ". " + definicao);
        Map<String, INodePresentation> p = new HashMap<>();
        for (int i = 0; i < noDiagrama.length; i++) {
            String c = noDiagrama[i];
            String[][] mb = membrosDe.getOrDefault(c, new String[][] {new String[0], new String[0]});
            INodePresentation n = no(cd, classes.get(c), 30 + (i % 3) * 360, 30 + (i / 3) * 230, c, mb[0], mb[1]);
            if (java.util.Arrays.asList(classes.get(c).getStereotypes()).contains("interface")) n.setProperty("notation_type", "normal");
            p.put(c, n);
        }
        for (String[] r : rels) cd.createLinkPresentation(relacao(r[0], r[1], r[2], r.length > 3 ? r[3] : ""), p.get(r[1]), p.get(r[2]));

        com.change_vision.jude.api.inf.editor.SequenceDiagramEditor sd = projeto.getDiagramEditorFactory().getSequenceDiagramEditor();
        sd.createSequenceDiagram(pacote, "Sequência - " + nome).setDefinition("Ordem das mensagens em " + nome + ", tirada do código atual. " + definicao);
        Map<String, INodePresentation> vida = new HashMap<>();
        for (int i = 0; i < linhas.length; i++) {
            String[] kv = linhas[i].split("=", 2);
            INodePresentation l = sd.createLifeline(kv[1], 30 + i * 200);
            String base = kv[1].startsWith(":") ? kv[1].substring(1) : kv[1];
            if (classes.containsKey(base)) definir(l.getModel(), base);
            vida.put(kv[0], l);
        }
        Map<String, ILinkPresentation> ultimaChamada = new HashMap<>();
        double y = 110;
        for (String[] m : msgs) {
            if (m.length > 3 && m[3].equals("retorno")) {
                ILinkPresentation chamada = ultimaChamada.get(m[1] + ">" + m[0]);
                if (chamada != null) sd.createReturnMessage(m[2], chamada);
                y += 30;
                continue;
            }
            ILinkPresentation msg = sd.createMessage(m[2], vida.get(m[0]), vida.get(m[1]), y);
            ultimaChamada.put(m[0] + ">" + m[1], msg);
            y += 45;
        }
        if (nota != null) sd.createNote(nota, ponto(30, y + 40));
    }

    private static void casosDetalhados(IPackage casos) throws Exception {
        detalhe(casos, "Cadastrar Novo Usuário",
            "O visitante cria a conta no site; a senha é conferida no navegador e de novo na API, e gravada com BCrypt.",
            new String[] {"LoginPage", "senha.js", "senhaVazada.js", "ApiService", "EndpointExtensions", "IAuthService", "AuthService", "IPoliticaDeSenha", "Usuario"},
            new String[][] {{"usa", "LoginPage", "senha.js"}, {"usa", "LoginPage", "senhaVazada.js"}, {"usa", "LoginPage", "ApiService"},
                {"usa", "EndpointExtensions", "IAuthService", "usa"}, {"implementa", "AuthService", "IAuthService"},
                {"usa", "AuthService", "IPoliticaDeSenha", "usa"}, {"usa", "AuthService", "Usuario", "cria"}},
            new String[] {"u=:Usuário", "pg=:LoginPage", "sv=:senhaVazada.js", "api=:ApiService", "rota=:EndpointExtensions", "auth=:AuthService", "pol=:PoliticaDeSenha", "bd=:SQL Server"},
            new String[][] {{"u", "pg", "preenche nickname, e-mail e senha"}, {"pg", "pg", "senhaEhForte(senha)"},
                {"pg", "sv", "verificarSenhaVazada(senha)"}, {"sv", "pg", "vezes em vazamentos", "retorno"},
                {"pg", "api", "register(nickname, email, senha)"}, {"api", "rota", "POST /api/auth/register"},
                {"rota", "auth", "CadastrarAsync(username, email, senha)"}, {"auth", "pol", "Validar(senha, nickname, email)"},
                {"pol", "auth", "regras que faltam", "retorno"}, {"auth", "bd", "nickname ou e-mail já existem?"},
                {"auth", "bd", "INSERT usuarios (hash BCrypt, perfil Aluno)"}, {"auth", "rota", "Usuario", "retorno"},
                {"rota", "api", "200 OK", "retorno"}, {"api", "pg", "conta criada; o site já faz o login", "retorno"}},
            "PIM III: Registrar(Dados) no ControladorAutenticacao. PIM IV: regras de senha nos dois lados e checagem de vazamento.");

        detalhe(casos, "Realizar Login",
            "O usuário entra com nickname ou e-mail e senha e recebe um token JWT de 24 horas com o perfil.",
            new String[] {"LoginPage", "ApiService", "EndpointExtensions", "IAuthService", "AuthService", "Usuario"},
            new String[][] {{"usa", "LoginPage", "ApiService"}, {"usa", "EndpointExtensions", "IAuthService", "usa"},
                {"implementa", "AuthService", "IAuthService"}, {"usa", "AuthService", "Usuario", "consulta"}},
            new String[] {"u=:Usuário", "pg=:LoginPage", "api=:ApiService", "rota=:EndpointExtensions", "auth=:AuthService", "bd=:SQL Server"},
            new String[][] {{"u", "pg", "informa nickname ou e-mail e senha"}, {"pg", "api", "login(usuario, senha)"},
                {"api", "rota", "POST /api/auth/login (até 30 por minuto por IP)"}, {"rota", "auth", "EntrarAsync(usuarioOuEmail, senha)"},
                {"auth", "bd", "busca por username ou e-mail"}, {"bd", "auth", "Usuario", "retorno"},
                {"auth", "auth", "BCrypt.Verify(senha, hash)"}, {"auth", "auth", "GerarToken(): JWT com id, nome e perfil"},
                {"auth", "rota", "Sessao(token, usuario)", "retorno"}, {"rota", "api", "200: token e perfil (senha errada: 401)", "retorno"},
                {"api", "pg", "sessão", "retorno"}, {"pg", "pg", "salva a sessão no navegador"}},
            "PIM III: Login(email, senha) e ValidarCredenciais(). PIM IV: token JWT, limite de tentativas e perfil no token.");

        detalhe(casos, "Estudar Flashcards",
            "O aluno estuda as cartas de uma fase; cada resposta vai para a API, que aplica o SM-2 e agenda a próxima revisão.",
            new String[] {"EstudoContext", "deck.js", "ApiService", "IProgressoService", "ProgressoService", "ISm2Engine", "Sm2Engine", "ProgressoFlashcard", "Flashcard"},
            new String[][] {{"usa", "EstudoContext", "deck.js"}, {"usa", "EstudoContext", "ApiService"}, {"implementa", "ProgressoService", "IProgressoService"},
                {"usa", "ProgressoService", "ISm2Engine", "usa"}, {"implementa", "Sm2Engine", "ISm2Engine"}, {"usa", "ProgressoService", "ProgressoFlashcard", "grava"}},
            new String[] {"a=:Aluno", "ctx=:EstudoContext", "deck=:deck.js", "rota=:EndpointExtensions", "ps=:ProgressoService", "sm2=:Sm2Engine", "bd=:SQL Server"},
            new String[][] {{"a", "ctx", "carregarAula(faseId)"}, {"ctx", "rota", "GET /api/fases/{codigo}/flashcards"},
                {"rota", "ctx", "cartas da fase", "retorno"}, {"ctx", "deck", "montarDeckDaFase(cartas): vencidas primeiro"},
                {"a", "ctx", "responder(Errei, Difícil, Bom ou Fácil)"}, {"ctx", "ctx", "atualiza o SM-2 local"},
                {"ctx", "rota", "POST /api/progresso/atualizar (nota 1, 3, 4 ou 5)"}, {"rota", "ps", "RegistrarRespostaAsync(usuarioId, flashcardId, qualidade)"},
                {"ps", "sm2", "Calcular(progresso, qualidade)"}, {"ps", "bd", "SaveChangesAsync() (trigger grava o histórico)"},
                {"ps", "rota", "ProgressoFlashcard", "retorno"}, {"rota", "ctx", "200 OK", "retorno"}},
            "PIM III: Motor_SM2 aplicava o algoritmo. PIM IV: Sm2Engine na API, com 5 testes, e histórico gravado por trigger.");

        detalhe(casos, "Atribuir XP e Moedas",
            "Ao concluir uma fase, o aluno ganha XP e moedas; a API só aceita aumentos de até 200 por vez.",
            new String[] {"EstudoContext", "gamificacao.js", "ApiService", "IGamificacaoService", "GamificacaoService", "Usuario"},
            new String[][] {{"usa", "EstudoContext", "gamificacao.js"}, {"usa", "EstudoContext", "ApiService"},
                {"implementa", "GamificacaoService", "IGamificacaoService"}, {"usa", "GamificacaoService", "Usuario", "atualiza"}},
            new String[] {"a=:Aluno", "ctx=:EstudoContext", "gam=:gamificacao.js", "rota=:EndpointExtensions", "gs=:GamificacaoService", "bd=:SQL Server"},
            new String[][] {{"a", "ctx", "conclui a fase (concluirRotina)"}, {"ctx", "gam", "recompensa(faseId, acertos, total)"},
                {"gam", "ctx", "+XP e +moedas", "retorno"}, {"ctx", "ctx", "recalcula o rank"},
                {"ctx", "rota", "PUT /api/usuarios/stats (xp, moedas, nivel)"}, {"rota", "gs", "AtualizarAsync(usuarioId, xp, moedas, nivel)"},
                {"gs", "gs", "ValidarAtualizacao(): só sobe, no máximo +200"}, {"gs", "bd", "UPDATE usuarios (trigger: XP e nível não diminuem)"},
                {"gs", "rota", "Usuario (ou recusa)", "retorno"}, {"rota", "ctx", "200 OK (ou 400)", "retorno"}},
            "PIM III: Gamificacao creditava XP(5) e COINS(10). PIM IV: valores por fase em gamificacao.js e proteção no servidor e no banco.");

        detalhe(casos, "Desbloquear Fases e Módulos",
            "Concluir uma fase (ou passar no teste do módulo) libera a próxima; moedas compram fases bônus.",
            new String[] {"EstudoContext", "gamificacao.js"},
            new String[][] {{"usa", "EstudoContext", "gamificacao.js"}},
            new String[] {"a=:Aluno", "ctx=:EstudoContext", "gam=:gamificacao.js"},
            new String[][] {{"a", "ctx", "conclui a fase ou o teste do módulo"}, {"ctx", "gam", "passouNoTeste(faseId, acertos, total)"},
                {"gam", "ctx", "aprovado pela nota de corte?", "retorno"}, {"ctx", "gam", "proximaFase(faseId)"},
                {"gam", "ctx", "próxima fase da ORDEM_FASES", "retorno"}, {"ctx", "ctx", "libera a fase e salva no navegador"},
                {"a", "ctx", "compra uma fase bônus"}, {"ctx", "gam", "podeComprarBonus(moedas, custo)"}, {"gam", "ctx", "sim ou não", "retorno"}},
            "PIM III: o Tutor liberava as fases. PIM IV: a liberação é automática ao concluir a fase anterior.");

        detalhe(casos, "Realizar Teste de Nivelamento",
            "No primeiro acesso, 10 perguntas definem por qual fase o aluno começa.",
            new String[] {"ModalNivelamento", "EstudoContext", "diagnostico.js", "ApiService"},
            new String[][] {{"usa", "ModalNivelamento", "EstudoContext"}, {"usa", "EstudoContext", "diagnostico.js"}, {"usa", "EstudoContext", "ApiService"}},
            new String[] {"a=:Aluno", "modal=:ModalNivelamento", "ctx=:EstudoContext", "diag=:diagnostico.js", "rota=:EndpointExtensions"},
            new String[][] {{"a", "modal", "responde as 10 perguntas"}, {"modal", "ctx", "concluirDiagnostico(acertos)"},
                {"ctx", "diag", "resultadoDoDiagnostico(acertos)"}, {"diag", "ctx", "fases liberadas, rank e nível", "retorno"},
                {"ctx", "ctx", "libera as fases e marca como nivelado"}, {"ctx", "rota", "PUT /api/usuarios/stats (nível)"},
                {"ctx", "modal", "resultado", "retorno"}},
            "PIM III: Simulado.definirFaseInicial(nota). PIM IV: diagnostico.js no pacote compartilhado.");

        detalhe(casos, "Realizar Simulado ENADE",
            "O aluno faz o teste do módulo ou uma prova oficial do ENADE, com correção na hora e justificativa.",
            new String[] {"EstudoContext", "deck.js", "enadeOficial.js", "gamificacao.js", "Questao", "Alternativa", "Prova"},
            new String[][] {{"usa", "EstudoContext", "deck.js"}, {"usa", "EstudoContext", "enadeOficial.js"}, {"usa", "EstudoContext", "gamificacao.js"}},
            new String[] {"a=:Aluno", "ctx=:EstudoContext", "deck=:deck.js", "enade=:enadeOficial.js", "gam=:gamificacao.js"},
            new String[][] {{"a", "ctx", "abre o teste do módulo ou uma prova oficial"}, {"ctx", "deck", "montarTesteDoModulo(testeId): 20 questões"},
                {"ctx", "enade", "cartasDaProva(2017 ou 2021)"}, {"a", "ctx", "escolhe uma alternativa (responderEnade)"},
                {"ctx", "ctx", "mostra a certa e a justificativa"}, {"a", "ctx", "conclui o simulado"},
                {"ctx", "gam", "passouNoTeste() e liberaCertificado()"}, {"gam", "ctx", "aprovado? certificado liberado?", "retorno"}},
            "PIM III: Simulado com Temporizador. PIM IV: sem limite de tempo, com as provas oficiais e o gabarito do INEP.");

        detalhe(casos, "Visualizar Painel de Desempenho",
            "O aluno vê os próprios números do SM-2: cartas estudadas, maduras e para revisar.",
            new String[] {"ModalProgresso", "ApiService", "EndpointExtensions", "IProgressoService", "ProgressoService"},
            new String[][] {{"usa", "ModalProgresso", "ApiService"}, {"usa", "EndpointExtensions", "IProgressoService", "usa"},
                {"implementa", "ProgressoService", "IProgressoService"}},
            new String[] {"a=:Aluno", "modal=:ModalProgresso", "api=:ApiService", "rota=:EndpointExtensions", "ps=:ProgressoService", "bd=:SQL Server"},
            new String[][] {{"a", "modal", "abre Minhas Estatísticas"}, {"modal", "api", "getEstatisticasDetalhadas(username)"},
                {"api", "rota", "GET /api/usuarios/{username}/stats-detalhadas"}, {"rota", "rota", "EhOProprioUsuario(): só o dono (senão 403)"},
                {"rota", "ps", "EstatisticasAsync(username)"}, {"ps", "bd", "progresso do aluno"}, {"ps", "rota", "EstatisticasDetalhadas", "retorno"},
                {"rota", "api", "200 OK", "retorno"}, {"api", "modal", "números do SM-2", "retorno"}, {"modal", "modal", "mostra os gráficos"}},
            "PIM III: Painel_Visual.renderizar(). PIM IV: dados reais da API, só para o próprio aluno.");

        detalhe(casos, "Acompanhar Desempenho dos Usuários",
            "O Tutor vê cada aluno com XP e números do SM-2 no painel.",
            new String[] {"ModalAdmin", "ApiService", "EndpointExtensions", "IAdminService", "AdminService", "Usuario"},
            new String[][] {{"usa", "ModalAdmin", "ApiService"}, {"usa", "EndpointExtensions", "IAdminService", "usa"},
                {"implementa", "AdminService", "IAdminService"}, {"usa", "AdminService", "Usuario", "consulta"}},
            new String[] {"t=:Tutor", "modal=:ModalAdmin", "rota=:EndpointExtensions", "as=:AdminService", "bd=:SQL Server"},
            new String[][] {{"t", "modal", "abre o painel (aba Alunos)"}, {"modal", "rota", "GET /api/tutor/alunos"},
                {"rota", "rota", "política tutor-ou-admin (Aluno: 403)"}, {"rota", "as", "PainelDosAlunosAsync()"},
                {"as", "bd", "alunos e progresso de cada um"}, {"as", "rota", "lista por XP", "retorno"}, {"rota", "modal", "200 OK", "retorno"}},
            "PIM III: Painel_Visual.obterMetricas(). PIM IV: rota protegida por perfil e dados do SM-2 de cada aluno.");

        detalhe(casos, "Gerenciar Conteúdo das Cartas",
            "O Tutor edita ou exclui cartas; a carta moderada fica registrada para a carga inicial não a recriar.",
            new String[] {"ModalAdmin", "ApiService", "EndpointExtensions", "IConteudoService", "ConteudoService", "Flashcard", "CartaModerada"},
            new String[][] {{"usa", "ModalAdmin", "ApiService"}, {"usa", "EndpointExtensions", "IConteudoService", "usa"},
                {"implementa", "ConteudoService", "IConteudoService"}, {"usa", "ConteudoService", "Flashcard", "altera"},
                {"usa", "ConteudoService", "CartaModerada", "registra"}},
            new String[] {"t=:Tutor", "modal=:ModalAdmin", "rota=:EndpointExtensions", "cs=:ConteudoService", "bd=:SQL Server"},
            new String[][] {{"t", "modal", "edita uma carta"}, {"modal", "rota", "PUT /api/flashcards/{id}"},
                {"rota", "cs", "EditarFlashcardAsync(id, frente, verso, dica)"}, {"cs", "bd", "se a frente mudou, grava CartaModerada"},
                {"cs", "bd", "UPDATE flashcards"}, {"cs", "rota", "Flashcard", "retorno"},
                {"t", "modal", "exclui uma carta e confirma"}, {"modal", "rota", "DELETE /api/flashcards/{id}"},
                {"rota", "cs", "ExcluirFlashcardAsync(id)"}, {"cs", "bd", "grava CartaModerada e apaga (progresso sai em cascata)"},
                {"cs", "rota", "ok", "retorno"}},
            "PIM III: o Tutor criava módulos novos. PIM IV: módulos fixos; o Tutor modera as cartas.");

        detalhe(casos, "Criar Flashcards",
            "O aluno cria uma carta numa fase; ela entra no deck local e é gravada na API.",
            new String[] {"ModalCriacao", "EstudoContext", "ApiService", "EndpointExtensions", "IConteudoService", "ConteudoService", "Flashcard"},
            new String[][] {{"usa", "ModalCriacao", "EstudoContext"}, {"usa", "EstudoContext", "ApiService"},
                {"usa", "EndpointExtensions", "IConteudoService", "usa"}, {"implementa", "ConteudoService", "IConteudoService"},
                {"usa", "ConteudoService", "Flashcard", "cria"}},
            new String[] {"a=:Aluno", "modal=:ModalCriacao", "ctx=:EstudoContext", "rota=:EndpointExtensions", "cs=:ConteudoService", "bd=:SQL Server"},
            new String[][] {{"a", "modal", "preenche fase, frente, verso e dica"}, {"modal", "ctx", "criarCarta(dados)"},
                {"ctx", "ctx", "valida e coloca no deck local"}, {"ctx", "rota", "POST /api/flashcards (JWT)"},
                {"rota", "cs", "CriarFlashcardAsync(fase, frente, verso, dica)"}, {"cs", "bd", "a fase existe? INSERT flashcards"},
                {"cs", "rota", "Flashcard", "retorno"}, {"rota", "ctx", "200 OK", "retorno"}},
            "PIM III: Editor recebia (pergunta, resposta). PIM IV: a carta vale no site na hora e fica salva no banco.");

        detalhe(casos, "Gerenciar Perfis e Acessos",
            "O Administrador define o perfil de cada usuário; ninguém muda o próprio perfil.",
            new String[] {"ModalAdmin", "ApiService", "EndpointExtensions", "IAdminService", "AdminService", "Usuario"},
            new String[][] {{"usa", "ModalAdmin", "ApiService"}, {"usa", "EndpointExtensions", "IAdminService", "usa"},
                {"implementa", "AdminService", "IAdminService"}, {"usa", "AdminService", "Usuario", "altera o perfil"}},
            new String[] {"adm=:Administrador", "modal=:ModalAdmin", "rota=:EndpointExtensions", "as=:AdminService", "bd=:SQL Server"},
            new String[][] {{"adm", "modal", "aba Usuários: escolhe o perfil"}, {"modal", "rota", "PUT /api/admin/usuarios/{id}/perfil"},
                {"rota", "rota", "política admin (outros perfis: 403)"}, {"rota", "as", "DefinirPerfilAsync(quemPede, id, perfil)"},
                {"as", "as", "não pode o próprio; perfil Aluno, Tutor ou Admin"}, {"as", "bd", "UPDATE usuarios.perfil (CHECK)"},
                {"as", "rota", "UsuarioResumo", "retorno"}, {"rota", "modal", "200 OK", "retorno"}},
            "PIM III: GerenciadorAcesso.alterarPapel(id, papel). PIM IV: perfil no banco com CHECK e conferido pela API.");

        detalhe(casos, "Ajustar Acessibilidade",
            "O usuário aumenta a fonte, liga o alto contraste ou usa o VLibras; as escolhas ficam salvas no navegador.",
            new String[] {"Topo", "acessibilidade.js"},
            new String[][] {{"usa", "Topo", "acessibilidade.js"}},
            new String[] {"u=:Usuário", "topo=:Topo", "acc=:acessibilidade.js"},
            new String[][] {{"u", "topo", "A+, A- ou alto contraste"}, {"topo", "acc", "mudarZoom(+1 ou -1)"},
                {"acc", "acc", "muda o tamanho da fonte e salva quest_zoom"}, {"topo", "acc", "alternarAltoContraste()"},
                {"acc", "acc", "liga high-contrast-mode e salva no navegador"}},
            "PIM III: PainelConfiguracao.salvar(). PIM IV: zoom e alto contraste no site, mais o VLibras (gov.br) para Libras.");

        detalhe(casos, "Gerenciar Minha Conta",
            "Novo no PIM IV (PB02): o usuário vê e exporta os próprios dados, troca e-mail e senha e exclui a conta.",
            new String[] {"ModalConta", "ContaEndpoints", "IContaService", "ContaService", "IPoliticaDeSenha", "Usuario"},
            new String[][] {{"usa", "ModalConta", "ContaEndpoints"}, {"usa", "ContaEndpoints", "IContaService", "usa"},
                {"implementa", "ContaService", "IContaService"}, {"usa", "ContaService", "IPoliticaDeSenha", "usa"},
                {"usa", "ContaService", "Usuario", "altera ou exclui"}},
            new String[] {"u=:Usuário", "modal=:ModalConta", "rota=:ContaEndpoints", "cs=:ContaService", "bd=:SQL Server"},
            new String[][] {{"u", "modal", "troca a senha"}, {"modal", "rota", "PUT /api/conta/senha {senhaAtual, novaSenha}"},
                {"rota", "cs", "AlterarSenhaAsync(usuarioId, senhaAtual, novaSenha)"}, {"cs", "cs", "confere a senha atual e a política"},
                {"cs", "bd", "UPDATE senha_hash"}, {"cs", "rota", "ok", "retorno"}, {"rota", "modal", "204", "retorno"},
                {"u", "modal", "exclui a conta"}, {"modal", "rota", "POST /api/conta/excluir {senhaAtual}"},
                {"rota", "cs", "ExcluirAsync(usuarioId, senhaAtual)"}, {"cs", "bd", "apaga a conta (progresso e histórico em cascata)"},
                {"cs", "rota", "ok (o último Admin não pode)", "retorno"}, {"rota", "modal", "204", "retorno"}},
            "Não existia no PIM III. Atende aos direitos de acesso, correção e eliminação da LGPD.");

        detalhe(casos, "Estudar sem Internet (app)",
            "Novo no PIM IV: no app, a resposta sem internet espera numa fila no aparelho e é enviada depois.",
            new String[] {"EstudoScreen", "sincronizacao.js", "armazenamento.js", "ApiService", "IProgressoService"},
            new String[][] {{"usa", "EstudoScreen", "sincronizacao.js"}, {"usa", "sincronizacao.js", "armazenamento.js"},
                {"usa", "sincronizacao.js", "ApiService"}},
            new String[] {"a=:Aluno", "tela=:EstudoScreen", "sinc=:sincronizacao.js", "arm=:armazenamento.js", "api=:API"},
            new String[][] {{"a", "tela", "responde uma carta"}, {"tela", "sinc", "responder(carta, resultado)"},
                {"sinc", "api", "POST /api/progresso/atualizar"}, {"api", "sinc", "ErroDeRede (sem internet)", "retorno"},
                {"sinc", "arm", "guarda a resposta na fila (AsyncStorage)"}, {"a", "tela", "volta a ter internet"},
                {"tela", "sinc", "sincronizar()"}, {"sinc", "api", "reenvia a fila"}, {"sinc", "api", "GET /api/progresso/usuario"},
                {"api", "sinc", "SM-2 calculado no servidor", "retorno"}, {"sinc", "arm", "adota o SM-2 do servidor"}},
            "Não existia no PIM III, que não tinha app. Erros de regra (400) não voltam para a fila.");
    }

    /** Tipos que o Astah cria sozinho ao ler as assinaturas (List, Task, Promise...): também recebem definição. */
    private static void definirTipos() throws Exception {
        for (com.change_vision.jude.api.inf.model.INamedElement e : projeto.findElements(IClass.class)) {
            if (e.getDefinition() != null && !e.getDefinition().isBlank()) continue;
            e.setDefinition(e.getName().isBlank()
                ? "Parte de um tipo genérico (por exemplo Task<...>), criada pelo Astah ao ler as assinaturas."
                : "Tipo " + e.getName() + " usado nas assinaturas de atributos e operações; criado pelo Astah ao ler o tipo.");
        }
    }

    private static IPackage pacote(IPackage pai, String nome, String definicao) throws Exception {
        IPackage p = modelo.createPackage(pai, nome);
        p.setDefinition(definicao);
        return p;
    }

    private static final Map<String, String> DEF_CASOS = Map.ofEntries(
        Map.entry("Cadastrar Novo Usuário", "O visitante cria a conta; a senha é conferida no navegador e na API e gravada com BCrypt."),
        Map.entry("Realizar Login", "Entrar com nickname ou e-mail e senha; a API devolve um token JWT de 24 horas com o perfil."),
        Map.entry("Ajustar Acessibilidade", "Aumentar a fonte, ligar o alto contraste ou usar o VLibras."),
        Map.entry("Gerenciar Minha Conta", "Ver e exportar os próprios dados, trocar e-mail e senha e excluir a conta (PB02)."),
        Map.entry("Estudar Flashcards", "Estudar as cartas de uma fase; o SM-2 agenda a próxima revisão de cada carta."),
        Map.entry("Realizar Teste de Nivelamento", "Responder 10 perguntas que definem a fase inicial."),
        Map.entry("Realizar Simulado ENADE", "Fazer o teste do módulo ou uma prova oficial do ENADE, com correção e justificativa."),
        Map.entry("Visualizar Painel de Desempenho", "Ver os próprios números do SM-2."),
        Map.entry("Criar Flashcards", "Criar uma carta numa fase."),
        Map.entry("Acompanhar Desempenho dos Usuários", "O Tutor vê o XP e o SM-2 de cada aluno."),
        Map.entry("Gerenciar Conteúdo das Cartas", "O Tutor edita ou exclui cartas."),
        Map.entry("Gerenciar Perfis e Acessos", "O Administrador define o perfil de cada usuário."),
        Map.entry("Estudar sem Internet (app)", "No app, respostas sem internet esperam numa fila e são enviadas depois."),
        Map.entry("Atribuir XP e Moedas", "Ao concluir uma fase, somar XP e moedas; a API aceita no máximo +200 por vez."),
        Map.entry("Desbloquear Fases e Módulos", "Concluir uma fase libera a próxima; moedas compram fases bônus."),
        Map.entry("Consultar Agente Especialista (IA)", "Planejado no PIM III e ainda não implementado: tirar dúvidas com um agente de IA."),
        Map.entry("Escalar Dúvida para Tutor", "Planejado no PIM III e ainda não implementado: a IA passaria a dúvida difícil para um Tutor."));

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
        membrosDe.put(nome, new String[][] {atributos, operacoes});
        membros(c, atributos, operacoes);
        definir(c, nome);
        return no(d, c, x, y, nome, atributos, operacoes);
    }

    private static INodePresentation interfaceNo(ClassDiagramEditor d, IPackage pacote, String nome, double x, double y, String[] operacoes) throws Exception {
        IClass c = modelo.createInterface(pacote, nome);
        classes.put(nome, c);
        membrosDe.put(nome, new String[][] {new String[0], operacoes});
        membros(c, new String[0], operacoes);
        definir(c, nome);
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
            String[] multiplicidade = null;
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("^(.*?) \\[([0-9*]+)\\.\\.([0-9*]+)\\]$").matcher(tipo);
            if (m.matches()) {
                tipo = m.group(1);
                multiplicidade = new String[] {m.group(2), m.group(3)};
            }
            IAttribute at = modelo.createAttribute(c, partes[0], tipo.trim());
            at.setVisibility("public");
            if (multiplicidade != null) at.setMultiplicityStrings(new String[][] {multiplicidade});
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
                for (String prm : params.split(", (?=\\w+ : )")) {
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
        d.createLinkPresentation(relacao("herda", filha, mae, ""), p.get(filha), p.get(mae));
    }

    private static void associacao(ClassDiagramEditor d, Map<String, INodePresentation> p, String a, String multA,
                                   String b, String multB, String nome, boolean composicaoEmA) throws Exception {
        IAssociation as = modelo.createAssociation(classes.get(a), classes.get(b), nome, "", "");
        for (IAttribute ponta : as.getMemberEnds()) {
            boolean ehA = ponta.getType() == classes.get(a);
            ponta.setMultiplicityStrings(new String[][] {ehA ? faixa(multA) : faixa(multB)});
            if (ehA && composicaoEmA) ponta.setComposite();
        }
        relacoes.put("associa|" + a + "|" + b, as);
        d.createLinkPresentation(as, p.get(a), p.get(b));
    }

    private static String[] faixa(String mult) {
        return mult.contains("..") ? mult.split("\\.\\.") : new String[] {mult};
    }
}
