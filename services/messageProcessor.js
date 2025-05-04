const chatGPTService = require('./chatGPTService');

const messageProcessor = {
    // Mapeamento de palavras-chave para funções
    keywordMap: {
        'opcoes': 'handleOpcoes',
        'calendario': 'handleCalendario'
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