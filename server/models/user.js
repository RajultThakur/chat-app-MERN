const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "please provide a username"],
        },

        email: {
            type: String,
            required: [true, " please provide a email"],
            unique: true
        },

        password: {
            type: String,
            required: [true, "please provide a password"]
        },

    },
    {
        timestamps: true
    },
)
const User = mongoose.model('User',UserSchema);
module.exports = {User};