<#
.SYNOPSIS
  Cria os recursos do Nex_TI na Azure usando só camadas gratuitas:
  Azure SQL Database (oferta gratuita, pausa ao atingir o limite) + App Service F1 (Linux, .NET 10)
  + Application Insights com teste de disponibilidade (monitoramento).

.EXAMPLE
  az login
  ./provisionar.ps1 -Sufixo maycon -SenhaSql 'Uma$enhaForte123' -OrigemFront 'https://nexti.vercel.app'

.NOTES
  Requer Azure CLI (https://aka.ms/installazurecli). Os nomes do servidor SQL e do
  App Service são globais na Azure, por isso o sufixo.
#>
param(
    [Parameter(Mandatory)] [string] $Sufixo,
    [Parameter(Mandatory)] [string] $SenhaSql,
    [string] $OrigemFront = '',
    # Previews do PRÓPRIO projeto na Vercel; '*' casa só letras, números e hífen.
    [string] $PreviewsVercel = 'nexti-pim-*-dev-maycon.vercel.app',
    [string] $Regiao = 'spaincentral',
    [string] $Grupo = 'rg-nexti-pim-iv'
)

$ErrorActionPreference = 'Stop'

# $ErrorActionPreference não vale para executáveis externos: checa o código de saída do az.
function Invoke-Az {
    az @args
    if ($LASTEXITCODE -ne 0) { throw "Falhou: az $($args -join ' ')" }
}
$servidorSql = "nexti-sql-$Sufixo"
$banco       = 'nexti'
$usuarioSql  = 'nexti_admin'
$plano       = "plan-nexti-$Sufixo"
$app         = "nexti-api-$Sufixo"

Write-Host "==> Grupo de recursos $Grupo ($Regiao)"
Invoke-Az group create --name $Grupo --location $Regiao --output none

Write-Host "==> Azure SQL: servidor $servidorSql"
Invoke-Az sql server create --name $servidorSql --resource-group $Grupo --location $Regiao `
    --admin-user $usuarioSql --admin-password $SenhaSql --output none

# 0.0.0.0 = "permitir serviços da Azure" (o App Service conecta por aqui)
Invoke-Az sql server firewall-rule create --resource-group $Grupo --server $servidorSql `
    --name PermitirServicosAzure --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0 --output none

Write-Host "==> Azure SQL: banco $banco (oferta gratuita, pausa ao atingir o limite mensal)"
Invoke-Az sql db create --resource-group $Grupo --server $servidorSql --name $banco `
    --edition GeneralPurpose --compute-model Serverless --family Gen5 --capacity 2 `
    --use-free-limit --free-limit-exhaustion-behavior AutoPause --output none

Write-Host "==> App Service: plano F1 (gratuito) e app $app"
Invoke-Az appservice plan create --name $plano --resource-group $Grupo --location $Regiao --sku F1 --is-linux --output none
Invoke-Az webapp create --name $app --resource-group $Grupo --plan $plano --runtime 'DOTNETCORE:10.0' --output none

$conexao = "Server=tcp:$servidorSql.database.windows.net,1433;Initial Catalog=$banco;User ID=$usuarioSql;Password=$SenhaSql;Encrypt=True;TrustServerCertificate=False;Connection Timeout=60;"
Invoke-Az webapp config connection-string set --name $app --resource-group $Grupo `
    --connection-string-type SQLAzure --settings "DefaultConnection=$conexao" --output none

$chaveJwt = [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
Invoke-Az webapp config appsettings set --name $app --resource-group $Grupo --output none --settings `
    "Jwt__Key=$chaveJwt" `
    "Cors__Origens=$OrigemFront" `
    "Cors__PreviewsVercel=$PreviewsVercel"

# Só HTTPS: requisição em HTTP é redirecionada pelo próprio App Service.
Invoke-Az webapp update --name $app --resource-group $Grupo --https-only true --output none

# Necessário para o deploy por publish profile do GitHub Actions.
Invoke-Az resource update --resource-group $Grupo --name scm --namespace Microsoft.Web `
    --resource-type basicPublishingCredentialsPolicies --parent "sites/$app" --set properties.allow=true --output none

# Monitoramento: Application Insights (sobre um Log Analytics com limite de 0,1 GB/dia)
# e um teste de disponibilidade em /api/status a cada 15 min (a rota não acorda o banco).
Write-Host "==> Monitoramento: Application Insights e teste de disponibilidade"
Invoke-Az provider register --namespace Microsoft.Insights --wait --output none
$workspace = Invoke-Az monitor log-analytics workspace create --resource-group $Grupo --name "log-nexti-$Sufixo" `
    --location $Regiao --quota 0.1 --retention-time 30 --query id --output tsv
$arquivoTemp = New-TemporaryFile
@{ location = $Regiao; kind = 'web'; properties = @{
    Application_Type = 'web'; WorkspaceResourceId = $workspace; IngestionMode = 'LogAnalytics'; RetentionInDays = 30 } } |
    ConvertTo-Json -Depth 5 | Set-Content $arquivoTemp
$insights = Invoke-Az resource create --resource-group $Grupo --name "appi-nexti-$Sufixo" --resource-type Microsoft.Insights/components `
    --is-full-object --properties "@$arquivoTemp" --query '{id: id, conexao: properties.ConnectionString}' --output json | ConvertFrom-Json
Invoke-Az webapp config appsettings set --name $app --resource-group $Grupo --output none `
    --settings "APPLICATIONINSIGHTS_CONNECTION_STRING=$($insights.conexao)"
@{ location = $Regiao; kind = 'standard'; tags = @{ "hidden-link:$($insights.id)" = 'Resource' }; properties = @{
    SyntheticMonitorId = 'api-status-nexti'; Name = 'API Nex_TI - /api/status'; Enabled = $true; Frequency = 900; Timeout = 30
    Kind = 'standard'; RetryEnabled = $true
    Locations = @(@{ Id = 'emea-nl-ams-azr' }, @{ Id = 'emea-gb-db3-azr' }, @{ Id = 'emea-fr-pra-edge' })
    Request = @{ RequestUrl = "https://$app.azurewebsites.net/api/status"; HttpVerb = 'GET'; ParseDependentRequests = $false }
    ValidationRules = @{ ExpectedHttpStatusCode = 200; SSLCheck = $true; SSLCertRemainingLifetimeCheck = 7
        ContentValidation = @{ ContentMatch = 'online'; IgnoreCase = $true; PassIfTextFound = $true } } } } |
    ConvertTo-Json -Depth 6 | Set-Content $arquivoTemp
Invoke-Az resource create --resource-group $Grupo --name 'api-status-nexti' --resource-type Microsoft.Insights/webtests `
    --is-full-object --properties "@$arquivoTemp" --output none
Remove-Item $arquivoTemp

Write-Host ""
Write-Host "Pronto. API: https://$app.azurewebsites.net/api/status"
Write-Host "Próximos passos:"
Write-Host "  1. GitHub → variável AZURE_WEBAPP_NAME = $app"
Write-Host "  2. GitHub → secret AZURE_WEBAPP_PUBLISH_PROFILE = saída de:"
Write-Host "       az webapp deployment list-publishing-profiles --name $app --resource-group $Grupo --xml"
Write-Host "  3. Vercel → VITE_API_URL = https://$app.azurewebsites.net/api"
