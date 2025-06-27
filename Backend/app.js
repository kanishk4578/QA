require("dotenv").config();
const express = require('express');
const path = require('path');
const cookieparser = require('cookie-parser');
const db = require('./config/mongoose-connection.js');
const expressSession = require("express-session");
const userRouter = require("./router/user.router.js")
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const questionRouter = require('./router/question.router.js')
const answerRouter = require('./router/answer.router.js')
const summaryRouter = require('./router/summary.router.js')

const app = express();
const server = http.createServer(app);


app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieparser());
app.use(//session create karne ke liye.
    expressSession({
        resave: false,//baar baar save mat karo session ko
        saveUninitialized: false,//unauthorised user ke session ko save mat karo jiska account create na ho
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
)
app.use(cors({
  origin: 'http://localhost:5173', // Vite frontend
  methods: ['GET', 'POST','PUT'],
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST','PUT','DELETE'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
  });
});

app.use("/users",userRouter);
app.use("/question",questionRouter);
app.use("/answer",answerRouter);
app.use("/summary",summaryRouter);


server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});


