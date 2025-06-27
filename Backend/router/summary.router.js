const express = require('express');
const router = express.Router();
const {sendAnswersToCohere} = require('../controllers/summaryController')
const isLoggedIn = require('../middlewears/isLoggedIn')

router.get("/summaries/:questionId",sendAnswersToCohere);

module.exports = router