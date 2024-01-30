const Message = require('../models/message').Message;

const getMessage = async(req, res) => {
    const {chatId} = req.params;
    const {page} = req.query
    
    try {
        const messages = await Message.find({chatId}).sort({createdAt : -1}).limit(50).skip(page * 50)
        return res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error : error.messages
        })
    }
}

const createMessage = async (req, res) => {
    const {chatId, senderId, message} = req.body;

    const newMessage = new Message({
        chatId,
        senderId,
        message
    })

    try {
        const response = await newMessage.save();
        return res.status(201).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error : error.messages
        })
    }
}

module.exports = {createMessage, getMessage}