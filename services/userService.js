const users = require('../models/Person');

exports.add = async (data) => {
    try {
        const { phone } = data;
        const user = new users(data);
        const exist = await users.findOne({ phone });
        if(exist) return { success: false, err_msg: 'user already exist' };
        await user.save();
        return { success: true };
    } catch(err) {
        console.log(err);
        return { success: false };
    } 
}


exports.userInformation = async _id => {
    try {
        const user = users.findById(_id, { name: 1, username: 1, profilepic: 1});
        return { success: true, user };
    } catch (err) {
        return { success:  false };
    }
}

exports.getfriends = async _id => {
    const friends = await users.findById(_id, { friends: 1 })
        .populate({
            'path': 'friends',
            'select': {
                name: 1,
                profilepic: 1,
                _id: 1
            },
            'options': { 'sort': { 'name': 1 } }
        });
    return friends;
}

exports.getfriendsreq = async _id => {
    const frequests = await users.findById(_id, { frequests: 1 })
        .populate({
            'path': 'frequests',
            'select': {
                name: 1,
                profilepic: 1,
                _id: 1
            },
            'options': { 'sort': { 'name': 1 } }
        });
    return frequests;
}

exports.getfriendsreqsent = async _id => {
    const fsent = await users.findById(_id, { fsent: 1 })
        .populate({
            'path': 'fsent',
            'select': {
                name: 1,
                profilepic: 1,
                _id: 1
            },
            'options': { 'sort': { 'name': 1 } }
        });
    return fsent;
}