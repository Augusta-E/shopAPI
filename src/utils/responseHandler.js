module.exports = {
    success: (res, code, message, data = null, status = 'success') =>
        res.status(code).json({
            code,
            status,
            message,
            data
        })
};
