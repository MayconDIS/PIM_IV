@echo off
chcp 65001 >nul
cd /d "%~dp0"
rem Roda os testes automáticos do Nex_TI Desktop e deixa a janela aberta com o resultado.
title Nex_TI Desktop - testes
where dotnet >nul 2>nul
if errorlevel 1 (
  echo O .NET 10 SDK não está instalado: https://dotnet.microsoft.com/download
  pause
  exit /b 1
)
echo Rodando os testes do Nex_TI Desktop...
echo.
dotnet test
echo.
pause
