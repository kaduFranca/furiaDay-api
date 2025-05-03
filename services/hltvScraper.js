const axios = require('axios');
const cheerio = require('cheerio');

const HLTV_URL = 'https://www.hltv.org/team/8297/furia';

const hltvScraper = {
    async getTeamData() {
        try {
            const response = await axios.get(HLTV_URL);
            const $ = cheerio.load(response.data);

            // Extrair próximos jogos
            const upcomingMatches = [];
            $('.upcoming-matches .upcoming-match').each((i, element) => {
                const match = {
                    opponent: $(element).find('.team').text().trim(),
                    event: $(element).find('.event').text().trim(),
                    date: $(element).find('.date').text().trim(),
                    time: $(element).find('.time').text().trim()
                };
                upcomingMatches.push(match);
            });

            // Extrair resultados recentes
            const recentResults = [];
            $('.results .result').each((i, element) => {
                const result = {
                    opponent: $(element).find('.team').text().trim(),
                    score: $(element).find('.score').text().trim(),
                    event: $(element).find('.event').text().trim(),
                    date: $(element).find('.date').text().trim()
                };
                recentResults.push(result);
            });

            // Extrair estatísticas da equipe
            const teamStats = {
                ranking: $('.teamRanking').text().trim(),
                winRate: $('.winRate').text().trim(),
                mapsPlayed: $('.mapsPlayed').text().trim()
            };

            return {
                upcomingMatches,
                recentResults,
                teamStats
            };
        } catch (error) {
            console.error('Erro ao fazer scraping da página da FURIA:', error);
            throw new Error('Não foi possível obter os dados da FURIA');
        }
    },

    async getUpcomingMatches() {
        const data = await this.getTeamData();
        return data.upcomingMatches;
    },

    async getRecentResults() {
        const data = await this.getTeamData();
        return data.recentResults;
    },

    async getTeamStats() {
        const data = await this.getTeamData();
        return data.teamStats;
    }
};

module.exports = hltvScraper; 