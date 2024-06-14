const express = require('express');
const { 
    saveCleanArticle ,
    getAllArticles, 
    getArticleById, 
    softDeleteArticle, 
    hardDeleteArticle, 
    hardDeleteAll  } = require('../controllers/cleanArticles.es');

const router = express.Router();

router.post('/', saveCleanArticle);
router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.delete('/soft-delete/:id', softDeleteArticle);
router.delete('/hard-delete/:id', hardDeleteArticle);
router.delete('/hard-delete-all', hardDeleteAll);


module.exports = router;
