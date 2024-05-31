const Router = require('express')
const { scrapeEs,scrapeTitles } = require('../controllers/scraper_es')



const router = Router();

router.get('/es', scrapeEs)
router.get('/estitle', scrapeTitles)




module.exports = router;

