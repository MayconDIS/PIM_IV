import sys
import os
from plantuml import PlantUML

def generate_diagram(file_path):
    server = PlantUML(url='https://www.plantuml.com/plantuml/png/')
    try:
        if not os.path.exists(file_path):
            print(f"Erro: {file_path} não encontrado.")
            return
        print(f"Processando {file_path}...")
        output_file = file_path.replace('.puml', '.png')
        server.processes_file(file_path, outfile=output_file)
        print(f"Sucesso! {output_file}")
    except Exception as e:
        print(f"Erro em {file_path}: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        generate_diagram(sys.argv[1])
    else:
        print("Uso: python compile_uml.py <arquivo.puml>")
