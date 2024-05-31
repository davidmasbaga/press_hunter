const Router = require('express')
const {getAllArticles, getArticleById, updateArticle, softDeleteArticle, hardDeleteArticle, hardDeleteAll} = require('../controllers/rawArticles.es')

const router = Router();

router.get('/', getAllArticles);
router.get('/:id',getArticleById);
router.put('/:id',updateArticle);
router.delete('/soft/:id',softDeleteArticle);
router.delete('/hard/:id',hardDeleteArticle);
router.delete('/hard-delete-all', hardDeleteAll)


module.exports = router;