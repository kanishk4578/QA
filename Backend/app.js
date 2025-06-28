require("dotenv").config();
const express = require('express');
const path = require('path');
const cookieparser = require('cookie-parser');
const db = require('./config/mongoose-connection.js');
const userRouter = require("./router/user.router.js")
const http = require('http');
const cors = require('cors');
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
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST','PUT'],
  credentials: true
}));

app.use("/users",userRouter);
app.use("/question",questionRouter);
app.use("/answer",answerRouter);
app.use("/summary",summaryRouter);


server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});


