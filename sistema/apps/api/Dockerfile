# Imagem da API do Nex_TI (.NET 10). O contexto do build é a pasta sistema/:
#   docker build -f apps/api/Dockerfile -t nexti-api .
# Ou suba tudo junto (banco + API + site) com: docker compose up --build

# 1) Compila e publica com o SDK
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Restaura primeiro só com o .csproj: enquanto as dependências não mudam, essa camada fica em cache
COPY apps/api/NexTI_API.csproj apps/api/
RUN dotnet restore apps/api/NexTI_API.csproj

COPY apps/api/ apps/api/
RUN dotnet publish apps/api/NexTI_API.csproj -c Release -o /app --no-restore

# 2) Roda só com o runtime do ASP.NET (imagem bem menor, sem o SDK)
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .

# A imagem já traz o usuário "app", sem privilégios de administrador
USER app
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "NexTI_API.dll"]
