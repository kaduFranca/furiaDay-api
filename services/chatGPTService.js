const OpenAI = require('openai');
require('dotenv').config();

class ChatGPTService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.maxTokens = 150;
    }

    async getResponse(message, maxTokens = this.maxTokens) {
        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Você é um assistente especializado em e-sports, especialmente sobre a FURIA. Responda de forma amigável e informativa, mas seja conciso. Limite sua resposta a no máximo 2-3 frases."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: maxTokens
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Erro ao obter resposta do ChatGPT:', error);
            return 'Desculpe, tivemos um problema com a nossa IA interna.';
        }
    }
}

module.exports = new ChatGPTService(); 