using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using NexTI_API.Models;

namespace NexTI_API.Services;

/// <summary>Vincula o JWT à credencial atual sem incluir o hash BCrypt no token.</summary>
public static class SessaoAtual
{
    public const string ClaimCredencial = "credencial";

    public static string Assinatura(Usuario usuario, ChaveJwt chave) =>
        Convert.ToHexString(HMACSHA256.HashData(chave.Bytes, Encoding.UTF8.GetBytes(usuario.SenhaHash)));

    public static bool Valida(ClaimsPrincipal? principal, Usuario? usuario, ChaveJwt chave) =>
        usuario is not null && principal?.FindFirst(ClaimCredencial)?.Value is string assinatura &&
        assinatura == Assinatura(usuario, chave);
}
