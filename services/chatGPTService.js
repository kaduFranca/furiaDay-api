const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

class ChatGPTService {
    constructor() {
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.openai = new OpenAIApi(configuration);
    }

    async getResponse(message) {
        try {
            const completion = await this.openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Você é um assistente especializado em e-sports, especialmente sobre a FURIA. Responda de forma amigável e informativa."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 150
            });

            return completion.data.choices[0].message.content;
        } catch (error) {
            console.error('Erro ao obter resposta do ChatGPT:', error);
            return 'Desculpe, tive um problema ao processar sua pergunta. Por favor, tente novamente mais tarde.';
        }
    }
}

module.exports = new ChatGPTService(); 