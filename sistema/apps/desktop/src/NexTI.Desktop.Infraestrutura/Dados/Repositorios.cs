using Microsoft.EntityFrameworkCore;
using NexTI.Desktop.Dominio.Entidades;
using NexTI.Desktop.Dominio.Repositorios;

namespace NexTI.Desktop.Infraestrutura.Dados;

// As interfaces do domínio implementadas com EF Core. Todas usam o mesmo ContextoNexTI,
// então o Salvar() da unidade de trabalho grava o que qualquer uma delas mudou.

public class RepositorioDeFases : IRepositorioDeFases
{
    private readonly ContextoNexTI _contexto;
    public RepositorioDeFases(ContextoNexTI contexto) => _contexto = contexto;

    public IReadOnlyList<Fase> ListarComCartas() =>
        _contexto.Fases.Include(f => f.Cartas).OrderBy(f => f.Ordem).ToList();

    public Fase? ObterComCartas(string codigo) =>
        _contexto.Fases.Include(f => f.Cartas).FirstOrDefault(f => f.Codigo == codigo);
}

public class RepositorioDeAlunos : IRepositorioDeAlunos
{
    private readonly ContextoNexTI _contexto;
    public RepositorioDeAlunos(ContextoNexTI contexto) => _contexto = contexto;

    public Aluno? ObterPorNickname(string nickname) =>
        _contexto.Alunos.Include(a => a.FasesConcluidas).FirstOrDefault(a => a.Nickname == nickname);

    public void Adicionar(Aluno aluno) => _contexto.Alunos.Add(aluno);
}

public class RepositorioDeRevisoes : IRepositorioDeRevisoes
{
    private readonly ContextoNexTI _contexto;
    public RepositorioDeRevisoes(ContextoNexTI contexto) => _contexto = contexto;

    // Local + banco: a revisão recém-criada (ainda não salva) também aparece.
    public IReadOnlyList<Revisao> DoAluno(int alunoId) =>
        _contexto.Revisoes.Where(r => r.AlunoId == alunoId).ToList()
            .Union(_contexto.Revisoes.Local.Where(r => r.AlunoId == alunoId))
            .ToList();

    public void Adicionar(Revisao revisao) => _contexto.Revisoes.Add(revisao);
}

public class UnidadeDeTrabalho : IUnidadeDeTrabalho
{
    private readonly ContextoNexTI _contexto;
    public UnidadeDeTrabalho(ContextoNexTI contexto) => _contexto = contexto;

    public void Salvar() => _contexto.SaveChanges();
}
