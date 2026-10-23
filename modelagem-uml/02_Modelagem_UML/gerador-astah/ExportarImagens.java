import com.change_vision.jude.api.inf.AstahAPI;
import com.change_vision.jude.api.inf.model.IDiagram;
import com.change_vision.jude.api.inf.model.INamedElement;
import com.change_vision.jude.api.inf.project.ProjectAccessor;

/**
 * Exporta em PNG todos os diagramas do .asta. A exportação da API só funciona com o Astah
 * aberto, então este programa abre a janela do Astah no mesmo processo, espera o projeto
 * carregar, exporta e fecha. Uso: ExportarImagens.java <arquivo.asta> <pasta de saída>
 */
public class ExportarImagens {
    public static void main(String[] args) throws Exception {
        String arquivo = args[0], pasta = args[1];
        Thread gui = new Thread(() -> {
            try {
                Class.forName("JP.co.esm.caddies.jomt.Jude").getMethod("main", String[].class).invoke(null, (Object) new String[] {arquivo});
            } catch (Throwable t) {
                System.out.println("GUI falhou: " + t);
            }
        });
        gui.setDaemon(true);
        gui.start();
        ProjectAccessor projeto = null;
        for (int i = 0; i < 90; i++) {   // espera até 3 minutos o projeto abrir na janela
            Thread.sleep(2000);
            try {
                projeto = AstahAPI.getAstahAPI().getProjectAccessor();
                if (projeto.getProject() != null && projeto.findElements(IDiagram.class).length > 0) break;
            } catch (Throwable t) {
                projeto = null;
            }
        }
        if (projeto == null) {
            System.out.println("projeto não abriu");
            System.exit(1);
        }
        int ok = 0;
        for (INamedElement e : projeto.findElements(IDiagram.class)) {
            try {
                System.out.println("OK " + ((IDiagram) e).exportImage(pasta, "png", 144));
                ok++;
            } catch (Throwable t) {
                System.out.println("ERRO " + e.getName() + ": " + t);
            }
        }
        System.out.println("exportados: " + ok);
        System.exit(0);
    }
}
