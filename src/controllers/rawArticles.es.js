const RawArticle = require('../models/raw-article.js');



const getAllArticles = async (req, res) => {
    const { sortByDate, limit } = req.query;


    try {

        let query = RawArticle.find({ deleted: false }).select('mainCategory');
        if (sortByDate === 'true') {
            query = query.sort({ date: -1 }); 
        }
        if (limit) {
            const limitNumber = parseInt(limit, 10);
            query = query.limit(limitNumber);
        }

        const articles =  await query;

        // const dateofArticles = articles.map(article => article.date);

        res.status(200).json({total:articles.length, articles});
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving articles', error });
    }
};


const getDataToEvaluate = async (req, res) => {
    try {
        const hoursAgo = (hours) => {
            return new Date(Date.now() - hours * 60 * 60 * 1000);
        }

        const data = await RawArticle.find(
            { date: { $gte: hoursAgo(8) }, createdAt: { $gte: hoursAgo(10) } }
        ).select('title date url mainCategory createdAt');
        
        res.status(200).json({ total: data.length, data });
        return data
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error al obtener los datos' });
    }
}



const getArticleById = async (req, res) => {
    try {
        const article = await RawArticle.findById(req.params.id);
        if (!article || article.deleted) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving article', error });
    }
};

const updateArticle = async (req, res) => {
    try {
        const article = await RawArticle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: 'Error updating article', error });
    }
};

const softDeleteArticle = async (req, res) => {
    try {
        const article = await RawArticle.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json({ message: 'Article soft deleted', article });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting article', error });
    }
};

const hardDeleteArticle = async (req, res) => {
    try {
        const article = await RawArticle.findByIdAndDelete(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json({ message: 'Article hard deleted', article });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting article', error });
    }
};


const hardDeleteAll = async (req,res)=>{
    const {password}= req.headers

    

    if(password !== process.env.BULK_DELETE_PASSWORD){
        return res.status(401).json({message:'Unauthorized'})
    }


    try{
        let articlesIds = []
        const articles = await RawArticle.find()
        articles.forEach(article=>{articlesIds.push(article._id)})
        const result = await RawArticle.deleteMany({_id:{$in:articlesIds}}) 
        res.status(200).json({ message: 'Articles hard deleted', result });

    }catch(err){
        res.status(500).json({ message: 'Error bulk deleting articles', error });
    }
}



const getDataToEvaluateNotHttp = async () => {
    try {
        const hoursAgo = (hours) => {
            return new Date(Date.now() - hours * 60 * 60 * 1000);
        }

        const data = await RawArticle.find(
            { date: { $gte: hoursAgo(8) }, createdAt: { $gte: hoursAgo(10) } }
        ).select('title date url mainCategory createdAt');
        
        
        return data
    } catch (err) {
        console.log(err);
        
    }
}


module.exports = {
    getAllArticles,
    getArticleById,
    getDataToEvaluate,
    getDataToEvaluateNotHttp,
    updateArticle,
    softDeleteArticle,
    hardDeleteArticle,
    hardDeleteAll
};
