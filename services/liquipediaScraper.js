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

            // Encontrar a tabela de partidas recentes
            const matches = [];
            $('table.wikitable tbody tr').each((i, element) => {
                // Verificar se é uma linha de partida (ignorar cabeçalhos e outras linhas)
                if ($(element).find('.match-table-score').length > 0) {
                    const match = {
                        team1: $(element).find('td:nth-child(7) .name a').text().trim(),
                        team2: $(element).find('td:nth-child(9) .name a').text().trim(),
                        score: $(element).find('.match-table-score').text().trim(),
                        event: $(element).find('td:nth-child(6) a').text().trim(),
                        matchLink: $(element).find('.plainlinks.vodlink a').first().attr('href') || ''
                    };
                    matches.push(match);
                }
            });

            return {
                matches
            };
        } catch (error) {
            console.error('Erro ao fazer scraping da Liquipedia:', error);
            throw new Error('Não foi possível obter os dados da FURIA na Liquipedia');
        }
    }
};

module.exports = liquipediaScraper; 