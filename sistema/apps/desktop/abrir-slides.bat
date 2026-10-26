@echo off
chcp 65001 >nul
cd /d "%~dp0"
rem Abre o PDF dos slides da apresentação (F11 deixa em tela cheia no navegador).
start "" "docs\apresentacao\Nex_TI - Apresentacao PA DotNet.pdf"
