const jwt = require('jsonwebtoken');
const path = require('path');
const users =  require('../models/Person');
const fs = require('fs');
const auth = require('../auth/validToken');

const chats = require("../models/Chats");

exports.createPrivateChatroom = async (data, cb) => {
    
    const { Token } = data;
    const { authenticated, user } = auth.validToken(Token);
    

    if(!authenticated) return cb({authenticated: false});

    const { id:_id } = user;
    const chatmembers = [data._id, _id];
    
    const select = { name: 1, profilepic: 1 };
    try {
        const query = { chattype: false, chatmembers };
        const chatroom = new chats(query);
        let chat = await chatroom.save();
        chat = await chat.populate({ path: 'chatmembers', select }).execPopulate();
        chatmembers.forEach( async _id => {
            await users.updateOne({ _id }, { '$push': { 'activeChats': chat._id } });
        });
        return cb({ success: true, chat });
    } catch (err) {
        return cb({ success: false });
    }
}

//Check if the chatRoom already exists or not
exports.chatExists = async (_id, friendid) => {
    const { activeChats } = await users.findById(_id, { 'activeChats': 1 })
        .populate({
            path: 'activeChats',
            select: {
                _id: 1,
            },
            match: {
                '$and': [
                    {
                        'chattype': false
                    },
                    {
                        'chatmembers': { '$eq': friendid }
                    }
                ]
            }
        });
    
    return { activeChats };
}

//Get the chats that has happened before
exports.existingChats = async _id => {
    const { activeChats: chats } = await users.findById(_id, { activeChats: 1 })
        .populate({
            'path': 'activeChats',
            'populate': [
                {
                    'path': 'chatmembers',
                    'select': {
                        name: 1,
                        profilepic: 1
                    }
                },
                {
                    path: 'messages',
                    populate: {
                        path: 'sender',
                        select: {
                            name: 1
                        }
                    },
                    options: {
                        sort: { createdAt: -1 }
                    }
                }
            ],
            'options': { 'sort': { 'updatedAt': -1 } }
        });
    return chats;
}