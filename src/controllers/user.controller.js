const userServices = require('../services/user.service');
const response = require('../utils/responseHandler');

exports.updateUser = async (req, res, next) => {
    try {
        const user = await userServices.updateUser(req.params.id, { ...req.body });

        return response.success(res, 201, 'updated successful');
    } catch (error) {
        return next(error);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const users = await userServices.getAllUsers(req.query);
        return response.success(res, 201, 'users successfully retrieved', users);
    } catch (error) {
        return next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const user = await userServices.getUserById(req.params.id);

        return response.success(res, 201, 'user successfully retrieved', user);
    } catch (error) {
        return next(error);
    }
};

exports.deactivateUser = async (req, res, next) => {
    try {
        const user = await userServices.deactivateUser(req.params.id);

        return response.success(res, 201, 'deactivation successful', user);
    } catch (error) {
        return next(error);
    }
};

exports.reactivateUser = async (req, res, next) => {
    try {
        const user = await userServices.reactivateUser(req.params.id);

        return response.success(res, 201, 'reactivation successful', user);
    } catch (error) {
        return next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await userServices.deleteUser(req.params.id);

        return response.success(res, 201, 'deleted successful', user);
    } catch (error) {
        return next(error);
    }
};
