const bcrypt = require('bcryptjs')
const users = require('../models/Person');

exports.valid = async (email, password) => {
    const user = await users.findOne({ email }, { _id: 1, password: 1 });
    if(!user) return {authenticated: false, err_msg: 'user doest not exist' };
    const { _id } = user;
    const isCorrect = await bcrypt.compare(password, user.password)
    if(!isCorrect) 
        return {authenticated: false, err_msg: 'incorrect password' };
    else
        return {authenticated: true, _id };
    }