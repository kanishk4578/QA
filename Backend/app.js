require("dotenv").config();
const express = require('express');
const path = require('path');
const cookieparser = require('cookie-parser');
const db = require('./config/mongoose-connection.js');
const userRouter = require("./router/user.router.js");
const questionRouter = require('./router/question.router.js');
const answerRouter = require('./router/answer.router.js');
const summaryRouter = require('./router/summary.router.js');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Middleware
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

// Set CORS for frontend hosted on Render
app.use(cors({
  origin: 'https://rashtrsetu.onrender.com',
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}));

// Routes
app.use("/users", userRouter);
app.use("/question", questionRouter);
app.use("/answer", answerRouter);
app.use("/summary", summaryRouter);


// Serve React frontend build from /dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html for all unknown routes (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server
server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});


