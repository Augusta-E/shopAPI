const orderService = require('../services/order.service');
const response = require('../utils/responseHandler');

exports.placeOrder = async (req, res, next) => {
    try {
        const order = await orderService.placeOrder({ ...req.body });

        return response.success(res, 201, 'order successfully placed', order);
    } catch (error) {
        return next(error);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getAllOrders();

        return response.success(res, 201, 'orders successfully retrived', orders);
    } catch (error) {
        return next(error);
    }
};

exports.getOrder = async (req, res, next) => {
    try {
        const order = await orderService.getOrder(req.params.id);

        return response.success(res, 201, 'order successfully retrieved', order);
    } catch (error) {
        return next(error);
    }
};

exports.orderHistory = async (req, res, next) => {
    try {
        const orders = await orderService.orderList(req.params.id);

        return response.success(res, 201, 'orders history successfully retrieved', orders);
    } catch (error) {
        return next(error);
    }
};

exports.orderCount = async (req, res, next) => {
    try {
        const totalOrders = await orderService.orderCount(req.params.id);

        return response.success(res, 201, 'successfully retrieved', totalOrders);
    } catch (error) {
        return next(error);
    }
};

exports.totalSales = async (req, res, next) => {
    try {
        const totalSales = await orderService.getTotalSales();

        return response.success(res, 201, 'successfully retrieved', totalSales);
    } catch (error) {
        return next(error);
    }
};

exports.monthlyCount = async (req, res, next) => {
    try {
        const orderCount = await orderService.monthlyCount(req.params.id);

        return response.success(res, 201, 'successfully retrieved', orderCount);
    } catch (error) {
        return next(error);
    }
};

exports.monthlySales = async (req, res, next) => {
    try {
        const salesMonthly = await orderService.monthlySales(req.params.id); 

        return response.success(res, 201, 'successfully retrieved', salesMonthly);
    } catch (error) {
        return next(error);
    }
};
