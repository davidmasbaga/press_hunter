const Router = require('express')
const { scrapeEs } = require('../controllers/scraper_es')



const router = Router();

router.get('/es', scrapeEs)




module.exports = router;

