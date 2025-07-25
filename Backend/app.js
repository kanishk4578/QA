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
const rateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);

// Middleware
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());


const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
  message: 'Too many requests, please try again later.',
});

app.use(limiter);
// Set CORS for frontend hosted on Render
app.use(cors({
  origin: 'https://rashtrsetu.onrender.com',
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}));

app.options('*', cors()); // Preflight handling


// Routes
app.use("/users", userRouter);
app.use("/question", questionRouter);
app.use("/answer", answerRouter);
app.use("/summary", summaryRouter);


// Serve frontend (production build)
app.use(express.static(path.join(__dirname, '../Frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
});


// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});


