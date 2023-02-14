const Joi = require('joi');
const validate = require('../middlewares/validation');

//validate create user inputs
const createUserSchema = Joi.object({
    firstName: Joi.string().max(25).trim().required().min(3).messages({
        'string.base': 'FirstName must be a string',
        'any.required': 'FirstName is required',
        'string.empty': 'FirstName cannot be empty',
        'string.min': 'FirstName must have a minimum length of 3',
        'string.max': 'FirstName must have a maximum length of 25'
    }),
    lastName: Joi.string().required().min(3).max(25).trim().messages({
        'string.base': 'LastName must be a string',
        'any.required': 'LastName is required',
        'string.empty': 'LastName cannot be empty',
        'string.min': 'LastName must have a minimum length of 3',
        'string.max': 'LastName must have a maximum length of 25'
    }),
    password: Joi.string().required().min(8).trim().messages({
        'string.base': 'Password must be a string',
        'any.required': 'Password is required',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password must have a minimum length of 8'
    }),

    phoneNumber: Joi.string()
        .min(5)
        .max(20)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            'string.base': 'PhoneNumber must be a string',
            'any.required': 'PhoneNumber is required',
            'string.empty': 'PhoneNumber cannot be empty',
            'string.min': 'PhoneNumber must have a minimum length of 5',
            'string.max': 'PhoneNumber must have a maximum length of 20',
            'string.pattern': 'PhoneNumber must contain only numbers'
        }),
    email: Joi.string().email().required().trim().messages({
        'string.base': 'Email must be a string',
        'any.required': 'Email is required',
        'string.empty': 'Email cannot be empty',
        'string.email': 'Must be a valid email'
    })
}).messages({
    'object.unknown': 'You have used an invalid key.'
});

//validate login data
const loginUserSchema = Joi.object({
    password: Joi.string().required().min(8).trim().messages({
        'string.base': 'Password must be a string',
        'any.required': 'Password is required',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password must have a minimum length of 8'
    }),
    phoneNumber: Joi.string()
        .min(5)
        .max(20)
        .pattern(/^[0-9]+$/)
        .messages({
            'string.base': 'PhoneNumber must be a string',
            'any.required': 'PhoneNumber is required',
            'string.empty': 'PhoneNumber cannot be empty',
            'string.min': 'PhoneNumber must have a minimum length of 5',
            'string.max': 'PhoneNumber must have a maximum length of 20',
            'string.pattern': 'PhoneNumber must contain only numbers'
        }),
    email: Joi.string().email().trim().messages({
        'string.base': 'Email must be a string',
        'any.required': 'Email is required',
        'string.empty': 'Email cannot be empty',
        'string.email': 'Must be a valid email'
    })
}).messages({
    'object.unknown': 'You have used an invalid key.'
});

const updateUserSchema = Joi.object({
    firstName: Joi.string().max(25).trim().min(3).messages({
        'string.base': 'FirstName must be a string',
        'string.empty': 'FirstName cannot be empty',
        'string.min': 'FirstName must have a minimum length of 3',
        'string.max': 'FirstName must have a maximum length of 25'
    }),
    lastName: Joi.string().min(3).max(25).trim().messages({
        'string.base': 'LastName must be a string',
        'string.empty': 'LastName cannot be empty',
        'string.min': 'LastName must have a minimum length of 3',
        'string.max': 'LastName must have a maximum length of 25'
    }),
    password: Joi.string().min(8).trim().messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password must have a minimum length of 8'
    }),

    phoneNumber: Joi.string()
        .min(5)
        .max(20)
        .pattern(/^[0-9]+$/)
        .messages({
            'string.base': 'PhoneNumber must be a string',
            'string.empty': 'PhoneNumber cannot be empty',
            'string.min': 'PhoneNumber must have a minimum length of 5',
            'string.max': 'PhoneNumber must have a maximum length of 20',
            'string.pattern': 'PhoneNumber must contain only numbers'
        }),
    email: Joi.string().email().trim().messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email cannot be empty',
        'string.email': 'Must be a valid email'
    })
}).messages({
    'object.unknown': 'You have used an invalid key.'
});

//validate login data
const resetPasswordSchema = Joi.object({
    email: Joi.string().email().trim().messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email cannot be empty',
        'string.email': 'Must be a valid email'
    }),
    password: Joi.string().min(8).trim().messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password must have a minimum length of 8'
    }),
    new_password: Joi.string().min(8).trim().messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password must have a minimum length of 8'
    })
}).messages({
    'object.unknown': 'You have used an invalid key.'
});

const validateUserSchema = validate(createUserSchema);
const validateLoginSchema = validate(loginUserSchema);
const validateupdateSchema = validate(updateUserSchema);
const validatePasswordSchema = validate(resetPasswordSchema);

module.exports = {
    validateUserSchema,
    validateLoginSchema,
    validateupdateSchema,
    validatePasswordSchema
};
