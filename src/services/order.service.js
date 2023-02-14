const Order = require('../models/Order.model');
const Cart = require('../models/Cart.model');
const User = require('../models/User.model');

const ObjectId = require('mongoose').Types.ObjectId;

const { CustomError } = require('../utils/customErrors');

const placeOrder = async (id, payload) => {
    const { status, address } = await validateCreateProductSchema(payload);
    const order = await Order.findById(id);
    if (!order) throw new CustomError('no cart with the Id');
    const updatedOrder = await Order.updateOne(id, { $set: ({status:pending, address}) }, { new: true });
    return updatedOrder;
};

//get user order by user
const getOrder = async (userId) => {
    const isIdValid = (ObjectId.isValid(userId))
    if (!isIdValid) throw new CustomError ('Invalid Id format');
    const userOrder = await Order.findOne({ user: userId });
    if (!userOrder) throw new CustomError('order not found');

    const items = await Order.findOne({ user: userId })
        .populate('products')
        .populate({ path: 'products', populate: 'products.productId' })
        .sort({ updatedAt: -1 });

    const itemsDetails = items.products.products;
    const totalAmount = items.totalAmount;

    const details = itemsDetails.map(({ productId, quantity }) => {
        const orderDetails = {
            productName: productId.title,
            pricePerProduct: productId.price,
            quantityOrdered: quantity,
            image: productId.img,
            Amount: productId.price * quantity
        };
        return orderDetails;
    });
    return { details, totalAmount };
};

//get all orders
const getAllOrders = async () => {
    const orders = await Order.find()
        .populate('products')
        .populate({ path: 'products', populate: 'products.productId' });
    if (!orders) throw new CustomError('order not found');

    const allOrders = orders.map(({ products, totalAmount }) => {
        const items = products.products;
        const customerOrder = items.map(({ productId, quantity }) => {
            const customersOrders = {
                productId: productId.title,
                quantityOrdered: quantity,
                pricePerProduct: productId.price,
                image: productId.img,
                amount: productId.price * quantity
            };
            return customersOrders;
        });
        return { customerOrder, totalAmount };
    });
    return { allOrders };
};

const getTotalSales = async () => {
    const totalSales = await Order.aggregate([
        { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
    ]);
    if (!totalSales) throw new CustomError('error');

    return { totalSales: totalSales.pop().totalSales };
};

//get order count
const orderCount = async () => {
    const orderCount = await Order.countDocuments((count) => count);

    return orderCount;
};

//user history
const orderList = async (userId) => {
    const userOrderList = await Order.find({ user: userId }).populate({});
};

//get order monthly count
const monthlyCount = async () => {
    const orderCount = await Order.countDocuments((count) => count);
};

//user montly sales
const monthlySales = async (userId) => {
    const userOrderList = await Order.find({ user: userId }).populate({});
};

module.exports = {
    placeOrder,
    getOrder,
    getAllOrders,
    getTotalSales,
    orderCount,
    orderList,
    monthlyCount,
    monthlySales
};
