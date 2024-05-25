const {response} = require('express');
const {fetchRSS} = require('../news/news-parser.js');
const mediaES = require('../data/mediaES')

const scrapeEs = async (req,res = response) => {
    

    try {
        const articles = await fetchRSS(mediaES, 5);
        // console.log(articles)
        res.status(200).json({
            ok: true,
            msg: 'Scraping news from Spanish media',
            // data: articles
   }) 
    } catch (error) {
        console.error('Error en scrapeEs:', error);
        res.status(500).json({
            ok: false,
            msg: 'Failed to scrape news'
        });
    }

    

}


module.exports= {scrapeEs,}