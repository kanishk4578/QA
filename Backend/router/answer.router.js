const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewears/isLoggedIn')
const {writeAnswer,readAnswer} = require('../controllers/answerController');

router.post("/write",writeAnswer);
router.get("/read",isLoggedIn,readAnswer);

module.exports= router