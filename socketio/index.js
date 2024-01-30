require('dotenv').config();
const { Server } = require("socket.io");

const io = new Server({ cors: process.env.CLIENT_URL});
let onlineUser = [];
let notifications = [];

io.on("connection", (socket) => {
  console.log("user connected with socket id ", socket.id);

  socket.on("addNewUser", (userId) => {
    for (let i = 0; i < onlineUser.length; i++) {
      if (onlineUser[i].userId === userId) {
        onlineUser[i].socketId = socket.id;
      }
    }
    !onlineUser.some((user) => user.userId === userId) && onlineUser.push({
      userId,
      socketId: socket.id
    })
    
    const user = onlineUser.find(user => user.userId === userId);
    const userNotification = notifications.filter((notification) => notification.recipientId === userId);

    if(user)
    io.to(user.socketId).emit("getNotification", notifications)
    io.emit("getOnlineUsers", onlineUser);
  })


  socket.on("sendMessage", (message) => {
    const user = onlineUser.find(user => user.userId === message.recipientId);

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  })

  socket.on("typing-start", (res) => {
    const user = onlineUser.find(user => user.userId === res.recipientId);

    if (user) {
      io.to(user.socketId).emit("typing-started")
    }

  })

  socket.on("typing-stop", (res) => {
    const user = onlineUser.find(user => user.userId === res.recipientId);

    if (user) {
      io.to(user.socketId).emit("typing-stopped")
    }

  })

  socket.on("notification-trigger", (res) => {
    let temp = false;
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].chatId === res.chatId) {
        temp = true;
        notifications[i].message = [...notifications[i].message, res.message]
      }
    }
    if (!temp) {
      notifications.push({
        chatId: res.chatId,
        senderId: res.senderId,
        recipientId: res.recipientUserId,
        message: [res.message]
      })
    }
    const user = onlineUser.find(user => user.userId === res.recipientUserId);

    if (user) {
      // console.log('yes')
      io.to(user.socketId).emit("getNotification", notifications)
    }
  })

  socket.on("remove-notification",({chatId,userId}) => {
    notifications = notifications.filter(notification => notification.chatId !== chatId);
    // const user = onlineUser.find(user => user.userId === userId);
    io.to(socket.id).emit("getNotification", notifications)
    // console.log(chatId)

  })


  socket.on("disconnect", () => {
    onlineUser = onlineUser.filter(user => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUser);
  })
});

io.listen(4000);