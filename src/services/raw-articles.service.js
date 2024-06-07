const RawArticle = require('../models/raw-article');


const getDataToEvaluateNotHttp = async () => {
    try {
        const hoursAgo = (hours) => {
            return new Date(Date.now() - hours * 60 * 60 * 1000);
        }

        const data = await RawArticle.find(
            { date: { $gte: hoursAgo(8) }, createdAt: { $gte: hoursAgo(10) } }
        ).select('id title date url mainCategory createdAt');
        
        
        return data
    } catch (err) {
        console.log(err);
        
    }
}

const getRawArticleById = async (id) => {

const article = await RawArticle.findById(id);

return article;
}


module.exports = { getDataToEvaluateNotHttp, getRawArticleById };