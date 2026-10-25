using NexTI.Desktop.Dominio.Regras;

namespace NexTI.Desktop.Aplicacao;

// Dados prontos para a tela mostrar: a Apresentação não precisa conhecer as regras.

/// <summary>Uma linha da lista de fases.</summary>
public record ResumoDaFase(string Codigo, string Descricao, int TotalDeCartas, int ParaRevisarHoje, bool Concluida, bool Liberada);

/// <summary>O cabeçalho da tela principal.</summary>
public record PainelDoAluno(string Nickname, string Perfil, int Xp, int Moedas, int Nivel, int FasesConcluidas, int TotalDeFases);

/// <summary>O que aconteceu ao concluir uma fase.</summary>
public record ResultadoDaConclusao(Premio Premio, bool PrimeiraVez, int NivelAntes, int NivelDepois, string? FaseLiberada)
{
    public bool SubiuDeNivel => NivelDepois > NivelAntes;
}
