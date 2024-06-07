const Router = require('express')
const {selectBestArticles, singleArticle} = require('../controllers/open-ai')
const router = Router();



router.post('/', selectBestArticles);
router.post('/:id', singleArticle);


module.exports = router;