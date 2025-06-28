const answerModel = require('../models/answer.model');


const writeAnswer = async (req, res) => {
  try {
    const { answerText, userId, questionId } = req.body;
    const user = req.user?._id || userId;

    if (!user) {
      return res.status(400).json({ error: "User ID is required" });
    }
    if (!questionId) {
      return res.status(400).json({ error: "Question ID is required" });
    }

    const answer = await answerModel.create({ answerText, questionId, userId: user });
    res.status(201).json({ answer });
  } catch (err) {
    console.error('Error creating answer:', err.message);
    res.status(500).json({ error: err.message });
  }
};

const readAnswer = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const answers = await answerModel.find({ userId }).sort({ createdAt: -1 });
    res.status(201).json({ answers });
  } catch (err) {
    console.error("Error reading answers:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  writeAnswer,
  readAnswer,
};