const questionModel = require('../models/question.model');


const askQuestion = async (req, res) => {
  try {
    let { questionText } = req.body;
    
    let question = await questionModel.create({questionText});
    
    res.status(201).json({ question });
  } catch (err) {
    console.error('Error creating question:', err.message);
    res.status(500).json({ error: err.message });
  }
};

const readQuestion = async (req, res) => {
  try {
    const questions = await questionModel.find().sort({ createdAt: -1 }); 
    res.status(200).json({ questions });
  } catch (err) {
    console.error("Error reading questions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getQuestion = async (req, res) => {
  try {
    const question = await questionModel.findById(req.params.questionId); 

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}


const editQuestion = async (req, res) => {
  try {
    const { questionText } = req.body;
    const { questionId } = req.params; 

    if (!questionText) {
      return res.status(400).json({ error: 'Question text is required' });
    }

    const updated = await questionModel.findByIdAndUpdate(
      questionId, 
      { questionText },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};




module.exports = {
    askQuestion,
    readQuestion,
    getQuestion,
    editQuestion,
};