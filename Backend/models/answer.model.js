const mongoose = require('mongoose');


const AnswerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User' 
    },
  questionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Question'
    },
  answerText: String,
  submittedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Answer', AnswerSchema);