const jwt = require('jsonwebtoken');
const User = require('../../models/User.model');
const config = require('../../config/index');
const ObjectId = require('mongoose').Types.ObjectId;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, config.app.jwt_secret, async (err, user) => {
            if (err) return (res.status(403).json('Token is not valid'));
            req.user = user;
            const userValid = await User.findById(new ObjectId(user.id));            
            if (!userValid || userValid.isDeleted) return res.status(400).json('Invalid token');
            if (userValid && !userValid.isVerified) return res.status(400).json('User is not verified');

            if (userValid.isDeactivated)
                return res
                    .status(400)
                    .json('Your account has been deactivated, please contact the admin');
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
            res.status(403).json('Only admin is authorized to do that');
        }
    });
};

module.exports = { authorized, restrictedTodAdmin };
