const { response } = require('express');
const { fetchRSS } = require('../services/news-parser.service.js');
const mediaES = require('../data/mediaES');
const RawArticles = require('../models/raw-article');

const scrapeEs = async (req, res = response) => {
    const{num} = req.query
    console.log(num)

    try {
        const articles = await fetchRSS(mediaES,num);
        

        for (const article of articles) {


            const existingArticle = await RawArticles.findOne({ title: article.title });
            if (existingArticle) {
                console.log(`Article with title "${article.title}" already exists. Skipping...`);
                continue; 
            }

            const articleDate = new Date(article.date);
            
            const processedContent = Buffer.from(article.content, 'utf-8').toString();
            const newArticle = new RawArticles({
                media: article.media,
                date: articleDate,
                title: article.title,
                link: article.link,
                mainCategory: article.mainCategory,
                entities: article.entities,
                content: processedContent,
                deleted: false,
            });
            await newArticle.save();
        }



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
            url: article.link,
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
