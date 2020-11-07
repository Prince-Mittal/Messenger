const express = require('express')
const router = express.Router()
const jsonwt = require('jsonwebtoken')
const passport = require('passport')
const key = require('../setup/dburl')
const verifyToken = require("./verifyToken");
const services = require("../services")

const Person = require('../models/Person');




// @type    POST
// @route   /friends/search
// @desc    route for user search
// @access  PRIVATE
router.post('/search', (req, res) => {
    const tokenRes = verifyToken.validToken(req.body.token);
    // console.log(tokenRes);
    if (tokenRes.authenticated) {
        Person.find({
            $or: [{ name: req.body.name}, {username: req.body.name}, {email: req.body.name}] 
        }, {name: 1, profilepic:1, _id:1})
            .then(users => {
                res.json(users);
            })
            .catch(err => console.log(err));
    }
    else {
        res.status("401").json({ err_msg: "Invalid Token" });
    }
})


// @type    POST
// @route   /friends/sendReq
// @desc    route for sending friend requests
// @access  PRIVATE

router.post('/sendReq/:id', (req,res) => {
    const tokenRes = verifyToken.validToken(req.body.token);
    if (tokenRes.authenticated) {
        Person.findById(tokenRes._id)
            .then(user => {
                if (!user.friends.find(o => o._id == req.params.id) && !user.fsent.find(o => o._id === req.params.id)) {
                    Person.findByIdAndUpdate(tokenRes._id, { '$push': { 'fsent': req.params.id } })
                    .then(()=>{
                        Person.findByIdAndUpdate(req.params.id, { '$push': { 'frequests': tokenRes._id } })
                        .then(() => {
                            res.json({success:true});
                        })
                        .catch(err => console.log(err));
                    });
                }
                else{
                    if (user.friends.find(o => o._id == req.params.id)){
                        res.status(400).json({ err_msg: "You are already friends" });    
                    }
                    else{
                        res.status(400).json({ err_msg: "You have already sent the request" });
                    }
                }
        });
    }
    else {
        res.status("401").json({ err_msg: "Invalid Token" });
    }
})

// @type    POST
// @route   /friends/cancelReq
// @desc    route for sending friend requests
// @access  PRIVATE

router.post('/cancelReq/:id', (req, res) => {
    const tokenRes = verifyToken.validToken(req.body.token);
    if (tokenRes.authenticated) {
        Person.findById(tokenRes._id)
            .then(user => {
                if (user.fsent.find(o => o._id == req.params.id) && !user.friends.find(o => o._id === req.params.id)) {
                    Person.findByIdAndUpdate(tokenRes._id, { '$pull': { 'fsent': req.params.id } })
                        .then(() => {
                            Person.findByIdAndUpdate(req.params.id, { '$pull': { 'frequests': tokenRes._id } })
                                .then(() => {
                                    res.status(200).json({ success: true });
                                })
                                .catch(err => console.log(err));
                    });
                }
                else{
                    res.status(400).json({err_msg: "Can't Cancel the request"});
                }
            });
        }
    else {
        res.status("401").json({ err_msg: "Invalid Token" });
    }
})

// @type    POST
// @route   /friends/rejectReq
// @desc    route for sending friend requests
// @access  PRIVATE

router.post('/rejectReq/:id', (req, res) => {
    const tokenRes = verifyToken.validToken(req.body.token);
    if (tokenRes.authenticated) {
        Person.findById(tokenRes._id)
            .then(user => {
                if (user.frequests.find(o => o._id == req.params.id) && !user.friends.find(o => o._id === req.params.id)) {
                    Person.findByIdAndUpdate(tokenRes._id, { '$pull': { 'frequests': req.params.id } })
                        .then(() => {
                            Person.findByIdAndUpdate(req.params.id, { '$pull': { 'fsent': tokenRes._id } })
                                .then(() => {
                                    res.status(200).json({ success: true });
                                })
                                .catch(err => console.log(err));
                        });
                }
                else {
                    res.status(400).json({ err_msg: "Can't Reject the request" });
                }
            });
    }
    else {
        res.status("401").json({ err_msg: "Invalid Token" });
    }
})

// @type    POST
// @route   /friends/acceptReq
// @desc    route for user search
// @access  PRIVATE
router.post('/acceptReq/:id', (req, res) => {
    const tokenRes = verifyToken.validToken(req.body.token);
    if (tokenRes.authenticated) {
        Person.findById(tokenRes._id)
        .then(user => {
            if(user.frequests.find(o => o._id == req.params.id) && !user.friends.find(o => o._id === req.params.id)){
                Person.findByIdAndUpdate(tokenRes._id, { '$pull': { 'fsent': req.params.id }, "$push": { 'friends': req.params.id } })
                    .then(() => {
                        Person.findByIdAndUpdate(req.params.id, { '$pull': { 'frequests': tokenRes._id }, "$push": { 'friends': tokenRes._id } })
                            .then(() => {
                                res.status(200).json({ success: true });
                            })
                            .catch(err => console.log(err));
                    });
            }
            else{
                res.status(400).json({err_msg : "Can't accept the request"})
            }
        }).catch(err => console.log(err));
        
    }
    else {
        res.status("401").json({ err_msg: "Invalid Token" });
    }
})


// @type    GET
// @route   /friends/
// @desc    route for getting friend data
// @access  PRIVATE

router.get('/',async (req, res) => {
    const tokenRes = verifyToken.validToken(req.headers.token);
    if (tokenRes.authenticated) {
        const { friends } = await services.friends.getfriends(tokenRes._id);
        return res.status(200).json({ friends });
    }
    else {
        res.status("401").json({ err_msg: "Invalid Token" });
    }
})

// @type    POST
// @route   /friends/requests
// @desc    route for getting details of recieved friend requests
// @access  PRIVATE

router.post('/requests', async (req, res) => {
    const tokenRes = verifyToken.validToken(req.body.token);
    if (tokenRes.authenticated) {
        const { frequests } = await services.friends.getfriendsreq(tokenRes._id);
        return res.status(200).json({ frequests });
    }
    else {
        res.status("401").json({ err_msg: "Invalid Token" });
    }
})

// @type    POST
// @route   /friends/reqsent
// @desc    route for getting details of sent friend requests
// @access  PRIVATE

router.post('/reqsent', async (req, res) => {
    const tokenRes = verifyToken.validToken(req.body.token);
    if (tokenRes.authenticated) {
        const { fsent } = await services.friends.getfriendsreqsent(tokenRes._id);
        return res.status(200).json({ fsent });
    }
    else {
        res.status("401").json({ err_msg: "Invalid Token" });
    }
})

// @type    POST
// @route   /friends/checkUser/:id
// @desc    route for getting friend data
// @access  PRIVATE

router.post('/checkUser/:id', async (req, res) => {
    const tokenRes = verifyToken.validToken(req.body.token);
    let value = 0;
    if (tokenRes.authenticated) {
        await Person.findById(tokenRes._id)
        .then(user => {
            if(user.friends.find(o => o._id == req.params.id)){
                value = 2;
            }
            else if(user.fsent.find(o => o._id == req.params.id)){
                value = 1;
            }
        });
        return res.status(200).json({ value });
    }
    else {
        res.status("401").json({ err_msg: "Invalid Token" });
    }
})

module.exports = router;