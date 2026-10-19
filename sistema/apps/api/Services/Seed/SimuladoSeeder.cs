using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;
using NexTI_API.Models;

namespace NexTI_API.Services.Seed
{
    /// <summary>
    /// Povoa o módulo de simulados do diagrama UML (áreas, prova ENADE 2021,
    /// questões e alternativas). Só roda quando ainda não há nenhuma prova.
    /// </summary>
    public class SimuladoSeeder : IEtapaSeed
    {
        public string Nome => "Simulados ENADE";

        public async Task<int> ExecutarAsync(AppDbContext db)
        {
            if (await db.Provas.AnyAsync()) return 0;

            var areas = new[]
            {
                "Engenharia de Software", "Cibersegurança e LGPD", "UX/UI Design",
                "Algoritmos e Estruturas de Dados", "Redes de Computadores",
            }.Select(nome => new AreaConhecimento { NomeArea = nome }).ToArray();

            var prova = new Prova { Ano = 2021, Tipo = "ENADE" };

            Questao Q(int area, string enunciado, int correta, params string[] alternativas)
            {
                var questao = new Questao { Area = areas[area], Enunciado = enunciado, Origem = "ENADE 2021" };
                for (var i = 0; i < alternativas.Length; i++)
                    questao.Alternativas.Add(new Alternativa { Texto = alternativas[i], IsCorreta = i == correta });
                questao.Provas.Add(prova);
                return questao;
            }

            var questoes = new[]
            {
                Q(0, "Uma empresa adotou metodologias ágeis. Durante uma iteração, a equipe percebeu que um dos requisitos estava mal detalhado, gerando atraso. Qual cerimônia do Scrum é o momento IDEAL para a equipe inspecionar esse problema de processo e sugerir melhorias para o próximo ciclo?",
                    3, "A) Sprint Planning", "B) Daily Scrum", "C) Sprint Review", "D) Sprint Retrospective"),
                Q(1, "Uma clínica médica recolhe dados biométricos e histórico de doenças de seus pacientes. Segundo a Lei Geral de Proteção de Dados (LGPD), estes dados são classificados como:",
                    1, "A) Dados Públicos", "B) Dados Sensíveis", "C) Dados Anonimizados", "D) Dados Temporários"),
                Q(2, "Uma equipe está refatorando a interface de um sistema. O sistema atual possui textos com baixo contraste e depende apenas da cor vermelha para indicar erros. Qual das ações abaixo NÃO corresponde a uma boa prática de Acessibilidade (WCAG)?",
                    1, "A) Adicionar atributos 'alt' em imagens.", "B) Depender exclusivamente da cor para mensagens de erro.", "C) Garantir navegação completa via teclado (Tab).", "D) Manter alto contraste entre fundo e texto."),
                Q(3, "Considere a estrutura de dados 'Fila' (Queue) sendo usada para gerenciar requisições de impressão em um escritório. Foram inseridos, nesta ordem, os arquivos: A, B e C. Se o comando 'pop()' ou 'dequeue()' for executado duas vezes, qual arquivo restará na fila?",
                    2, "A) Arquivo A", "B) Arquivo B", "C) Arquivo C", "D) A fila ficará vazia"),
                Q(0, "O padrão de arquitetura MVC divide o sistema em três camadas. Um desenvolvedor inseriu uma regra de negócio complexa de cálculo de juros bancários diretamente no botão da tela HTML (View). Esta prática fere o padrão MVC pois as regras de negócio deveriam estar no:",
                    1, "A) Controller", "B) Model", "C) View", "D) Banco de Dados"),
                Q(4, "Para garantir a segurança de uma aplicação web, foi solicitado que todo o tráfego fosse criptografado usando SSL/TLS. Qual protocolo e qual porta padrão devem ser habilitados no firewall para essa configuração?",
                    2, "A) HTTP - Porta 80", "B) FTP - Porta 21", "C) HTTPS - Porta 443", "D) SSH - Porta 22"),
            };

            db.Questoes.AddRange(questoes);
            await db.SaveChangesAsync();
            return areas.Length + 1 + questoes.Length + questoes.Sum(q => q.Alternativas.Count);
        }
    }
}
