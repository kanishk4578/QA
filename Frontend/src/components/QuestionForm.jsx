import React, { useState } from 'react';

function QuestionForm() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const maxChars = 500;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      console.log('Question posted:', text);
      setText('');
      setCharCount(0);
      alert('Question posted successfully!');
    } catch (err) {
      alert('Failed to post question.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setText(value);
      setCharCount(value.length);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center mb-12">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-2"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Ask Your Question
              <motion.span
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-red-500 text-6xl md:text-7xl"
              >
                ?
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Share your thoughts, get answers, and connect with the community
            </motion.p>
          </div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12"
          >
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="relative">
                <label className="block text-gray-700 font-medium mb-3 text-lg">
                  What's on your mind?
                </label>
                <div className="relative">
                  <textarea
                    className="w-full min-h-[150px] md:min-h-[200px] border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-4 text-gray-800 bg-white/80 rounded-2xl resize-y transition-all duration-300 text-lg placeholder-gray-400 shadow-sm"
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Type your question here... Be specific and clear to get the best answers!"
                    disabled={isLoading}
                  />
                  <div className="absolute bottom-3 right-3 text-sm text-gray-500">
                    <span className={charCount > maxChars * 0.9 ? 'text-red-500' : 'text-gray-400'}>
                      {charCount}/{maxChars}
                    </span>
                  </div>
                </div>
              </div>

              {/* Character count progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full transition-all duration-300 ${
                    charCount > maxChars * 0.9 ? 'bg-red-500' : 
                    charCount > maxChars * 0.7 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(charCount / maxChars) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <motion.button
                  type="submit"
                  disabled={!text.trim() || isLoading}
                  className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 min-w-[200px]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Posting...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Post Question
                    </span>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Tips for great questions
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Be specific and provide context</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Use clear, concise language</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Add relevant details and examples</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default QuestionForm;