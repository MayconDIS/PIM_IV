using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace NexTI_API.Services
{
    /// <summary>
    /// Regras de senha do cadastro — as mesmas de packages/shared/src/senha.js.
    /// A tela avisa enquanto a pessoa digita; esta classe é quem recusa de verdade,
    /// porque regra que só existe no navegador é contornável chamando a API direto.
    /// </summary>
    public interface IPoliticaDeSenha
    {
        /// <summary>Lista do que falta; vazia quando a senha é aceita.</summary>
        IReadOnlyList<string> Validar(string? senha, string? nickname = null, string? email = null);
    }

    public class PoliticaDeSenha : IPoliticaDeSenha
    {
        public const int TamanhoMinimo = 8;
        public const int TamanhoMaximo = 72; // limite do BCrypt: bytes além de 72 são ignorados
        private const int PedacoMinimo = 4;

        public IReadOnlyList<string> Validar(string? senha, string? nickname = null, string? email = null)
        {
            var texto = senha ?? string.Empty;
            var faltando = new List<string>();

            if (texto.Length < TamanhoMinimo) faltando.Add($"pelo menos {TamanhoMinimo} caracteres");
            if (System.Text.Encoding.UTF8.GetByteCount(texto) > TamanhoMaximo) faltando.Add($"no máximo {TamanhoMaximo} bytes");
            if (!texto.Any(char.IsUpper)) faltando.Add("uma letra maiúscula");
            if (!texto.Any(char.IsLower)) faltando.Add("uma letra minúscula");
            if (!texto.Any(char.IsDigit)) faltando.Add("um número");
            if (!texto.Any(c => !char.IsLetterOrDigit(c))) faltando.Add("um símbolo");
            if (UsaDadosPessoais(texto, nickname, email)) faltando.Add("não conter seu nickname nem seu e-mail");

            return faltando;
        }

        private static bool UsaDadosPessoais(string senha, string? nickname, string? email)
        {
            if (senha.Length == 0) return false;
            var alvo = senha.ToLower(CultureInfo.InvariantCulture);
            var local = (email ?? string.Empty).Split('@')[0];

            return new[] { local, nickname ?? string.Empty }
                .Select(p => p.Trim().ToLower(CultureInfo.InvariantCulture))
                .Where(p => p.Length >= PedacoMinimo)
                .Any(p => alvo.Contains(p, StringComparison.Ordinal));
        }

        /// <summary>Frase única para a resposta 400 do cadastro.</summary>
        public static string Mensagem(IReadOnlyList<string> faltando) =>
            faltando.Count == 0 ? string.Empty : $"A senha ainda precisa de: {string.Join(", ", faltando)}.";
    }
}
