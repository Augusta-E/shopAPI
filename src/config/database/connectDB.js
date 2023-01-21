const mongoose = require('mongoose');
const config = require('../index');
const logger = require('../../utils/logger');

const connectDB = (callback) => {
    mongoose.set('strictQuery', false);
    mongoose
        .connect(
            `${`mongodb+srv://${config.db.user}:${config.db.password}@cluster0.kngtf.mongodb.net/${config.db.name}?retryWrites=true&w=majority`}`,
            {}
        )
        .then(() => {
            logger.log('info', 'Mongodb database connected...');
            callback();
        })
        .catch((err) => {
            logger.log('error', err);
        });
};

module.exports = { connectDB };
