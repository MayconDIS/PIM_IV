using Microsoft.EntityFrameworkCore;
using NexTI.Desktop.Dominio.Entidades;

namespace NexTI.Desktop.Infraestrutura.Dados;

/// <summary>
/// O banco do programa (SQLite, um arquivo no computador do aluno), pelo EF Core:
/// cada DbSet vira uma tabela e as regras de chave e relacionamento ficam em OnModelCreating.
/// </summary>
public class ContextoNexTI : DbContext
{
    public ContextoNexTI(DbContextOptions<ContextoNexTI> opcoes) : base(opcoes) { }

    public DbSet<Fase> Fases => Set<Fase>();
    public DbSet<Flashcard> Flashcards => Set<Flashcard>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Aluno> Alunos => Set<Aluno>();
    public DbSet<Revisao> Revisoes => Set<Revisao>();
    public DbSet<FaseConcluida> FasesConcluidas => Set<FaseConcluida>();

    protected override void OnModelCreating(ModelBuilder modelo)
    {
        modelo.Entity<Fase>(f =>
        {
            f.HasKey(x => x.Codigo);
            f.Property(x => x.Codigo).HasMaxLength(20);
            f.Property(x => x.Descricao).HasMaxLength(100).IsRequired();
            f.HasMany(x => x.Cartas).WithOne().HasForeignKey(c => c.CodigoFase);
        });

        modelo.Entity<Flashcard>(c =>
        {
            c.Property(x => x.Frente).IsRequired();
            c.Property(x => x.Verso).IsRequired();
        });

        // Herança: Usuario e Aluno na mesma tabela, com a coluna "TipoDeUsuario" dizendo o tipo.
        // O Perfil mostrado na tela vem da própria classe (polimorfismo) e não vai para o banco.
        modelo.Entity<Usuario>(u =>
        {
            u.Ignore(x => x.Perfil);
            u.HasDiscriminator<string>("TipoDeUsuario").HasValue<Aluno>("Aluno");
            u.Property(x => x.Nickname).HasMaxLength(Usuario.TamanhoMaximo).IsRequired();
            u.HasIndex(x => x.Nickname).IsUnique();
        });

        modelo.Entity<Aluno>(a =>
        {
            a.HasMany(x => x.FasesConcluidas).WithOne().HasForeignKey(f => f.AlunoId);
            a.Navigation(x => x.FasesConcluidas).UsePropertyAccessMode(PropertyAccessMode.Field);
        });

        modelo.Entity<FaseConcluida>(f =>
        {
            f.Property(x => x.CodigoFase).HasMaxLength(20);
            f.HasIndex(x => new { x.AlunoId, x.CodigoFase }).IsUnique();   // o prêmio de cada fase sai uma vez só
            f.HasOne<Fase>().WithMany().HasForeignKey(x => x.CodigoFase);
        });

        modelo.Entity<Revisao>(r =>
        {
            r.HasIndex(x => new { x.AlunoId, x.FlashcardId }).IsUnique();
            r.HasOne<Aluno>().WithMany().HasForeignKey(x => x.AlunoId);
            r.HasOne<Flashcard>().WithMany().HasForeignKey(x => x.FlashcardId);
        });
    }
}
