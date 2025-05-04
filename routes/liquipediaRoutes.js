const express = require('express');
const router = express.Router();
const liquipediaScraper = require('../services/liquipediaScraper');

// Rota para testar o scraping da Liquipedia
router.get('/test', async (req, res) => {
    try {
        const data = await liquipediaScraper.getTeamData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 