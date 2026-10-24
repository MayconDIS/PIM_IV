using Microsoft.EntityFrameworkCore;
using NexTI_API.Models;

namespace NexTI_API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Fase> Fases { get; set; }
        public DbSet<Flashcard> Flashcards { get; set; }
        public DbSet<ProgressoFlashcard> Progresso_Flashcards { get; set; }
        public DbSet<AreaConhecimento> AreasConhecimento { get; set; }
        public DbSet<Prova> Provas { get; set; }
        public DbSet<Questao> Questoes { get; set; }
        public DbSet<Alternativa> Alternativas { get; set; }
        public DbSet<CartaModerada> CartasModeradas { get; set; }
        public DbSet<FaseConcluida> FasesConcluidas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Composite Key for ProgressoFlashcard
            modelBuilder.Entity<ProgressoFlashcard>()
                .HasKey(p => new { p.UsuarioId, p.FlashcardId });

            // Uma linha por fase concluída por aluno: é o que garante o prêmio só uma vez.
            modelBuilder.Entity<FaseConcluida>()
                .HasKey(f => new { f.UsuarioId, f.CodigoFase });

            // Tabelas com trigger (migration ObjetosDoBanco). O EF Core precisa saber,
            // senão grava com OUTPUT, que o SQL Server recusa em tabela com trigger.
            modelBuilder.Entity<ProgressoFlashcard>()
                .ToTable(t => t.HasTrigger("tg_progresso_historico"));
            modelBuilder.Entity<Usuario>()
                .ToTable(t =>
                {
                    t.HasTrigger("tg_usuarios_protege_gamificacao");
                    t.HasCheckConstraint("ck_usuarios_perfil", "perfil IN ('Aluno', 'Tutor', 'Admin')");
                });

            // Quem já existia vira Aluno; só um Admin promove alguém a Tutor ou Admin.
            modelBuilder.Entity<Usuario>()
                .Property(u => u.Perfil)
                .HasDefaultValue(Perfis.Aluno);

            // Unique Constraints for Usuario
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Many-to-many relationship tb_prova_questao
            modelBuilder.Entity<Questao>()
                .HasMany(q => q.Provas)
                .WithMany(p => p.Questoes)
                .UsingEntity<System.Collections.Generic.Dictionary<string, object>>(
                    "tb_prova_questao",
                    j => j.HasOne<Prova>().WithMany().HasForeignKey("id_prova"),
                    j => j.HasOne<Questao>().WithMany().HasForeignKey("id_questao")
                );
        }
    }
}
