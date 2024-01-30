require('dotenv').config();
const connect = require('./utils/db.js')();
const express = require('express');
const app = express();
const cors = require('cors');
const userRouter = require('./routes/user.route');
const chatRouter = require("./routes/chat.route.js")
const messageRouter = require("./routes/message.route.js")

app.use(cors());

app.use(express.json());

app.use('/user', userRouter);
app.use('/chats', chatRouter)
app.use('/messages', messageRouter)

app.listen(process.env.PORT, () => {
    console.log(`application is running on port ${process.env.PORT}`);
})