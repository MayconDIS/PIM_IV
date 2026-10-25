using NexTI.Desktop.Aplicacao;
using NexTI.Desktop.Dominio.Entidades;

namespace NexTI.Desktop.Apresentacao.Telas;

/// <summary>Primeira tela: o aluno digita o nickname. Se ele ainda não existe neste computador, é criado.</summary>
internal sealed class TelaEntrada : Form
{
    private readonly ServicoDeAlunos _alunos;
    private readonly TextBox _nickname = new() { Width = 300, Font = Tema.Fonte(12), BackColor = Tema.Cartao, ForeColor = Tema.Texto, BorderStyle = BorderStyle.FixedSingle };
    private readonly Label _erro = Tema.Rotulo(string.Empty, 9, Tema.Vermelho);

    public Aluno? AlunoQueEntrou { get; private set; }

    public TelaEntrada(ServicoDeAlunos alunos)
    {
        _alunos = alunos;
        Tema.Aplicar(this, "Nex_TI Desktop", new Size(420, 330));
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;

        var marca = Tema.Rotulo("Nex_TI", 28, Tema.Ciano, FontStyle.Bold);
        var subtitulo = Tema.Rotulo("Flashcards com revisão espaçada (SM-2)", 10, Tema.TextoApagado);
        var rotulo = Tema.Rotulo("Seu nickname", 10, Tema.Texto, FontStyle.Bold);
        var entrar = Tema.Botao("Entrar", Tema.Ciano, 300);
        entrar.Click += (_, _) => Entrar();
        AcceptButton = entrar;

        var coluna = new FlowLayoutPanel
        {
            Dock = DockStyle.Fill,
            FlowDirection = FlowDirection.TopDown,
            WrapContents = false,
            Padding = new Padding(55, 30, 0, 0),
        };
        coluna.Controls.AddRange([marca, subtitulo, Espaco(18), rotulo, _nickname, _erro, Espaco(6), entrar]);
        Controls.Add(coluna);
    }

    private static Control Espaco(int altura) => new Panel { Height = altura, Width = 1 };

    private void Entrar()
    {
        try
        {
            AlunoQueEntrou = _alunos.Entrar(_nickname.Text);
            DialogResult = DialogResult.OK;
        }
        catch (ArgumentException ex)
        {
            _erro.Text = ex.Message.Split(" (")[0];   // tira o "(Parameter 'nickname')" do .NET
            _nickname.Focus();
        }
    }
}
