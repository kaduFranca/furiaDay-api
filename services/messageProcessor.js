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
    handleFuria: () => {
        return 'FURIA é o melhor time de CS:GO do Brasil!';
    },

    handleJogo: () => {
        return 'O próximo jogo da FURIA será em breve!';
    },

    handleTime: () => {
        return 'A FURIA é um time incrível!';
    },

    handleJogador: () => {
        return 'Os jogadores da FURIA são muito talentosos!';
    },

    handlePartida: () => {
        return 'A próxima partida da FURIA será emocionante!';
    },

    // Função principal para processar a mensagem
    processMessage: (message) => {
        const lowerMessage = message.toLowerCase();
        
        // Procura por palavras-chave na mensagem
        for (const [keyword, handler] of Object.entries(this.keywordMap)) {
            if (lowerMessage.includes(keyword)) {
                return this[handler]();
            }
        }

        // Resposta padrão caso nenhuma palavra-chave seja encontrada
        return 'sem resposta encontrada';
    }
};

module.exports = messageProcessor; 