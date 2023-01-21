const Cart = require('../models/Cart.model');
const ObjectId = require('mongoose').Types.ObjectId;

const { CustomError } = require('../utils/customErrors');

const createCart = async (id, payload) => {
    const { item } = await validateCreateProductSchema(payload);
    const cartExists = await Cart.findOne({ title });
    if (cartExists) throw new CustomError('Cart title already exists');
    const newCart = await Cart.create({});
    return newCart;
};

const updateCart = async (id, payload) => {
    const cart = await Cart.findById(productId);
    if (!cart || ObjectId.isValid(productId) == false) throw CustomError('no cart with the Id');
    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
            title,
            desc,
            img,
            category,
            quantity,
            price
        },
        { new: true }
    );
    return updatedProduct;
};

const deleteCart = async (productId) => {
    const productById = await Product.findById(productId);
    if (!productById || ObjectId.isValid(productId) == false)
        throw CustomError('no product with the Id');
    const product = await Product.findByIdAndDelete(productId);

    return `product '${product.title}' deleted`;
};

const getCart = async (productId) => {
    const product = await Cart.findOne({ userId });
    if (!product || ObjectId.isValid(productId) == false)
        throw CustomError('no product with the Id');

    return product;
};

const getAllCarts = async () => {
    const Cart = await Cart.find();
};

module.exports = { createCart, updateCart, deleteCart, getCart, getAllCarts };
