const chatGPTService = require('./chatGPTService');
const hltvScraper = require('./hltvScraper');

const messageProcessor = {
    // Mapeamento de palavras-chave para funções
    keywordMap: {
        'opcoes': 'handleOpcoes',
        'calendario': 'handleCalendario',
        'proximos jogos': 'handleProximosJogos',
        'resultados': 'handleResultados',
        'estatisticas': 'handleEstatisticas'
    },

    handleOpcoes: function() {
        return {
            content: 'O que você quer saber sobre a FURIA CS?',
            options: ['📅 Calendário de Jogos']
        };
    },

    handleCalendario: function() {
        return {
            content: '📅 Calendário de Jogos',
            options: ['⚔️ Próximas partidas', '⏪ Partidas passadas', '🏆 Próximos campeonatos', '🏆 Campeonatos passados']
        };
    },

    async handleProximosJogos() {
        try {
            const matches = await hltvScraper.getUpcomingMatches();
            if (matches.length === 0) {
                return {
                    content: 'Não há próximos jogos agendados para a FURIA.',
                    options: []
                };
            }
            
            const matchesText = matches.map(match => 
                `⚔️ ${match.opponent} - ${match.event}\n📅 ${match.date} às ${match.time}`
            ).join('\n\n');

            return {
                content: `📅 Próximos jogos da FURIA:\n\n${matchesText}`,
                options: []
            };
        } catch (error) {
            return {
                content: 'Desculpe, não foi possível obter os próximos jogos da FURIA no momento.',
                options: []
            };
        }
    },

    async handleResultados() {
        try {
            const results = await hltvScraper.getRecentResults();
            if (results.length === 0) {
                return {
                    content: 'Não há resultados recentes disponíveis para a FURIA.',
                    options: []
                };
            }
            
            const resultsText = results.map(result => 
                `⚔️ ${result.opponent} - ${result.score}\n🏆 ${result.event}\n📅 ${result.date}`
            ).join('\n\n');

            return {
                content: `📊 Resultados recentes da FURIA:\n\n${resultsText}`,
                options: []
            };
        } catch (error) {
            return {
                content: 'Desculpe, não foi possível obter os resultados recentes da FURIA no momento.',
                options: []
            };
        }
    },

    async handleEstatisticas() {
        try {
            const stats = await hltvScraper.getTeamStats();
            return {
                content: `📊 Estatísticas da FURIA:\n\n🏆 Ranking: ${stats.ranking}\n📈 Taxa de vitórias: ${stats.winRate}\n🎮 Mapas jogados: ${stats.mapsPlayed}`,
                options: []
            };
        } catch (error) {
            return {
                content: 'Desculpe, não foi possível obter as estatísticas da FURIA no momento.',
                options: []
            };
        }
    },

    // Função principal para processar a mensagem
    async processMessage(message) {
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
                const response = this[handler]();
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