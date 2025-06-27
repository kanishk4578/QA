const axios = require('axios');
const answerModel = require('../models/answer.model');

const sendAnswersToCohere = async (req, res) => {
  try {
    const { questionId } = req.params;
    if (!questionId) {
      return res.status(400).json({ error: "Question ID is required" });
    }

    // Fetch all answers for the given question
    const answers = await answerModel.find({ questionId });
    if (!answers || answers.length === 0) {
      return res.status(404).json({ error: "No answers found for this question." });
    }

    const answerTexts = answers.map(a => a.answerText).join('\n');

    // Call Cohere Summarization API
    const cohereResponse = await axios.post(
      'https://api.cohere.ai/v1/summarize',
      {
        text: `Here are the responses from multiple people to a decision:\n${answerTexts}\n\nSummarize the overall sentiment, and highlight unique pros and cons.`,
        length: 'auto',             // You can use: short, medium, long, or auto
        format: 'bullets',          // Or 'paragraph'
        model: 'command',           // Cohere's best model
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Return the summary
    res.json({ summary: cohereResponse.data.summary });

  } catch (err) {
    console.error("Cohere summarization error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to summarize with Cohere" });
  }
};

module.exports = {
  sendAnswersToCohere,
};
