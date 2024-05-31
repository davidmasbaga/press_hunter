const { response } = require('express');
const { fetchRSS } = require('../news/news-parser.js');
const mediaES = require('../data/mediaES');

const scrapeEs = async (req, res = response) => {
    try {
        const articles = await fetchRSS(mediaES, 15);
        console.log(articles);
        res.status(200).json({
            ok: true,
            msg: 'Scraping news from Spanish media',
            count: articles.length,
            data: articles,
        });
    } catch (error) {
        console.error('Error en scrapeEs:', error);
        res.status(500).json({
            ok: false,
            msg: 'Failed to scrape news',
        });
    }
};

const scrapeTitles = async (req, res = response) => {
    try {
        const articles = await fetchRSS(mediaES, 20);
        const titlesWithIds = articles.map(article => ({
            id: article.id,
            title: article.title,
            media: article.media,
        }));


        res.status(200).json({
            ok: true,
            msg: 'Scraping news from Spanish media',
            count: titlesWithIds.length,
            data: titlesWithIds
        });
    } catch (error) {
        console.error('Error en scrapeTitles:', error);
        res.status(500).json({
            ok: false,
            msg: 'Failed to scrape news',
        });
    }
};

module.exports = { scrapeEs, scrapeTitles };
