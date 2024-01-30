import express from "express";
import { Server } from "socket.io";
import {createServer} from 'http';

const app = express();
const port = 5000;
const onlineUsers = [];

const server = createServer(app);
const io = new Server(server,{
    cors : {
        origin : "*",
        methods : ["GET","POST"],
        credentials : true
    }
});

io.on('connection', (socket) => {

    io.on('addNewUser',(userId) => {
        if(!onlineUsers.some((user) => user.id === userId)){
            onlineUsers.push({
                userId, 
                socketId : socket.id
            })  
        }
    })
})

app.get("/", (req, res) => {
    res.send("hello world");
})

server.listen(port, () => {
    console.log(`app is running on port ${port}`);
})