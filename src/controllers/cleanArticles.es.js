const CleanArticle = require('../models/raw-article.js');

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

module.exports = { saveCleanArticle };
