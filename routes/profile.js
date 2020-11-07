const express = require('express')
const router = express.Router()
const verifyToken = require("./verifyToken");
const Person = require('../models/Person');

// @type    GET
// @route   /profile/
// @desc    route for user profile
// @access  PRIVATE

router.get('/', (req, res) => {
    const tokenRes = verifyToken.validToken(req.headers.token);
    if (tokenRes.authenticated) {
        Person.findById(tokenRes._id)
            .then(user => {
                if (!user)
                    return res.status("400").json({ err_msg: "User Not Found" });
                res.status("200").json({
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    gender: user.gender,
                    profilepic: user.profilepic,
                    friends: user.friends.length,
                    about: user.about,
                    date: user.date
                });
            });
    }
    else {
        res.status("401").json({ err_msg: "Invalid Token" });
    }
}
);

// @type    GET
// @route   /profile/:id
// @desc    route for user's profile via id
// @access  PRIVATE

router.get('/:id', (req, res) => {
    const tokenRes = verifyToken.validToken(req.headers.token);
    
    if (tokenRes.authenticated) {
        Person.findById(req.params.id)
            .then(user => {
                if (!user)
                    return res.status("400").json({ err_msg: "User Not Found" });
                res.status("200").json({
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    gender: user.gender,
                    profilepic: user.profilepic,
                    friends: user.friends.length,
                    about: user.about,
                    date: user.date
                });
            });
    }
    else {
        res.status("401").json({ err_msg: "Invalid Token" });
    }

}
);

// @type    POST
// @route   /profile/update
// @desc    route for user profile data updation
// @access  PRIVATE

router.post('/update', (req, res) => {
    const tokenRes = verifyToken.validToken(req.body.token);
    // console.log(tokenRes);
    if (tokenRes.authenticated) {
        Person.findByIdAndUpdate(tokenRes._id, {name: req.body.name, about: req.body.about})
        .then(() => {
            res.status(200).json({success:true});
        }).catch(err => res.status(400).json({err: err}));
    }
    else {
        res.status("401").json({ err_msg: "Invalid Token" });
    }
}
);

module.exports = router;