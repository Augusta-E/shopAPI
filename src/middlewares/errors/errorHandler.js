const { CustomError } = require('../../utils/customErrors');
require('dotenv').config();

module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const response =
        err instanceof CustomError
            ? err.toJSON()
            : { code: 500, status: 'error', message: err.message };

    return res.status(statusCode).json(response);
};
