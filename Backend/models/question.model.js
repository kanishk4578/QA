const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);