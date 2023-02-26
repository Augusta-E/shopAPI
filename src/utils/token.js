const jwt = require('jsonwebtoken');
const config = require('../config/index');

function emailVerificationToken(payload) {
    return jwt.sign(payload, config.app.jwt_secret, {
        expiresIn: `${config.app.jwt_expires_in}`
    });
}

function generateToken(userDetails) {
    return jwt.sign(userDetails, config.app.jwt_secret, {
        expiresIn: `${config.app.jwt_expires_in}`
    });
}

function verifyToken(token) {
    return jwt.verify(token, config.app.jwt_secret);
}

module.exports = { generateToken, verifyToken, emailVerificationToken };
