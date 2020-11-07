const mongoose = require('mongoose');

let messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'myPerson',
    },
    receivedby: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'myPerson',
        },
        seen: {
            type: Boolean,
            default: false,
        }
    }],
    message: {
        type: String,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('messages', messageSchema);