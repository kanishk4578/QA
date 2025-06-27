const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewears/isLoggedIn');
const {askQuestion,readQuestion,editQuestion,getQuestion,deleteQuestion} = require('../controllers/questionController');

router.post("/ask",askQuestion);
router.get("/read",readQuestion);
router.get("/get/:questionId", getQuestion);
router.put("/edit/:questionId", editQuestion);


module.exports= router