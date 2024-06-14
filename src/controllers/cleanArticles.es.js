const CleanArticle = require('../models/clean-article.js');

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

const getAllArticles = async (req, res) => {
    const { sortByDate, limit } = req.query;
    

    try {

        let query = CleanArticle.find({ deleted: { $ne: true } });
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


const getArticleById = async (req, res) => {
    try {
        const article = await CleanArticle.findById(req.params.id);
        if (!article || article.deleted) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving article', error });
    }
};

const softDeleteArticle = async (req, res) => {
    try {
        const article = await CleanArticle.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
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
        const article = await CleanArticle.findByIdAndDelete(req.params.id);
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
        const articles = await CleanArticle.find()
        articles.forEach(article=>{articlesIds.push(article._id)})
        const result = await CleanArticle.deleteMany({_id:{$in:articlesIds}}) 
        res.status(200).json({ message: 'Articles hard deleted', result });

    }catch(err){
        res.status(500).json({ message: 'Error bulk deleting articles', error });
    }
}




module.exports = { 
    saveCleanArticle ,
     getAllArticles, 
     getArticleById, 
     softDeleteArticle, 
     hardDeleteArticle, 
     hardDeleteAll};
