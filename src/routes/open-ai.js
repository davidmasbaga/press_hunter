const Router = require('express')
const {selectBestArticles} = require('../controllers/open-ai')
const router = Router();



router.post('/', selectBestArticles);


module.exports = router;