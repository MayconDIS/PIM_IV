@echo off
chcp 65001 >nul
cd /d "%~dp0"
rem Apaga o banco local do programa, para mostrar como se fosse a primeira vez.
title Nex_TI Desktop - começar do zero
echo Isto apaga os alunos e o progresso guardados neste computador pelo Nex_TI Desktop.
echo As fases e as cartas voltam sozinhas na próxima vez que o programa abrir.
echo.
choice /c SN /m "Apagar agora"
if errorlevel 2 exit /b 0
if exist "%LOCALAPPDATA%\NexTI.Desktop" rmdir /s /q "%LOCALAPPDATA%\NexTI.Desktop"
echo Pronto: o banco local foi apagado.
pause
