@echo off
chcp 65001 >nul
cd /d "%~dp0"
rem Abre o Nex_TI Desktop. A primeira vez compila o programa (uns 20 segundos).
title Nex_TI Desktop
where dotnet >nul 2>nul
if errorlevel 1 goto sem_dotnet
echo Abrindo o Nex_TI Desktop... (a primeira vez demora uns 20 segundos)
dotnet run --project src\NexTI.Desktop.Apresentacao
if errorlevel 1 goto erro
exit /b 0

:sem_dotnet
echo O .NET 10 SDK não está instalado neste computador.
echo Baixe em https://dotnet.microsoft.com/download e tente de novo.
pause
exit /b 1

:erro
echo.
echo Não consegui abrir o programa. Veja a mensagem acima.
pause
exit /b 1
