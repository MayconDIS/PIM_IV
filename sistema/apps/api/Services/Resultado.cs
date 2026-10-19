namespace NexTI_API.Services
{
    /// <summary>Motivo pelo qual uma operação de serviço não foi concluída.</summary>
    public enum TipoFalha
    {
        Invalido,
        NaoEncontrado,
        NaoAutorizado
    }

    /// <summary>
    /// Retorno dos serviços: ou um valor, ou uma falha com mensagem.
    /// Os serviços não conhecem HTTP; é a camada de Endpoints que traduz a falha em status code.
    /// </summary>
    public record Resultado<T>(T? Valor, TipoFalha? Falha, string? Mensagem)
    {
        public bool Sucesso => Falha is null;

        public static Resultado<T> Ok(T valor) => new(valor, null, null);
        public static Resultado<T> Erro(TipoFalha falha, string mensagem = "") => new(default, falha, mensagem);
    }
}
