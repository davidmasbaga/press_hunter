const response = require('express').response;
const {openAiChatJSON} = require('../services/chatgpt.service.js')
const { getDataToEvaluateNotHttp } = require('./rawArticles.es.js');
const rawArticle = require('../models/raw-article.js');

const categories = [
    'Política',
    'Internacional',
    'Deportes',
    'Economía',
    'Sociedad',
    'Cultura',
    'Tecnología',
    'Medios',
    'Opinión',
    'Entretenimiento',
    'Comunidades',
    'Estilo de Vida',
    'Salud',
    'Educación',
    'Ciencia',
    'Clima y Medio Ambiente'
]


async function selectBestArticles(req, res = response) {
    try {

        const articlesToEvaluate = await getDataToEvaluateNotHttp();

        const user_prompt= `Selecciona los mejores artículos del siguiente objeto: ${articlesToEvaluate}. Necesito que hagas varias cosas. Descarta los artículos de opinión. También descarta todos aquellos que sean de comunidades o, demasiado enfocados en una comunidad en concreto. El resto de artículos
        necesito que tengas en cuenta que hay noticias muy similares dado que están extraidos de diferentes periódicos, por lo que muchos puede ser que sean casi el mismo. Devuelme sólo el que te parezca más relevante por título. En cuanto al reparto necesito que 
        sean porcentualemente aproximadamente entre un 10%-20% de artículos de internacional y política y el resto que de otros temas. Me devolverás la id original del artículo y el título además de la mainCategory pero las clasificarás según estas categorías: ${categories.join(', ')}.
        El formato de la respuesta tiene que ser un json ESTRICTAMENTE ASÍ: articles:[ {id: 'id del artículo', title: 'título del artículo', mainCategory: 'categoría principal del artículo'}]. Necesito entre 10 a 20 artículos`;
        
        const bestArticles = await openAiChatJSON(user_prompt);

        res.status(200).json(bestArticles);
         
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los datos' });
    }
}

module.exports = { selectBestArticles };
