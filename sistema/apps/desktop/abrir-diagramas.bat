@echo off
chcp 65001 >nul
cd /d "%~dp0"
rem Abre os diagramas no Astah. Sem o Astah instalado, abre a pasta com as imagens.
assoc .asta >nul 2>nul
if errorlevel 1 (
  start "" "docs\diagramas"
) else (
  start "" "docs\diagramas\Diagrams Nex_TI Desktop - PA DotNet.asta"
)
