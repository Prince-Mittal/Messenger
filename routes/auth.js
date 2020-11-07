const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jsonwt = require('jsonwebtoken')
const passport = require('passport')
const key = require('../setup/dburl')
const nodemailer = require('nodemailer')
const otplib = require("otplib")
const services = require("../services")
const verifyToken = require("./verifyToken");

const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';


//Import Schema for user Registration
const Person = require('../models/Person');
const otps = require('../models/otpUsers');

// @type    POST
// @route   /auth/verify
// @desc    route for user verification
// @access  PUBLIC
router.post('/verify', (req,res) => {
    Person.findOne({ email: req.body.email })
        .then(person => {
            if (person) {
                return res.status(400).json({ errmsg: 'email' })
            } 
            else {
            Person.findOne({ username: req.body.username }).then(person => {
                if (person) {
                    return res.status(400).json({ errmsg: 'username' })
                }
                else{
                    const token = otplib.authenticator.generate(secret);
                    var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: require("../setup/dburl").email,
                        pass: require("../setup/dburl").emailPass,
                    }
                    });

                    var mailOptions = {
                    from: 'chitchatindia1@gmail.com',   
                    to: req.body.email,
                    subject: 'Verify Your Accounnt',
                    // text: token
                    html: `<body style="font-family:sans-serif;">
                            <div style="width: 600px;
                                        height: 300px;
                                        background-color:#d3d3d3;
                                        position: absolute;
                                        border-radius: 5px;
                                        padding-top:10px">
                                <div style="text-align:center;">
                                    <h3 style="font-weight:bold;
                                            color: orangered;">Chit<span style="color:blue">Chat</span>India</h3>
                                    <p style="font-size:14px;">You tried to register on our portal. Here is the six-digit OTP
                                        to continue.</p>
                                </div>
                                <div style="text-align: center;
                                            color: #cc7000;
                                            font-weight: bold;
                                            border: 2px solid #cc7000;
                                            border-style: dotted;
                                            padding: 5px 0px;
                                            margin: 0px 25px;">
                                    ${token}
                                </div>
                                <div style="text-align: center;">
                                    <p>Please do not share OTP with anyone.</p>
                                    <p>Thank you.</p>
                                    <p>Team <mark>ChitChatIndia</mark></p>
                                    <p>If you did not make this request, you can safely ignore this email.</p>
                                </div>
                            </div>
                        </body>`
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                    });
                    console.log("Email Sent");
                    otps.findOne({email: req.body.email})
                        .then(otp => {
                            if(otp){
                                otps.update({email: req.body.email},{$set:{token:token}})
                                    .then().catch(err => console.log(err));
                            }
                            else{
                                let usertoken = new otps;
                                usertoken.email = req.body.email;
                                usertoken.token = token;
                                usertoken.save().then().catch(err => console.log(err));
                            }
                        }); 
                    res.status(200).json("ok")    
                    }
                })
            }
        })
})


// @type    POST
// @route   /auth/checkOTP
// @desc    route for user verification
// @access  PUBLIC
router.post('/checkOTP',(req, res) => {
    otps.findOne({ email: req.body.email })
    .then(data => {
        if (data.length == 0) {
            res.status(406).json('ERROR');              //406 Not Acceptable Error Code
        }
        else if (data.token === req.body.otp) {
            res.status(200).json('OK');
        }
        else {
            res.status(406).json('INCORRECT');
        }
    })
    .catch(err => {
            console.log(err)
            res.sendStatus(500);
    });
})


// @type    POST
// @route   /auth/register
// @desc    route for registration of users
// @access  PUBLIC

router.post('/register', (req, res) => {
    Person.findOne({ email: req.body.email })
        .then(person => {
            if (person) {
                return res.status(400).json({ emailerror: 'Email is already registered' })
            } else {
                const newPerson = new Person({
                    name: req.body.name,
                    email: req.body.email,
                    username:req.body.username,
                    gender: req.body.gender,
                    password: req.body.password
                });
                //Encrypting the password using bcrypt
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newPerson.password, salt, (err, hash) => {
                        if (err) throw err;
                        newPerson.password = hash;
                        newPerson
                            .save()
                            .then(person => res.json(person))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
        .catch(err => console.log(err));
});

// @type    POST
// @route   /auth/login
// @desc    route for login of users
// @access  PUBLIC

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
    const { authenticated, _id, err_msg } = await services.validuser.valid(email,password);
    if(!authenticated)
        return res.status(400).json({authenticated , err_msg});
    Person.updateOne({_id}, {isOnline:true});
    const payload = {
        id: _id
    };
    jsonwt.sign( payload, 'secretkey', (err, token) => {
            if(err) throw err;
            return res.json({ authenticated, token })
        });
    }catch(err){
        console.log(err);
    }

});

// @type    POST
// @route   /auth/verifyToken
// @desc    route for JWT token verification
// @access  PUBLIC
router.post('/verifyToken', (req,res) => {
    const {authenticated, _id} = verifyToken.validToken(req.body.token);
    res.status(200).json({authenticated, _id});
})


module.exports = router;