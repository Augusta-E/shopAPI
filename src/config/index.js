require('dotenv').config();

const config = Object.freeze({
    app: {
        port: process.env.PORT || 5000,
        jwt_secret: process.env.JWT_SECRET,
        name: process.env.APP_NAME || 'shopping_cart',
        email: process.env.APP_EMAIL,
        jwt_expires_in: process.env.JWT_EXPIRES_IN,
        sendgrid_Key: process.env.SENDGRID_API_KEY
    },

    db: {
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }
});

module.exports = config;
