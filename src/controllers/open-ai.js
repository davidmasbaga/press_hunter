const CleanArticle = require('../models/clean-article.js');
const response = require('express').response;
const { openAiChatJSON } = require('../services/chatgpt.service.js');
const { getDataToEvaluateNotHttp } = require('./rawArticles.es');
const rawArticle = require('../models/raw-article.js');

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
        const user_prompt = `Selecciona los mejores artículos del siguiente objeto: ${JSON.stringify(articlesToEvaluate)}. 
        Necesito que hagas varias cosas. Descarta los artículos de opinión. También descarta todos aquellos que sean de comunidades o, demasiado enfocados en una comunidad en concreto. El resto de artículos necesito que tengas en cuenta que hay noticias muy similares dado que están extraidos de diferentes periódicos, por lo que muchos puede ser que sean casi el mismo. Devuelme sólo el que te parezca más relevante por título. En cuanto al reparto necesito que sean porcentualemente aproximadamente entre un 10%-20% de artículos de internacional y política y el resto que de otros temas. Me devolverás la id original del artículo y el título además de la mainCategory pero las clasificarás según estas categorías: ${categories.join(', ')}. El formato de la respuesta tiene que ser un json ESTRICTAMENTE ASÍ: articles:[ {id: 'id del artículo', title: 'título del artículo', mainCategory: 'categoría principal del artículo'}]. Necesito entre 10 a 20 artículos`;

        const bestArticles = await openAiChatJSON(user_prompt);

        const processedArticles = await Promise.all(bestArticles.articles.map(async article => {
            try {
                return await aiContent(article);
            } catch (error) {
                console.error("Error processing article:", error);
                return null; // Skip articles that fail to process
            }
        }));

        res.status(201).json({ message: 'Best articles selected', articles: processedArticles.filter(article => article !== null) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error selecting best articles', error: err.message });
    }
}

async function aiContent(article) {
    try {
        const articleRaw = await rawArticle.findById(article.id);
        if (!articleRaw) {
            throw new Error(`Article with id ${article.id} not found`);
        }

        const articleContent = articleRaw.content;

        const prompt = `Comprende de qué habla el artículo y redáctalo de nuevo con tus propias palabras. 
        No copies y pegues. ${articleContent}. 
        Usaré markdown por lo que los h1, h2, h3 deberán estar en ese formato, al igual que las listas u otros elementos del texto. 
        Quiero que me devuelvas un JSON con el contenido del artículo redactado por ti. 
        El formato 
        tiene que ser ESTRICTAMENTE así: 
        {content: 'contenido del artículo redactado por ti en markdown', 
        idOrigin: '${articleRaw.id}',
         media: '${articleRaw.media}', 
         title: 'Lo eliges tú en función del contenido del artículo y el título ${articleRaw.title}',
          mainCategory: '${article.mainCategory}', 
          entities: '${articleRaw.entities}', 
          date: '${articleRaw.date}', 
        path: 'una url que sea amigable separada por y-sin-caracteres-especiales'}`;

        const newContent = await openAiChatJSON(prompt);

        console.log(newContent);

        // Save the new content as a CleanArticle
        const newArticle = new CleanArticle(newContent);
        await newArticle.save();

        return newArticle;
    } catch (error) {
        console.error("Error in aiContent:", error);
        throw error;
    }
}

module.exports = { saveCleanArticle, selectBestArticles, aiContent };
