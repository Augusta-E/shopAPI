const authServices = require('../services/auth.service');
const response = require('../utils/responseHandler');

exports.signUp = async (req, res, next) => {
    try {
        const user = await authServices.createUser({ ...req.body });
        return response.success(res, 201, 'Sign up successful', user);
    } catch (error) {
        return next(error);
    }
};

exports.signin = async (req, res, next) => {
    try {
        const user = await authServices.login({ ...req.body });
        return response.success(res, 201, 'Sign in successful, please activate your account', user);
    } catch (error) {
        return next(error);
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const user = await authServices.verifyEmail(req.params.token);
        return response.success(res, 201, 'User account has been verified', user);
    } catch (error) {
        return next(error);
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await authServices.resetPasswordLink({ ...req.body });

        return response.success(res, 201, 'Verification Link sent', user);
    } catch (error) {
        return next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const password = { ...req.body };
        const token = req.params.token;
        const user = await authServices.resetPassword(token, password);

        return response.success(res, 201, 'password reset successful', user);
    } catch (error) {
        return next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { password, new_password } = { ...req.body };
        const userId = req.params.id;
        const user = await authServices.changePassword(userId, { password, new_password });
        return response.success(res, 201, 'Your password has been changed');
    } catch (error) {
        return next(error);
    }
};

exports.resendVerificationLink = async (req, res, next) => {
    try {
        const email = { ...req.body };
        const user = await authServices.resendEmailVerificationLink(email);
        console.log(user);

        return response.success(res, 201, `Email verification link has been sent to ${user}`);
    } catch (error) {
        return next(error);
    }
};
