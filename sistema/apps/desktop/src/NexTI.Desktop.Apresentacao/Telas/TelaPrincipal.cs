using NexTI.Desktop.Aplicacao;
using NexTI.Desktop.Dominio.Entidades;

namespace NexTI.Desktop.Apresentacao.Telas;

/// <summary>Painel do aluno: XP, moedas e nível no topo e a trilha de fases embaixo.</summary>
internal class TelaPrincipal : Form
{
    private readonly ServicoDeEstudo _estudo;
    private readonly Aluno _aluno;

    private readonly Label _saudacao = Tema.Rotulo(string.Empty, 16, Tema.Texto, FontStyle.Bold);
    private readonly Label _xp = Tema.Rotulo(string.Empty, 11, Tema.Verde, FontStyle.Bold);
    private readonly Label _moedas = Tema.Rotulo(string.Empty, 11, Tema.Amarelo, FontStyle.Bold);
    private readonly Label _nivel = Tema.Rotulo(string.Empty, 11, Tema.Roxo, FontStyle.Bold);
    private readonly Label _trilha = Tema.Rotulo(string.Empty, 10, Tema.TextoApagado);
    private readonly ListView _fases = new()
    {
        Dock = DockStyle.Fill,
        View = View.Details,
        FullRowSelect = true,
        MultiSelect = false,
        HideSelection = false,
        BackColor = Tema.Cartao,
        ForeColor = Tema.Texto,
        BorderStyle = BorderStyle.None,
        Font = Tema.Fonte(10),
    };

    public TelaPrincipal(ServicoDeEstudo estudo, Aluno aluno)
    {
        _estudo = estudo;
        _aluno = aluno;
        Tema.Aplicar(this, $"Nex_TI Desktop · {aluno.Nickname}", new Size(820, 600));
        MinimumSize = new Size(700, 500);

        var topo = new FlowLayoutPanel { Dock = DockStyle.Top, Height = 110, Padding = new Padding(20, 16, 20, 0), BackColor = Tema.Cartao };
        topo.Controls.AddRange([_saudacao, Quebra(), _xp, _moedas, _nivel, Quebra(), _trilha]);
        foreach (Control c in topo.Controls) c.Margin = new Padding(0, 0, 24, 6);

        _fases.Columns.Add("Fase", 70);
        _fases.Columns.Add("Disciplina", 330);
        _fases.Columns.Add("Cartas", 70, HorizontalAlignment.Center);
        _fases.Columns.Add("Revisar hoje", 100, HorizontalAlignment.Center);
        _fases.Columns.Add("Situação", 150);
        // Cabeçalho da lista desenhado no tema escuro (o padrão do Windows é branco); as linhas seguem o normal.
        _fases.OwnerDraw = true;
        _fases.DrawColumnHeader += (_, e) =>
        {
            using var fundo = new SolidBrush(Tema.Fundo);
            e.Graphics.FillRectangle(fundo, e.Bounds);
            TextRenderer.DrawText(e.Graphics, e.Header!.Text, Tema.Fonte(9, FontStyle.Bold), e.Bounds, Tema.Ciano,
                TextFormatFlags.VerticalCenter | TextFormatFlags.LeftAndRightPadding);
        };
        _fases.Resize += (_, _) => EsticarUltimaColuna();
        _fases.DrawItem += (_, e) => e.DrawDefault = true;
        _fases.DrawSubItem += (_, e) => e.DrawDefault = true;
        _fases.ItemActivate += (_, _) => EstudarSelecionada();   // duplo clique ou Enter na fase

        var estudar = Tema.Botao("Estudar fase", Tema.Ciano, 160);
        estudar.Click += (_, _) => EstudarSelecionada();
        var rodape = new FlowLayoutPanel { Dock = DockStyle.Bottom, Height = 60, Padding = new Padding(20, 10, 20, 0), FlowDirection = FlowDirection.RightToLeft };
        rodape.Controls.Add(estudar);
        rodape.Controls.Add(Tema.Rotulo("Dê dois cliques (ou Enter) numa fase liberada para estudar.", 9, Tema.TextoApagado));

        var meio = new Panel { Dock = DockStyle.Fill, Padding = new Padding(20, 14, 20, 0) };
        meio.Controls.Add(_fases);
        Controls.AddRange([meio, rodape, topo]);   // o último adicionado fica em cima (Dock)

        Atualizar();
    }

    private static Control Quebra() => new Panel { Width = 2000, Height = 0, Margin = Padding.Empty };

    private void Atualizar()
    {
        var p = _estudo.Painel(_aluno);
        _saudacao.Text = $"Olá, {p.Nickname} ({p.Perfil})";
        _xp.Text = $"{p.Xp} XP";
        _moedas.Text = $"{p.Moedas} moedas";
        _nivel.Text = $"Nível {p.Nivel}";
        _trilha.Text = $"Fases concluídas: {p.FasesConcluidas} de {p.TotalDeFases}";

        var selecionada = _fases.SelectedItems.Count > 0 ? _fases.SelectedItems[0].Index : -1;
        _fases.BeginUpdate();
        _fases.Items.Clear();
        foreach (var f in _estudo.ListarFases(_aluno))
        {
            var (situacao, cor) = f.Concluida ? ("✔ Concluída", Tema.Verde) : f.Liberada ? ("▶ Liberada", Tema.Ciano) : ("🔒 Trancada", Tema.TextoApagado);
            var item = new ListViewItem([f.Codigo, f.Descricao, f.TotalDeCartas.ToString(), f.ParaRevisarHoje.ToString(), situacao])
            {
                Tag = f,
                ForeColor = f.Liberada ? Tema.Texto : Tema.TextoApagado,
                UseItemStyleForSubItems = false,
            };
            item.SubItems[4].ForeColor = cor;
            _fases.Items.Add(item);
        }
        _fases.EndUpdate();
        // Mantém a fase escolhida; na primeira vez, seleciona a primeira fase liberada e ainda não concluída.
        if (selecionada < 0)
            selecionada = _fases.Items.Cast<ListViewItem>()
                .FirstOrDefault(i => i.Tag is ResumoDaFase { Liberada: true, Concluida: false })?.Index ?? 0;
        if (selecionada < _fases.Items.Count)
        {
            _fases.Items[selecionada].Selected = _fases.Items[selecionada].Focused = true;
            _fases.EnsureVisible(selecionada);
        }
    }

    protected override void OnShown(EventArgs e)
    {
        base.OnShown(e);
        EsticarUltimaColuna();
        _fases.Focus();
    }

    /// <summary>A coluna "Situação" ocupa o resto da largura (senão sobra uma faixa clara no cabeçalho).</summary>
    private void EsticarUltimaColuna()
    {
        if (_fases.Columns.Count > 0) _fases.Columns[^1].Width = -2;   // -2 = até a borda da lista
    }

    private void EstudarSelecionada()
    {
        if (_fases.SelectedItems.Count == 0 || _fases.SelectedItems[0].Tag is not ResumoDaFase fase) return;
        if (!fase.Liberada)
        {
            MessageBox.Show(this, "Conclua a fase anterior para liberar esta.", "Fase trancada", MessageBoxButtons.OK, MessageBoxIcon.Information);
            return;
        }
        using var tela = new TelaEstudo(_estudo, _aluno, _estudo.IniciarSessao(_aluno, fase.Codigo));
        tela.ShowDialog(this);
        Atualizar();
    }
}
