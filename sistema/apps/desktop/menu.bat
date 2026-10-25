@echo off
chcp 65001 >nul
cd /d "%~dp0"
rem Menu com todos os atalhos do Nex_TI Desktop.
title Nex_TI Desktop - menu
:menu
cls
echo ==============================================
echo   Nex_TI Desktop - atividade de P.A. em .NET
echo ==============================================
echo.
echo   1. Abrir o programa
echo   2. Rodar os testes
echo   3. Abrir os slides (PDF)
echo   4. Abrir os diagramas (Astah)
echo   5. Começar do zero (apaga o banco local)
echo   6. Sair
echo.
choice /c 123456 /n /m "Escolha uma opção (1 a 6): "
if errorlevel 6 exit /b 0
if errorlevel 5 (call comecar-do-zero.bat & goto menu)
if errorlevel 4 (call abrir-diagramas.bat & goto menu)
if errorlevel 3 (call abrir-slides.bat & goto menu)
if errorlevel 2 (call rodar-testes.bat & goto menu)
if errorlevel 1 (call abrir-programa.bat & goto menu)
