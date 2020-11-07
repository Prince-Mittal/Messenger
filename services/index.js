const validuser = require('./validuserService');
const friends = require('./userService');
const chat = require('./chatServices');
const messages = require('./messageService');

module.exports = {
    validuser,
    friends,
    chat,
    messages
}