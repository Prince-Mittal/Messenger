const jwt = require('jsonwebtoken');

exports.validToken = (Token) => {
    if(!Token) return { 'authenticated': false };
    try {
        const user = jwt.verify(Token, 'secretkey');
        return { authenticated: true, user };
    } catch(err) {
        return { authenticated: false };
    }
}

exports.verifyToken = (req, res, next) => {
    try {
        // Get Auth Header Value
        const bearerHeader = req.headers['authorization'];
        // Check if bearer is undefined
        if(!bearerHeader) return res.sendStatus(403);
        // split at the space
        const bearer = bearerHeader.split(' ');
        // Get the token from the array
        const token = bearer[1];
        // Verify the token
        const { user } = jwt.verify(token, 'secretKey');
        // Set the user
        req.user = user._id;
        // Next middlewear
        next();
    } catch (err) {
        return res.sendStatus(403);
    }
}