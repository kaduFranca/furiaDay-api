const chatGPTService = require('./chatGPTService');
const liquipediaScraper = require('./liquipediaScraper');
const supabase = require('../supabase/client');
const userService = require('./userService');

const messageProcessor = {

    // Mapeamento de palavras-chave para funções
    keywordMap: {
        'opcoes': 'handleOpcoes',
        'calendario': 'handleCalendario',
        'proximos jogos': 'handleProximosJogos',
        'partidas passadas': 'handlePartidasPassadas'
    },

    // Função para salvar o time selecionado no banco de dados
    async saveSelectedTeam(userId, team) {
        try {
            await userService.updateUserTeam(userId, team);
            return true;
        } catch (error) {
            console.error('Erro ao salvar time selecionado:', error);
            return false;
        }
    },

    // Função para recuperar o time selecionado do banco de dados
    async getSelectedTeam(userId) {
        try {
            const user = await userService.getUserByUsername(userId);
            return user?.selected_team || 'FURIA Ma';
        } catch (error) {
            console.error('Erro ao recuperar time selecionado:', error);
            return 'FURIA Ma';
        }
    },

    handleOpcoes: function() {
        return {
            content: `O que você quer saber sobre a FURIA?`,
            options: ['📅 Calendário de Jogos']
        };
    },

    handleCalendario: function() {
        return {
            content: '📅 Calendário de Jogos',
            options: ['⚔️ Próximos jogos', '📜 Partidas passadas', '🏆 Campeonatos', '🏅 Campeonatos passados']
        };
    },

    handleFuria: function() {
        return {
            content: 'De qual FURIA estamos falando? 🤔',
            options: ['⚫ FURIA Ma', '⚪ FURIA Fe', '🟡 FURIA Academy']
        };
    },

    handleProximosJogos: async function(userId) {
        try {
            const team = await this.getSelectedTeam(userId);
            const matches = await liquipediaScraper.getTeamData(team);
            const hoje = new Date();
            
            // Filtra apenas os jogos futuros
            const proximosJogos = matches.filter(match => {
                const dataJogo = new Date(match.timestamp);
                return dataJogo > hoje;
            });

            if (proximosJogos.length === 0) {
                return {
                    content: `Não há jogos marcados até o momento para a ${team}.`,
                    options: []
                };
            }

            // Formata a mensagem com os próximos jogos, cada informação em uma linha
            const mensagem = proximosJogos.map(jogo => {
                const data = new Date(jogo.timestamp).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
                const hora = new Date(jogo.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                return `📅 ${data}, ${hora}\n🏆 ${jogo.event}\n${jogo.team1} vs ${jogo.team2}`;
            }).join('\n\n');

            return {
                content: `Próximos jogos da ${team}:\n\n${mensagem}`,
                options: []
            };
        } catch (error) {
            console.error('Erro ao buscar próximos jogos:', error);
            return {
                content: 'Desculpe, não foi possível buscar os próximos jogos no momento.',
                options: []
            };
        }
    },

    handlePartidasPassadas: async function(userId) {
        try {
            console.log('Buscando partidas passadas para userId:', userId);
            const team = await this.getSelectedTeam(userId);
            console.log('Time selecionado:', team);
            
            const matches = await liquipediaScraper.getTeamData(team);
            console.log('Partidas encontradas:', matches);
            
            const hoje = new Date();
            console.log('Data atual:', hoje);
            
            // Filtra apenas os jogos passados
            const partidasPassadas = matches.filter(match => {
                const dataJogo = new Date(match.timestamp);
                console.log('Data do jogo:', dataJogo);
                return dataJogo < hoje;
            });

            console.log('Partidas passadas filtradas:', partidasPassadas);

            if (partidasPassadas.length === 0) {
                return {
                    content: `Não há partidas passadas registradas para a ${team}.`,
                    options: []
                };
            }

            // Formata a mensagem com as partidas passadas
            const mensagem = partidasPassadas.map(jogo => {
                const data = new Date(jogo.timestamp).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
                const hora = new Date(jogo.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                return `📅 ${data}, ${hora}\n🏆 ${jogo.event}\n${jogo.team1} ${jogo.score} ${jogo.team2}`;
            }).join('\n\n');

            return {
                content: `Partidas passadas da ${team}:\n\n${mensagem}`,
                options: []
            };
        } catch (error) {
            console.error('Erro detalhado ao buscar partidas passadas:', error);
            console.error('Stack trace:', error.stack);
            return {
                content: 'Desculpe, não foi possível buscar as partidas passadas no momento.',
                options: []
            };
        }
    },

    // Função principal para processar a mensagem
    async processMessage(message, userId) {
        console.log('Mensagem recebida no processMessage:', message);
        
        if (!message) {
            console.log('Mensagem vazia recebida');
            return {
                content: 'Por favor, envie uma mensagem válida.',
                options: []
            };
        }
        
        if (typeof message !== 'string') {
            console.log('Tipo de mensagem inválido:', typeof message);
            return {
                content: 'A mensagem deve ser uma string.',
                options: []
            };
        }

        const normalizedMessage = this.normalizeString(message);
        console.log('Mensagem normalizada:', normalizedMessage);
        
        // Procura por palavras-chave na mensagem
        for (const [keyword, handler] of Object.entries(this.keywordMap)) {
            console.log('Verificando palavra-chave:', keyword);
            if (normalizedMessage.includes(keyword)) {
                console.log('Palavra-chave encontrada:', keyword);
                const response = await this[handler](userId);
                console.log('Resposta gerada:', response);
                return response;
            }
        }

        // Se nenhuma palavra-chave for encontrada, usa o ChatGPT
        console.log('Nenhuma palavra-chave encontrada, usando ChatGPT');
        const chatGPTResponse = await chatGPTService.getResponse(message);
        return {
            content: chatGPTResponse,
            options: []
        };
    },

    // Função para normalizar strings removendo acentos e caracteres especiais
    normalizeString: function(str) {
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }
};

module.exports = messageProcessor;