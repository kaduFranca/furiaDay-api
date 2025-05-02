const messageProcessor = {
    // Mapeamento de palavras-chave para funções
    keywordMap: {
        'hoje': 'handleHoje',
        'jogo': 'handleJogo',
        'time': 'handleTime',
        'equipe': 'handleTime',
        'jogador': 'handleJogador',
        'partida': 'handlePartida'
    },

    // Funções mock para cada palavra-chave
    handleHoje: function() {
        return 'furia hoje';
    },

    handleJogo: function() {
        return 'furia jogo';
    },

    handleTime: function() {
        return 'furia time';
    },

    handleJogador: function() {
        return 'furia jogador';
    },

    handlePartida: function() {
        return 'furia partida';
    },

    // Função principal para processar a mensagem
    processMessage: function(message) {
        console.log('Mensagem recebida no processMessage:', message);
        
        if (!message) {
            console.log('Mensagem vazia recebida');
            return 'Por favor, envie uma mensagem válida.';
        }
        
        if (typeof message !== 'string') {
            console.log('Tipo de mensagem inválido:', typeof message);
            return 'A mensagem deve ser uma string.';
        }

        const lowerMessage = message.toLowerCase();
        console.log('Mensagem em minúsculas:', lowerMessage);
        
        // Procura por palavras-chave na mensagem
        for (const [keyword, handler] of Object.entries(this.keywordMap)) {
            console.log('Verificando palavra-chave:', keyword);
            if (lowerMessage.includes(keyword)) {
                console.log('Palavra-chave encontrada:', keyword);
                const response = this[handler]();
                console.log('Resposta gerada:', response);
                return response;
            }
        }

        // Resposta padrão caso nenhuma palavra-chave seja encontrada
        console.log('Nenhuma palavra-chave encontrada');
        return 'Desculpe, não entendi sua mensagem. Você pode perguntar sobre a FURIA, jogos, time, jogadores ou partidas.';
    }
};

module.exports = messageProcessor; 