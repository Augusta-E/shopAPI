const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            trim: true,
            required: true
        },
        lastName: {
            type: String,
            trim: true,
            required: true
        },
        phoneNumber: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        password: {
            type: String,
            trim: true,
            required: true
        },
        isVerified: {
            type: Boolean,
            default: false,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false,
            required: true
        },
        isDeactivated: {
            type: Boolean,
            default: false,
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false,
            required: true
        }
    },

    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
