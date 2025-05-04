const axios = require('axios');
const cheerio = require('cheerio');

const LIQUIPEDIA_URL = 'https://liquipedia.net/counterstrike/FURIA/Matches';

const liquipediaScraper = {
    async getTeamData() {
        try {
            const { data } = await axios.get(LIQUIPEDIA_URL, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            const $ = cheerio.load(data);
            const matches = [];

            // Seleciona todas as linhas da tabela
            $('table.wikitable tr').each((_, row) => {
                const cols = $(row).find('td');
                
                // Verifica se a linha tem colunas suficientes
                if (cols.length >= 7) {
                    const dateText = $(cols[0]).text().trim();
                    const timestamp = convertLiquipediaDate(dateText);
                    const event = $(cols[5]).text().trim();
                    const team1 = $(cols[6]).text().trim();
                    const score = $(cols[7]).text().trim(); 
                    const team2 = $(cols[8]).text().trim();

                    // Adiciona o objeto à lista de partidas
                    if (timestamp && team1 && team2) {
                        matches.push({
                            timestamp,
                            event,
                            team1,
                            score,
                            team2
                        });
                    }
                }
            });

            // Retorna apenas as 10 partidas mais recentes
            return matches.slice(0, 10);
        } catch (error) {
            console.error('Erro ao fazer scraping da Liquipedia:', error);
            throw new Error('Não foi possível obter os dados da FURIA na Liquipedia');
        }
    }
};

// Função para converter a data do formato Liquipedia para ISO
const convertLiquipediaDate = (dateStr) => {
    try {
        // Remove o fuso horário BRT e converte para UTC
        const dateWithoutTZ = dateStr.replace(' BRT', '');
        const date = new Date(dateWithoutTZ);
        
        // Adiciona 3 horas para compensar o BRT (UTC-3)
        date.setHours(date.getHours() + 3);
        
        return date.toISOString();
    } catch (error) {
        console.error('Erro ao converter data:', dateStr, error);
        return null;
    }
};

module.exports = liquipediaScraper; 