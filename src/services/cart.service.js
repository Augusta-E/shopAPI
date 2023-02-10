const Cart = require('../models/Cart.model');
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/User.model');
const Order = require('../models/Order.model');
const { validateCartSchema } = require('../validations/cart.validation');
const { CustomError } = require('../utils/customErrors');

const createCart = async (payload) => {
    const { products, user } = await validateCartSchema(payload);
    const userExists = await User.findOne({ _id: user });
    if (!userExists)
        throw new CustomError(`User with the Id ${user} does not exists`, 400);
    const cart = await Cart.findOne({ user });
    if (cart) throw new CustomError('Cart already exists');

    //create user cart
    const newCart = await Cart.create({
        user,
        products
    });
    const cartId = newCart._id;

    //get every products in user's cart
    const userCart = await Cart.findOne({ user }).populate('products.productId');
    const cartItems = userCart.products;

    //calculate each product in user's cart and get the array
    const prices = cartItems.map(({ productId, quantity }) => {
        const price = productId.price;
        const total = price * quantity;
        return total;
    });
    //sum-up total price of all cart items
    const totalPrice = prices.reduce((a, b) => a + b, 0);

    //create corresponding order
    Order.create({ user, products: cartId, totalAmount: totalPrice });

    //return created cart
    return { newCart };
};

//delete cart with cart Id
const deleteCart = async (cartId) => {
    const cart = await Cart.findById(cartId);
    if (!cart || ObjectId.isValid(cart) == false) throw CustomError('no product with the Id');
    await Cart.deleteOne({ _id: cartId });

    //delete corresponding order
    await Order.deleteOne({ products: cartId });

    return `cart successfully deleted`;
};

//get user cart
const getCart = async (userId) => {
    const user = await Cart.findOne({ user: userId });
    if (!user || ObjectId.isValid(user) == false) throw new CustomError('no cart with the user Id');

    const cartItems = await user.populate('products.productId');

    const cart = cartItems.products;

    const cartData = cart.map(({ productId, quantity }) => {
        const productDetails = {
            productName: productId.title,
            pricePerProduct: productId.price,
            quantityOrdered: quantity,
            image: productId.img
        };
        return productDetails;
    });
    return cartData;
};

module.exports = { createCart, deleteCart, getCart };
