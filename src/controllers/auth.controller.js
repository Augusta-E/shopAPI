const authService = require('../services/auth.service');
const response = require('../utils/responseHandler');

exports.signUp = async (req, res, next) => {
    try {
        const user = await authService.createUser({ ...req.body });
        return response.success(res, 201, 'Sign up successful, please activate your account to login', user);
    } catch (error) {
        return next(error);
    }
};

exports.signin = async (req, res, next) => {
    try {
        const user = await authService.login({ ...req.body });
        return response.success(res, 201, 'Sign in successful', user);
    } catch (error) {
        return next(error);
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const user = await authService.verifyEmail(req.params.token);
        return response.success(res, 201, 'User account has been verified', user);
    } catch (error) {
        return next(error);
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await authService.resetPasswordLink({ ...req.body });

        return response.success(res, 201, 'password reset link sent', user);
    } catch (error) {
        return next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const password = { ...req.body };
        const token = req.params.token;
        const user = await authService.resetPassword(token, password);

        return response.success(res, 201, 'password reset successful', user);
    } catch (error) {
        return next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { password, new_password } = { ...req.body };
        const userId = req.params.id;
        const user = await authService.changePassword(userId, { password, new_password });
        return response.success(res, 201, 'Your password has been changed');
    } catch (error) {
        return next(error);
    }
};

exports.resendVerificationLink = async (req, res, next) => {
    try {
        const email = { ...req.body };
        const user = await authService.resendEmailVerificationLink(email);

        return response.success(
            res,
            201,
            `Email verification link has been sent to ${user.email}`,
            user
        );
    } catch (error) {
        return next(error);
    }
};
