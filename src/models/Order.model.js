const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        products: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart',
            required: true
        },

        totalAmount: {
            type: Number,
            required: true
        },
        address: {
            type: Object
        },
        status: {
            type: String,
            enum: ['shopping','pending', 'processing', 'completed'],
            required: true,
            default: 'shopping'
        }
    },

    { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
