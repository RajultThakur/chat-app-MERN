const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
    {
        members : [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User', // Reference to another model (optional)
            }
          ],
    },
    {
        timestamps: true
    },
)
const Chat = mongoose.model('Chat',ChatSchema);
module.exports = {Chat};