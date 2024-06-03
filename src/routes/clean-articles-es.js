const express = require('express');
const { saveCleanArticle } = require('../controllers/cleanArticles.es');

const router = express.Router();

router.post('/', saveCleanArticle);

module.exports = router;
