const cartService = require('../services/cart.service');
const response = require('../utils/responseHandler');

exports.createCart = async (req, res, next) => {
    try {
        const cart = await cartService.createCart({ ...req.body });

        return response.success(res, 201, 'created successful', cart);
    } catch (error) {
        return next(error);
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const cart = await cartService.getCart(req.params.id);

        return response.success(res, 201, 'User cart successfully retrieved', cart);
    } catch (error) {
        return next(error);
    }
};

exports.deleteCart = async (req, res, next) => {
    try {
        const cart = await cartService.deleteCart(req.params.id);

        return response.success(res, 201, 'delete successful', cart);
    } catch (error) {
        return next(error);
    }
};
