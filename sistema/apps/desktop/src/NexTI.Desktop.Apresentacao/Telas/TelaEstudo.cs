using NexTI.Desktop.Aplicacao;
using NexTI.Desktop.Dominio.Entidades;
using NexTI.Desktop.Dominio.Regras;

namespace NexTI.Desktop.Apresentacao.Telas;

/// <summary>
/// O estudo de uma fase: mostra a pergunta, depois a resposta e os quatro botões do SM-2.
/// Atalhos: Espaço mostra a resposta; 1, 2, 3 e 4 respondem Errei, Difícil, Bom e Fácil.
/// </summary>
internal class TelaEstudo : Form
{
    private readonly ServicoDeEstudo _estudo;
    private readonly Aluno _aluno;
    private readonly SessaoDeEstudo _sessao;

    private readonly Label _contador = Tema.Rotulo(string.Empty, 10, Tema.TextoApagado);
    private readonly Label _frente = CaixaDeTexto(18, FontStyle.Bold, Tema.Texto);
    private readonly Label _verso = CaixaDeTexto(14, FontStyle.Regular, Tema.Verde);
    private readonly Label _dica = CaixaDeTexto(9, FontStyle.Italic, Tema.TextoApagado);
    private readonly Button _mostrar = Tema.Botao("Mostrar resposta (Espaço)", Tema.Ciano, 300);
    private readonly FlowLayoutPanel _respostas = new() { AutoSize = true, Visible = false };

    public TelaEstudo(ServicoDeEstudo estudo, Aluno aluno, SessaoDeEstudo sessao)
    {
        _estudo = estudo;
        _aluno = aluno;
        _sessao = sessao;
        Tema.Aplicar(this, $"Estudando: {sessao.Fase.Descricao}", new Size(760, 520));
        MinimumSize = new Size(640, 480);

        var titulo = Tema.Rotulo(sessao.Fase.Descricao, 14, Tema.Ciano, FontStyle.Bold);
        var topo = new FlowLayoutPanel { Dock = DockStyle.Top, Height = 70, Padding = new Padding(20, 14, 20, 0), FlowDirection = FlowDirection.TopDown };
        topo.Controls.AddRange([titulo, _contador]);

        var carta = new TableLayoutPanel { Dock = DockStyle.Fill, BackColor = Tema.Cartao, Padding = new Padding(24), ColumnCount = 1, RowCount = 3 };
        carta.RowStyles.Add(new RowStyle(SizeType.Percent, 45));
        carta.RowStyles.Add(new RowStyle(SizeType.Percent, 40));
        carta.RowStyles.Add(new RowStyle(SizeType.Percent, 15));
        carta.Controls.Add(_frente, 0, 0);
        carta.Controls.Add(_verso, 0, 1);
        carta.Controls.Add(_dica, 0, 2);
        var moldura = new Panel { Dock = DockStyle.Fill, Padding = new Padding(20, 0, 20, 0) };
        moldura.Controls.Add(carta);

        _mostrar.Click += (_, _) => MostrarResposta();
        foreach (var (texto, resposta, cor) in new[]
                 {
                     ("1  Errei", Resposta.Errei, Tema.Vermelho), ("2  Difícil", Resposta.Dificil, Tema.Amarelo),
                     ("3  Bom", Resposta.Bom, Tema.Verde), ("4  Fácil", Resposta.Facil, Tema.Ciano),
                 })
        {
            var b = Tema.Botao(texto, cor, 160);
            b.Click += (_, _) => Responder(resposta);
            _respostas.Controls.Add(b);
        }

        var rodape = new FlowLayoutPanel { Dock = DockStyle.Bottom, Height = 70, Padding = new Padding(20, 14, 20, 0) };
        rodape.Controls.AddRange([_mostrar, _respostas]);

        Controls.AddRange([moldura, rodape, topo]);
        KeyDown += AoApertarTecla;
        MostrarCarta();
    }

    private static Label CaixaDeTexto(float tamanho, FontStyle estilo, Color cor) => new()
    {
        Dock = DockStyle.Fill,
        TextAlign = ContentAlignment.MiddleCenter,
        Font = Tema.Fonte(tamanho, estilo),
        ForeColor = cor,
        AutoSize = false,
    };

    private void MostrarCarta()
    {
        var carta = _sessao.CartaAtual!;
        _contador.Text = $"Faltam {_sessao.Restantes} de {_sessao.TotalDeCartas} cartas · respondidas: {_sessao.Respondidas}";
        _frente.Text = carta.Frente;
        _verso.Text = string.Empty;
        _dica.Text = carta.Dica ?? string.Empty;
        _mostrar.Visible = true;
        _respostas.Visible = false;
        _mostrar.Focus();
    }

    private void MostrarResposta()
    {
        _verso.Text = _sessao.CartaAtual!.Verso;
        _mostrar.Visible = false;
        _respostas.Visible = true;
    }

    private void Responder(Resposta resposta)
    {
        if (!_respostas.Visible) return;
        _estudo.Responder(_aluno, _sessao, resposta);
        if (_sessao.Terminou) Concluir();
        else MostrarCarta();
    }

    private void Concluir()
    {
        var r = _estudo.ConcluirFase(_aluno, _sessao);
        var texto = r.PrimeiraVez
            ? $"Fase concluída! Você ganhou {r.Premio.Xp} XP e {r.Premio.Moedas} moedas."
              + (r.FaseLiberada is null ? string.Empty : $"\n\nPróxima fase liberada: {r.FaseLiberada}.")
              + (r.SubiuDeNivel ? $"\n\nVocê subiu para o nível {r.NivelDepois}!" : string.Empty)
            : "Revisão concluída. O prêmio desta fase já foi recebido; a revisão conta para o SM-2.";
        MessageBox.Show(this, texto, "Fim da fase", MessageBoxButtons.OK, MessageBoxIcon.Information);
        DialogResult = DialogResult.OK;
    }

    private void AoApertarTecla(object? sender, KeyEventArgs e)
    {
        if (e.KeyCode == Keys.Space && _mostrar.Visible) { MostrarResposta(); e.Handled = e.SuppressKeyPress = true; }
        else if (e.KeyCode is >= Keys.D1 and <= Keys.D4) Responder((Resposta)(e.KeyCode - Keys.D1));
        else if (e.KeyCode is >= Keys.NumPad1 and <= Keys.NumPad4) Responder((Resposta)(e.KeyCode - Keys.NumPad1));
        else if (e.KeyCode == Keys.Escape) Close();
    }
}
