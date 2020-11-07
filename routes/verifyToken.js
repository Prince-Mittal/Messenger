const express = require('express')
const router = express.Router()
const jsonwt = require('jsonwebtoken')
const passport = require('passport')
const key = require('../setup/dburl')


exports.validToken = (token) => {
    try {
        const {'id':_id} = jsonwt.verify(token, 'secretkey');
        // console.log("Inside try");
        if (_id) {
            return { authenticated: true, _id };
        } else {
            return { authenticated: false }
        }
    } catch (err) {
        return { authenticated: false };
    }
}