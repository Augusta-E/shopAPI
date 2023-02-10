const Joi = require('joi');
const validate = require('../middlewares/validation');

const createCartSchema = Joi.object({
    products: Joi.array()
        .items({
            productId: Joi.required(),
            quantity: Joi.number().required()
        })
        .messages({
            'array.items': 'Product must be an object'
            //     'string.empty': 'Product description cannot be empty',
            //     'string.min': 'Product description must have a minimum length of 25'
        }),
    user: Joi.required().messages({})
}).messages({
    'object.unknown': 'You have used an invalid key.'
});

const updateOrderValidation = Joi.object({
    status: Joi.string().min(3).max(255).trim().messages({
        'string.base': 'Product name must be a string',
        'string.empty': 'Product name cannot be empty',
        'string.min': 'Product name must have a minimum length of 3',
        'string.max': 'Product name must have a maximum length of 255'
    }),
    address: Joi.string().min(25).trim().messages({
        'string.base': 'Product description must be a string',
        'string.empty': 'Product description cannot be empty',
        'string.min': 'Product description must have a minimum length of 25'
    })
}).messages({
    'object.unknown': 'You have used an invalid key.'
});

const validateCartSchema = validate(createCartSchema);
const validateUpdateOrderSchema = validate(updateOrderValidation);

module.exports = {
    validateCartSchema,
    validateUpdateOrderSchema
};
