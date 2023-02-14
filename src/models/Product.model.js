const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        desc: {
            type: String,
            trim: true,
            required: true
        },
        img: {
            type: String,
            trim: true,
            required: true
        },
        category: {
            type: Array
        },
        quantity: {
            type: Number,
            trim: true,
            required: true
        },
        price: {
            type: Number,
            trim: true,
            required: true
        }
    },

    { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
