const express = require('express')
const router = express.Router()
const verifyToken = require("./verifyToken");
const Person = require('../models/Person');
const services = require("../services")

// @type    POST
// @route   /chat/exist
// @desc    route for checking if a chat exist or not
// @access  PRIVATE

router.post("/exist", async (req, res) => {
    const tokenRes = verifyToken.validToken(req.headers.token);
    if (tokenRes.authenticated) {
        const { activeChats } = await services.chat.chatExists(tokenRes._id, req.body._id );
        const chat = activeChats.length > 0 ? activeChats[0] : null;
        res.status(200).json({ chat });
    }
    else{
        res.status(400).json({authenticated: false});
    }
});

// @type    GET
// @route   /chat/activeChats
// @desc    route for getting all existing active chats
// @access  PRIVATE

router.get("/activeChats", async (req, res) => {
    const tokenRes = verifyToken.validToken(req.headers.token);
    if (tokenRes.authenticated) {
        const chats = await services.chat.existingChats(tokenRes._id);
        res.status(200).json({ chats });
    }
    else {
        res.status(400).json({ authenticated: false });
    }
});



module.exports = router