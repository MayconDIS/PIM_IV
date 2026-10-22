using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NexTI_API.Data;
using NexTI_API.Models;

namespace NexTI_API.Services
{
    /// <summary>Chave HMAC do JWT, registrada no contêiner pelo Program.cs.</summary>
    public record ChaveJwt(byte[] Bytes);

    /// <summary>Sessão aberta no login: o token e o usuário autenticado.</summary>
    public record Sessao(string Token, Usuario Usuario);

    public interface IAuthService
    {
        Task<Resultado<Usuario>> CadastrarAsync(string? username, string? email, string? senha);
        Task<Resultado<Sessao>> EntrarAsync(string? usernameOuEmail, string? senha);
    }

    public class AuthService : IAuthService
    {
        public const string Emissor = "NexTI_API";
        public const string Publico = "NexTI_Frontend";

        private static readonly Regex NicknameValido = new(@"^[\p{L}\p{N}_.\-]{3,30}$", RegexOptions.Compiled);
        private static readonly Regex EmailValido = new(@"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$", RegexOptions.Compiled);

        private readonly AppDbContext _db;
        private readonly IPoliticaDeSenha _politica;
        private readonly ChaveJwt _chave;

        public AuthService(AppDbContext db, IPoliticaDeSenha politica, ChaveJwt chave)
        {
            _db = db;
            _politica = politica;
            _chave = chave;
        }

        public async Task<Resultado<Usuario>> CadastrarAsync(string? username, string? email, string? senha)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(senha))
                return Resultado<Usuario>.Erro(TipoFalha.Invalido, "Username e senha são obrigatórios.");

            username = username.Trim();
            email = (email ?? string.Empty).Trim();

            if (!NicknameValido.IsMatch(username))
                return Resultado<Usuario>.Erro(TipoFalha.Invalido, "O nickname deve ter de 3 a 30 caracteres: letras, números, ponto, hífen ou sublinhado.");
            if (!EmailValido.IsMatch(email) || email.Length > 100)
                return Resultado<Usuario>.Erro(TipoFalha.Invalido, "Informe um e-mail válido.");

            var faltando = _politica.Validar(senha, username, email);
            if (faltando.Count > 0)
                return Resultado<Usuario>.Erro(TipoFalha.Invalido, PoliticaDeSenha.Mensagem(faltando));

            // Compara com os valores já normalizados — os mesmos que serão gravados.
            if (await _db.Usuarios.AnyAsync(u => u.Username == username))
                return Resultado<Usuario>.Erro(TipoFalha.Invalido, "Este nickname já está em uso.");
            if (await _db.Usuarios.AnyAsync(u => u.Email == email))
                return Resultado<Usuario>.Erro(TipoFalha.Invalido, "Este e-mail já está cadastrado.");

            var usuario = new Usuario
            {
                Username = username,
                Email = email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(senha)
            };

            _db.Usuarios.Add(usuario);
            await _db.SaveChangesAsync();
            return Resultado<Usuario>.Ok(usuario);
        }

        public async Task<Resultado<Sessao>> EntrarAsync(string? usernameOuEmail, string? senha)
        {
            if (string.IsNullOrWhiteSpace(usernameOuEmail) || string.IsNullOrWhiteSpace(senha))
                return Resultado<Sessao>.Erro(TipoFalha.Invalido, "Credenciais não informadas.");

            var busca = usernameOuEmail.Trim();
            var usuario = await _db.Usuarios.FirstOrDefaultAsync(u => u.Username == busca || u.Email == busca);
            if (usuario == null || !BCrypt.Net.BCrypt.Verify(senha, usuario.SenhaHash))
                return Resultado<Sessao>.Erro(TipoFalha.NaoAutorizado);

            return Resultado<Sessao>.Ok(new Sessao(GerarToken(usuario), usuario));
        }

        private string GerarToken(Usuario usuario)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {
                    new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                    new Claim(ClaimTypes.Name, usuario.Username),
                    new Claim(ClaimTypes.Role, usuario.Perfil)
                }),
                Issuer = Emissor,
                Audience = Publico,
                Expires = DateTime.UtcNow.AddHours(24),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(_chave.Bytes), SecurityAlgorithms.HmacSha256Signature)
            };
            return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
        }
    }
}
