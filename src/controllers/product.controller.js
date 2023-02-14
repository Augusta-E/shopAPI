const productService = require('../services/product.service');
const response = require('../utils/responseHandler');

exports.createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct({ ...req.body });

        return response.success(res, 201, 'created successful', product);
    } catch (error) {
        return next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const user = await productService.updateProduct(req.params.id, { ...req.body });

        return response.success(res, 201, 'updated successful', user);
    } catch (error) {
        return next(error);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts(req.query);

        return response.success(res, 201, 'products successfully retrieved', products);
    } catch (error) {
        return next(error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProduct(req.params.id);

        return response.success(res, 201, 'product successfully retrieved', product);
    } catch (error) {
        return next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const user = await productService.deleteProduct(req.params.id);

        return response.success(res, 201, 'deleted successful', user);
    } catch (error) {
        return next(error);
    }
};
