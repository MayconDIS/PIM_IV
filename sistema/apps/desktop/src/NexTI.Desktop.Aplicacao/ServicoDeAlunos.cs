using NexTI.Desktop.Dominio.Entidades;
using NexTI.Desktop.Dominio.Repositorios;

namespace NexTI.Desktop.Aplicacao;

/// <summary>Caso de uso "Entrar": acha o aluno pelo nickname ou cria um novo neste computador.</summary>
public class ServicoDeAlunos
{
    private readonly IRepositorioDeAlunos _alunos;
    private readonly IUnidadeDeTrabalho _unidade;

    public ServicoDeAlunos(IRepositorioDeAlunos alunos, IUnidadeDeTrabalho unidade)
    {
        _alunos = alunos;
        _unidade = unidade;
    }

    /// <exception cref="ArgumentException">Nickname com menos de 3 ou mais de 20 letras.</exception>
    public Aluno Entrar(string nickname)
    {
        var existente = _alunos.ObterPorNickname((nickname ?? string.Empty).Trim());
        if (existente is not null) return existente;

        var novo = new Aluno(nickname!);   // o construtor confere o tamanho
        _alunos.Adicionar(novo);
        _unidade.Salvar();
        return novo;
    }
}
