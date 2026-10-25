using NexTI.Desktop.Aplicacao;
using NexTI.Desktop.Apresentacao.Telas;
using NexTI.Desktop.Dominio.Regras;
using NexTI.Desktop.Infraestrutura.Dados;

namespace NexTI.Desktop.Apresentacao;

internal static class Program
{
    /// <summary>
    /// Ponto de partida e o único lugar que conhece todas as camadas: abre o banco
    /// (Infraestrutura), monta os serviços (Aplicação) com as regras (Domínio) e abre as telas.
    /// </summary>
    [STAThread]
    private static void Main()
    {
        ApplicationConfiguration.Initialize();
        // Erro inesperado numa tela: avisa com a mensagem em vez de fechar o programa.
        Application.ThreadException += (_, e) =>
            MessageBox.Show(e.Exception.Message, "Nex_TI Desktop: erro", MessageBoxButtons.OK, MessageBoxIcon.Error);

        var dados = Path.Combine(AppContext.BaseDirectory, "Dados");
        using var contexto = FabricaDoContexto.AbrirEPreparar(FabricaDoContexto.CaminhoPadrao(), Path.Combine(dados, "conteudo.json"));

        var unidade = new UnidadeDeTrabalho(contexto);
        var alunos = new ServicoDeAlunos(new RepositorioDeAlunos(contexto), unidade);
        var estudo = new ServicoDeEstudo(new RepositorioDeFases(contexto), new RepositorioDeRevisoes(contexto), unidade,
            new AgendadorSm2(), TabelaDeRecompensas.Carregar(Path.Combine(dados, "recompensas.json")), new RelogioDoSistema());

        using var entrada = new TelaEntrada(alunos);
        if (entrada.ShowDialog() != DialogResult.OK || entrada.AlunoQueEntrou is null) return;

        Application.Run(new TelaPrincipal(estudo, entrada.AlunoQueEntrou));
    }
}
