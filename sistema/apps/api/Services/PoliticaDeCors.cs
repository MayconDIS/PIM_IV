using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace NexTI_API.Services
{
    /// <summary>
    /// Decide quais origens podem chamar a API pelo navegador.
    ///
    /// - localhost / 127.0.0.1: sempre (desenvolvimento);
    /// - <c>Cors:Origens</c>: domínios exatos de produção, separados por vírgula;
    /// - <c>Cors:PreviewsVercel</c>: padrões de host com <c>*</c> para os previews
    ///   do PRÓPRIO projeto (ex.: <c>nexti-pim-*-dev-maycon.vercel.app</c>).
    ///
    /// Antes aceitava qualquer <c>*.vercel.app</c> — ou seja, o site de qualquer
    /// pessoa hospedado na Vercel. O <c>*</c> aqui casa só letras, números e hífen,
    /// então não atravessa pontos nem vira um curinga de domínio.
    /// </summary>
    public class PoliticaDeCors
    {
        private readonly HashSet<string> _origens;
        private readonly List<Regex> _previews;

        public PoliticaDeCors(string? origens, string? padroesDePreview)
        {
            _origens = Separar(origens)
                .Select(o => o.TrimEnd('/'))
                .ToHashSet(StringComparer.OrdinalIgnoreCase);

            _previews = Separar(padroesDePreview)
                .Select(p => new Regex(
                    "^" + string.Join("[a-z0-9-]+", p.Split('*').Select(Regex.Escape)) + "$",
                    RegexOptions.IgnoreCase | RegexOptions.CultureInvariant))
                .ToList();
        }

        public bool Permite(string? origem)
        {
            if (string.IsNullOrEmpty(origem) || !Uri.TryCreate(origem, UriKind.Absolute, out var uri)) return false;
            if (uri.Host is "localhost" or "127.0.0.1") return true;
            if (_origens.Contains(origem.TrimEnd('/'))) return true;
            return uri.Scheme == Uri.UriSchemeHttps
                && uri.IsDefaultPort
                && _previews.Any(p => p.IsMatch(uri.Host));
        }

        private static IEnumerable<string> Separar(string? lista) =>
            (lista ?? string.Empty).Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    }
}
