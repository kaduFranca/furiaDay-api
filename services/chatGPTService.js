const OpenAI = require('openai');
require('dotenv').config();

class ChatGPTService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.maxTokens = 250;
    }

    async getResponse(message, maxTokens = this.maxTokens) {
        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `Você é um assistente especializado em e-sports, especialmente sobre a FURIA. 
                        Suas respostas devem ser:
                        1. Amigáveis e informativas
                        2. Você só responde sobre Counter-Strike nesse chat.
                        3. Incluir informações sobre jogadores, campeonatos e resultados recentes
                        4. Manter um tom motivacional e apaixonado
                        5. Ser concisas (2-3 frases)
                        6. Usar emojis relevantes
                        7. Incluir hashtags quando apropriado
                        8. Outro assuntos que não sejam sobre FURIA, você recusa amigavelmente
                        9. Caso perguntem o time de CS2 Atualmente: FalleN, yuurih, KSCERATO, YEKINDAR e molodoy
                        
                        Exemplos de respostas:
                        "A FURIA está arrasando no CS2! 🎮 Com o time principal liderado pelo FalleN, estamos vendo grandes resultados. #VamosFURIA"
                        "No Valorant, a FURIA tem um time promissor! 🎯 Com jogadores talentosos como Khalil e Quick, estamos sempre na briga pelos títulos. #FURIAValorant"
                        
                        Se não souber a resposta, seja honesto e sugira procurar no site oficial da FURIA.`
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
            return 'Desculpe, tivemos um problema com a nossa IA interna. Por favor, tente novamente mais tarde ou consulte o site oficial da FURIA em https://www.furia.gg';
        }
    }
}

module.exports = new ChatGPTService(); 