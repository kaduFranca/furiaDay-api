const axios = require('axios');
const cheerio = require('cheerio');

const LIQUIPEDIA_URL = 'https://liquipedia.net/counterstrike/FURIA';

const liquipediaScraper = {
    async getTeamData() {
        try {
            const { data } = await axios.get(LIQUIPEDIA_URL, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
                }
            });
            const $ = cheerio.load(data);

            // Exemplo: pegar o título da página
            const titulo = $('h1.firstHeading').text();
            
            return {
                titulo,
                // Aqui você pode adicionar mais dados que deseja extrair
            };
        } catch (error) {
            console.error('Erro ao fazer scraping da Liquipedia:', error);
            throw new Error('Não foi possível obter os dados da FURIA na Liquipedia');
        }
    }
};

module.exports = liquipediaScraper; 