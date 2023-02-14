const Joi = require('joi');
const validate = require('../middlewares/validation');

const createProductSchema = Joi.object({
    title: Joi.string().min(3).max(255).trim().required().messages({
        'string.base': 'Product name must be a string',
        'any.required': 'Product name is required',
        'string.empty': 'Product name cannot be empty',
        'string.min': 'Product name must have a minimum length of 3',
        'string.max': 'Product name must have a maximum length of 255'
    }),
    desc: Joi.string().min(25).trim().messages({
        'string.base': 'Product description must be a string',
        'string.empty': 'Product description cannot be empty',
        'string.min': 'Product description must have a minimum length of 25'
    }),
    img: Joi.string().required().trim().messages({
        'string.base': 'Image must be a string',
        'any.required': 'Image is required',
        'string.empty': 'Image cannot be empty'
    }),
    category: Joi.array().items(Joi.string()).required().messages({
        'string.base': 'Product Category must be an array of strings',
        'any.required': 'Product Category is required',
        'string.empty': 'Product Category cannot be empty'
    }),

    quantity: Joi.number().required().messages({
        'number.base': 'Quantity must be a strings',
        'any.required': 'Quantity is required',
        'number.empty': 'Quantity cannot be empty'
    }),
    price: Joi.number().required().messages({
        'number.base': 'Price must be a number',
        'any.required': 'Price is required',
        'number.empty': 'Price cannot be empty'
    })
}).messages({
    'object.unknown': 'You have used an invalid key.'
});

const updateUserSchema = Joi.object({
    title: Joi.string().min(3).max(255).trim().messages({
        'string.base': 'Product name must be a string',
        'string.empty': 'Product name cannot be empty',
        'string.min': 'Product name must have a minimum length of 3',
        'string.max': 'Product name must have a maximum length of 255'
    }),
    desc: Joi.string().min(25).trim().messages({
        'string.base': 'Product description must be a string',
        'string.empty': 'Product description cannot be empty',
        'string.min': 'Product description must have a minimum length of 25'
    }),
    img: Joi.string().trim().messages({
        'string.base': 'Image must be a string',
        'string.empty': 'Image cannot be empty'
    }),
    category: Joi.array().items(Joi.string()).messages({
        'string.base': 'Product Category must be an array of strings',
        'string.empty': 'Product Category cannot be empty'
    }),
    quantity: Joi.string().trim().messages({
        'string.base': 'Quantity must be a strings',
        'any.required': 'Quantity is required',
        'string.empty': 'Quantity cannot be empty'
    }),
    price: Joi.number().messages({
        'string.base': 'Price must be a number',
        'string.empty': 'Price cannot be empty'
    })
}).messages({
    'object.unknown': 'You have used an invalid key.'
});

const validateCreateProductSchema = validate(createProductSchema);
const validateUpdateProductSchema = validate(updateUserSchema);

module.exports = {
    validateCreateProductSchema,
    validateUpdateProductSchema
};
