const { CustomError } = require('../utils/customErrors');

const validate = (schema) => async (data) => {
    try {
        const value = await schema.validateAsync(data);
        return value;
    } catch (err) {
        const error = new CustomError(err.message, 404);
        throw error;
    }
};

module.exports = validate;
