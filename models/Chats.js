const mongoose = require('mongoose');

let chatSchema = new mongoose.Schema({
    chattype: {
        type: Boolean
    },
    chatname: {
        type: String,
    },
    chatmembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'myPerson',
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messages',
    }],
    imageid: {
        type: String,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('chats', chatSchema);