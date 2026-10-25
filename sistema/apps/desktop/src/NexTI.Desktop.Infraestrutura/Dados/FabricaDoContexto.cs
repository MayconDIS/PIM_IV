using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace NexTI.Desktop.Infraestrutura.Dados;

/// <summary>Onde fica o arquivo do banco e como abrir o contexto.</summary>
public static class FabricaDoContexto
{
    /// <summary>%LOCALAPPDATA%\NexTI.Desktop\nexti-desktop.db (cada usuário do Windows tem o seu).</summary>
    public static string CaminhoPadrao()
    {
        var pasta = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "NexTI.Desktop");
        Directory.CreateDirectory(pasta);
        return Path.Combine(pasta, "nexti-desktop.db");
    }

    public static ContextoNexTI Criar(string conexao) =>
        new(new DbContextOptionsBuilder<ContextoNexTI>().UseSqlite(conexao).Options);

    /// <summary>Abre o banco, aplica as migrations pendentes e põe o conteúdo se estiver vazio.</summary>
    public static ContextoNexTI AbrirEPreparar(string caminhoDoBanco, string caminhoDoConteudo)
    {
        var contexto = Criar($"Data Source={caminhoDoBanco}");
        contexto.Database.Migrate();
        SemeadorDeConteudo.Semear(contexto, caminhoDoConteudo);
        return contexto;
    }
}

/// <summary>Usada só pelo "dotnet ef migrations add" para montar o contexto sem abrir o programa.</summary>
public class FabricaParaMigrations : IDesignTimeDbContextFactory<ContextoNexTI>
{
    public ContextoNexTI CreateDbContext(string[] args) => FabricaDoContexto.Criar("Data Source=nexti-desktop.db");
}
