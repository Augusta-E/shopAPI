class CustomError extends Error {
    constructor(message, statusCode, name) {
        super(message);
        this.statusCode = statusCode || 400;
        this.name = name;
    }
    toJSON() {
        return {
            code: this.statusCode,
            status: 'error',
            message: this.message || 'somethin went wrong, try again later',
            data: process.env.NODE_ENV !== 'production' ? this.stack : null
        };
    }
}
module.exports = { CustomError };
