const jwt = require('jsonwebtoken');
const User = require('../../models/User.model');
const config = require('../../config/index');
const ObjectId = require('mongoose').Types.ObjectId;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, config.app.jwt_secret, async (err, user) => {
            if (err) res.status(403).json('Token is not valid');
            req.user = user;
            const userValid = await User.findById(new ObjectId(user.id));
            if (!userValid || userValid.deactivated)
                return res.status(400).json('You are not a registered user');
            next();
        });
    } else {
        return res.status(401).json('you are not authenticated');
    }
};

const authorized = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json('You are not authorized to do that');
        }
    });
};

const restrictedTodAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json('You are not an admin');
        }
    });
};

module.exports = { authorized, restrictedTodAdmin };
