const CleanArticle = require('../models/clean-article.js');
const response = require('express').response;
const { openAiChatJSON, aiContent } = require('../services/chatgpt.service.js');
const {getDataToEvaluateNotHttp} = require('../services/raw-articles.service.js')
const { getRawArticleById } = require('../services/raw-articles.service.js');


const categories = [
    'Política', 'Internacional', 'Deportes', 'Economía', 'Sociedad', 'Cultura', 
    'Tecnología', 'Medios', 'Opinión', 'Entretenimiento', 'Comunidades', 
    'Estilo de Vida', 'Salud', 'Educación', 'Ciencia', 'Clima y Medio Ambiente'
];

const saveCleanArticle = async (req, res) => {
    try {
        const { content, idOrigin, media, title, mainCategory, entities, date, path } = req.body;
        const newArticle = new CleanArticle({ content, idOrigin, media, title, mainCategory, entities, date, path });

        // Guarda el nuevo artículo en la base de datos
        await newArticle.save();

        res.status(201).json({ message: 'Article created', article: newArticle });
    } catch (error) {
        res.status(500).json({ message: 'Error creating article', error: error.message });
    }
};

async function selectBestArticles(req, res = response) {
    try {
        const articlesToEvaluate = await getDataToEvaluateNotHttp();

        if( articlesToEvaluate.length > 0 ) {
        
            const user_prompt = `Selecciona los mejores artículos del siguiente objeto: ${JSON.stringify(articlesToEvaluate)}. 
            Necesito que hagas varias cosas. Descarta los artículos de opinión. También descarta todos aquellos que sean de comunidades o, demasiado enfocados en una comunidad en concreto. El resto de artículos necesito que tengas en cuenta que hay noticias muy similares dado que están extraidos de diferentes periódicos, por lo que muchos puede ser que sean casi el mismo. Devuelme sólo el que te parezca más relevante por título. En cuanto al reparto necesito que sean porcentualemente aproximadamente entre un 10%-20% de artículos de internacional y política y el resto que de otros temas. Me devolverás la id original del artículo y el título además de la mainCategory pero las clasificarás según estas categorías: ${categories.join(', ')}. El formato de la respuesta tiene que ser un json ESTRICTAMENTE ASÍ: articles:[ {id: 'id del artículo', title: 'título del artículo', mainCategory: 'categoría principal del artículo'}]. Necesito entre 10 a 20 artículos`;
        
            const bestArticles = await openAiChatJSON(user_prompt);
            console.log('Best articles:', bestArticles)
        
            const processedArticles = await Promise.all(bestArticles.articles.map(async article => {
                try {
                    return await aiContent(article);
                } catch (error) {
                    console.error("Error processing article:", error);
                    return null; // Skip articles that fail to process
                }
            }));
        
            res.status(201).json({ message: 'Best articles selected', count:processedArticles.length ,articles: processedArticles.filter(article => article !== null) });
        }

            res.status(404).json({ message: 'No articles Found' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error selecting best articles', error: err.message });
        }
            
        }


 const singleArticle = async (req, res = response) => {
    const id = req.params.id
    const article = await getRawArticleById(id)

    try {
        const newArticle = await aiContent(article);

        res.status(201).json({ message: 'Article created', newArticle });
    } catch (error) {
        res.status(500).json({ message: 'Error creating article', error: error.message });
    }
 }       
       

module.exports = { saveCleanArticle, selectBestArticles, singleArticle  };
