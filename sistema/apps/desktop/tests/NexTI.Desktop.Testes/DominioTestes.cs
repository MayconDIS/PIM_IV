using NexTI.Desktop.Aplicacao;
using NexTI.Desktop.Dominio.Entidades;
using NexTI.Desktop.Dominio.Regras;

namespace NexTI.Desktop.Testes;

/// <summary>Regras que ficam dentro das próprias classes (encapsulamento) e na sessão de estudo.</summary>
public class DominioTestes
{
    [Theory]
    [InlineData("")]
    [InlineData("ab")]
    [InlineData("   ab   ")]
    [InlineData("nome_com_mais_de_vinte")]
    public void Aluno_NicknameForaDoTamanho_ERecusado(string nickname)
    {
        Assert.Throws<ArgumentException>(() => new Aluno(nickname));
    }

    [Fact]
    public void Aluno_GuardaONicknameSemEspacosEDizOPerfil()
    {
        Usuario usuario = new Aluno("  maycon  ");

        Assert.Equal("maycon", usuario.Nickname);
        Assert.Equal("Aluno", usuario.Perfil);   // polimorfismo: a classe filha responde
    }

    [Fact]
    public void Aluno_RecebeOPremioDaFaseSoNaPrimeiraVez()
    {
        var aluno = new Aluno("maycon");

        Assert.True(aluno.ReceberPremio("fase1", new Premio(5, 10)));
        Assert.False(aluno.ReceberPremio("fase1", new Premio(5, 10)));

        Assert.Equal(5, aluno.Xp);
        Assert.Equal(10, aluno.Moedas);
        Assert.True(aluno.JaConcluiu("fase1"));
        Assert.Single(aluno.FasesConcluidas);
    }

    [Fact]
    public void Sessao_CartaComErreiVoltaParaOFimDaFila()
    {
        var fase = new Fase("fase1", "Lógica", 1);
        var a = new Flashcard("fase1", "A?", "a", null);
        var b = new Flashcard("fase1", "B?", "b", null);
        var sessao = new SessaoDeEstudo(fase, [a, b]);

        sessao.Avancar(Resposta.Errei);            // A volta para o fim
        Assert.Same(b, sessao.CartaAtual);
        sessao.Avancar(Resposta.Bom);
        Assert.Same(a, sessao.CartaAtual);
        sessao.Avancar(Resposta.Facil);

        Assert.True(sessao.Terminou);
        Assert.Equal(3, sessao.Respondidas);
        Assert.Equal(2, sessao.TotalDeCartas);
    }
}
