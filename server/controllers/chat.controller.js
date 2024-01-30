// createChat
// getUserChat
// findChat

const Chat = require("../models/chat").Chat;

const createChat = async (req, res) => {
  try {
    const { firstId, secondId } = req.body;

    if (!firstId || !secondId) {
      console.log("Member id is missing :(");
      return res.status(400).json({
        message: "Members id is missing :(",
      });
    }

    const chat = await Chat.findOne({
      members: { $all: [firstId, secondId] },
    }).populate([{
      path: "members",
      model: "User",
      select : ["-password"]
  }]);

    if (chat) {
      console.log("chat already exist");
      return res.status(200).json(chat);
    }

    const newChat = new Chat({
      members: [firstId, secondId],
    });

    const response = await newChat.save()
    console.log("new chat created!");

    const newResponse = await Chat.findOne({
      members: { $all: [firstId, secondId] },
    }).populate([{
      path: "members",
      model: "User",
      select : ["-password"]
  }]);

    return res.status(201).json(newResponse);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error :(",
    });
  }
};

const getUserChat = async(req, res) => {
    const {userId} = req.params
    try {

        const chats = await Chat.find({
            members : {$in : [userId]},
        }).populate([{
            path: "members",
            model: "User",
            select : ["-password"]
        }]);

        res.status(200).json(chats);
    
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "internal server error :(",
      });
    }
}

const findChat = async(req, res) => {
    const {firstId, secondId} = req.params
    try {

        const chat = await Chat.findOne({
            members : {$all : [firstId, secondId]},
        });

        res.status(200).json(chat);
    
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "internal server error :(",
      });
    }
}

module.exports = {createChat, findChat, getUserChat}