const auth = require('../auth/validToken');
const messages = require('../models/Messages');
const chats = require('../models/Chats');
const users = require('../models/Person');

exports.saveMessage = async (data, cb) => {
    const { Token } = data;
    const { authenticated, user} = auth.validToken(Token);
    if(!authenticated) return cb({ authenticated });

    const { _id, msg:message } = data;
    const select = { name:1, profilepic: 1 };
    try {
        const { sender } = data;
        const newmessage = new messages({ sender, message, receivedby: [] });
        let msg = await newmessage.save();
        await chats.updateOne({ _id }, { '$push': { 'messages': msg._id } });
        msg = await msg.populate({ path: 'sender', select }).execPopulate();
        
        cb({ success: true, msg });
        return msg;
    } catch (err) {
        cb({ success: false });
        return { success: false };
    }
}