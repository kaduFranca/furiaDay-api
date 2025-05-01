const messageProcessor = {
    // Mapeamento de palavras-chave para funções
    keywordMap: {
        'furia': 'handleFuria',
        'jogo': 'handleJogo',
        'time': 'handleTime',
        'jogador': 'handleJogador',
        'partida': 'handlePartida'
    },

    // Funções mock para cada palavra-chave
    handleFuria: function() {
        return 'FURIA é o melhor time de CS:GO do Brasil!';
    },

    handleJogo: function() {
        return 'O próximo jogo da FURIA será em breve!';
    },

    handleTime: function() {
        return 'A FURIA é um time incrível!';
    },

    handleJogador: function() {
        return 'Os jogadores da FURIA são muito talentosos!';
    },

    handlePartida: function() {
        return 'A próxima partida da FURIA será emocionante!';
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