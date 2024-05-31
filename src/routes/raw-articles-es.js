const Router = require('express')
const {getAllArticles, getArticleById, updateArticle, softDeleteArticle, hardDeleteArticle, hardDeleteAll, getDataToEvaluate} = require('../controllers/rawArticles.es')

const router = Router();

router.get('/', getAllArticles);
router.get('/evaluate-articles', getDataToEvaluate)
router.get('/:id',getArticleById);

router.put('/:id',updateArticle);
router.delete('/soft/:id',softDeleteArticle);
router.delete('/hard/:id',hardDeleteArticle);
router.delete('/hard-delete-all', hardDeleteAll)


module.exports = router;