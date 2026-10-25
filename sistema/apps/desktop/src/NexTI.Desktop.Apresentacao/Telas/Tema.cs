namespace NexTI.Desktop.Apresentacao.Telas;

/// <summary>Cores e componentes com o visual do Nex_TI (fundo escuro, ciano e roxo), usados por todas as telas.</summary>
internal static class Tema
{
    public static readonly Color Fundo = Color.FromArgb(11, 12, 16);
    public static readonly Color Cartao = Color.FromArgb(22, 27, 34);
    public static readonly Color Borda = Color.FromArgb(48, 54, 61);
    public static readonly Color Texto = Color.FromArgb(230, 237, 243);
    public static readonly Color TextoApagado = Color.FromArgb(139, 146, 165);
    public static readonly Color Ciano = Color.FromArgb(0, 230, 230);
    public static readonly Color Roxo = Color.FromArgb(157, 78, 221);
    public static readonly Color Verde = Color.FromArgb(46, 204, 113);
    public static readonly Color Amarelo = Color.FromArgb(241, 196, 15);
    public static readonly Color Vermelho = Color.FromArgb(255, 85, 85);

    public static Font Fonte(float tamanho, FontStyle estilo = FontStyle.Regular) => new("Segoe UI", tamanho, estilo);

    public static void Aplicar(Form tela, string titulo, Size tamanho)
    {
        tela.Text = titulo;
        tela.BackColor = Fundo;
        tela.ForeColor = Texto;
        tela.Font = Fonte(10);
        tela.ClientSize = tamanho;
        tela.StartPosition = FormStartPosition.CenterScreen;
        tela.KeyPreview = true;
    }

    public static Label Rotulo(string texto, float tamanho = 10, Color? cor = null, FontStyle estilo = FontStyle.Regular) => new()
    {
        Text = texto,
        AutoSize = true,
        Font = Fonte(tamanho, estilo),
        ForeColor = cor ?? Texto,
        BackColor = Color.Transparent,
    };

    public static Button Botao(string texto, Color cor, int largura = 140) => Estilizar(new Button { Text = texto, Width = largura, Height = 40 }, cor);

    public static Button Estilizar(Button botao, Color cor)
    {
        botao.FlatStyle = FlatStyle.Flat;
        botao.FlatAppearance.BorderColor = cor;
        botao.FlatAppearance.MouseOverBackColor = Color.FromArgb(40, cor);
        botao.ForeColor = cor;
        botao.BackColor = Cartao;
        botao.Font = Fonte(10, FontStyle.Bold);
        botao.Cursor = Cursors.Hand;
        return botao;
    }
}
