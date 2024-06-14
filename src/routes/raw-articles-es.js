const Router = require('express')
const {getAllArticles, getArticleById, updateArticle, softDeleteArticle, hardDeleteArticle, hardDeleteAll, getDataToEvaluate, deleteIfAreWrote} = require('../controllers/rawArticles.es')

const router = Router();

router.get('/', getAllArticles);
router.get('/evaluate-articles', getDataToEvaluate)
router.get('/:id',getArticleById);

router.put('/:id',updateArticle);
router.delete('/soft-delete/:id',softDeleteArticle);
router.delete('/hard-delete/:id',hardDeleteArticle);
router.delete('/hard-delete-all', hardDeleteAll)
router.delete('/delete-if-are-wrote', deleteIfAreWrote)


module.exports = router;