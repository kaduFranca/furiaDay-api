const chatGPTService = require('./chatGPTService');
const liquipediaScraper = require('./liquipediaScraper');

const messageProcessor = {

    selectedTeam: null,

    // Mapeamento de palavras-chave para funções
    keywordMap: {
        'opcoes': 'handleFuria',
        'time selecionado': 'handleOpcoes',
        'calendario': 'handleCalendario',
        'furia ma': 'handleOpcoes',
        'furia fe': 'handleOpcoes',
        'furia academy': 'handleOpcoes',
        'proximos jogos': 'handleProximosJogos',
        'partidas passadas': 'handlePartidasPassadas',
        'campeonatos': 'handleCampeonatos',
        'campeonatos passados': 'handleCampeonatosPassados'
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
            options: ['🐾 FURIA Ma', '🎯 FURIA Fe', '🎓 FURIA Academy']
        };
    },

    handleFuriaMa: function() {
        this.selectedTeam = 'FURIA Ma';
        return {
            content: 'time selecionado',

        };
    },

    handleFuriaFe: function() {
        this.selectedTeam = 'FURIA Fe';
        return {
            content: 'time selecionado',
        };
    },

    handleFuriaAcademy: function() {
        this.selectedTeam = 'FURIA Academy';
        return {
            content: 'time selecionado',
        };
    },

    handleProximosJogos: async function() {
        try {
            const matches = await liquipediaScraper.getTeamData();
            const hoje = new Date();
            
            // Filtra apenas os jogos futuros
            const proximosJogos = matches.filter(match => {
                const dataJogo = new Date(match.timestamp);
                return dataJogo > hoje;
            });

            if (proximosJogos.length === 0) {
                return {
                    content: 'Não há jogos marcados para o futuro próximo.',
                    options: []
                };
            }

            // Formata a mensagem com os próximos jogos
            const mensagem = proximosJogos.map(jogo => {
                const data = new Date(jogo.timestamp).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                return `📅 ${data} - ${jogo.event}\n${jogo.team1} vs ${jogo.team2}`;
            }).join('\n\n');

            return {
                content: `Próximos jogos:\n\n${mensagem}`,
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