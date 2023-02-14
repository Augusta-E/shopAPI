const Product = require('../models/Product.model');
const ObjectId = require('mongoose').Types.ObjectId;

const {
    validateCreateProductSchema,
    validateUpdateProductSchema
} = require('../validations/product.validation');
const { CustomError } = require('../utils/customErrors');

const createProduct = async (payload) => {
    const { title, desc, img, category, quantity, price } = await validateCreateProductSchema(
        payload
    );
    const productExists = await Product.findOne({ title });
    if (productExists) throw new CustomError('Product title already exists');
    const newProduct = await Product.create({
        title,
        desc,
        img,
        category,
        quantity,
        price
    });
    return newProduct;
};

const updateProduct = async (productId, payload) => {
    const isIdValid = (ObjectId.isValid(productId))
    if (!isIdValid) throw new CustomError ('Invalid Id format');

    const { title, desc, img, category, quantity, price } = await validateUpdateProductSchema(
        payload
    );
    const product = await Product.findById(productId);
    if (!product) throw new CustomError('product not found');

    const productTitle = await Product.findOne({title});
    if (productTitle) throw new CustomError('title already exists');
    

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            title,
            desc,
            img,
            category,
            quantity,
            price
        },
        { new: true }
    );
    return updatedProduct;
};

const deleteProduct = async (productId) => {
    const isIdValid = (ObjectId.isValid(productId))
    if (!isIdValid) throw new CustomError ('Invalid Id format');
    const productById = await Product.findById(productId);
    console.log(productId)
    if (!productById )
        throw new CustomError('product not found');
    const product = await Product.findByIdAndDelete(productId);

    return `product '${product.title}' deleted`;
};

const getProduct = async (productId) => {
    const isIdValid = (ObjectId.isValid(productId))
    if (!isIdValid) throw new CustomError ('Invalid Id format');
    const product = await Product.findById(productId);
    if (!product)
        throw new CustomError('no product with the Id');

    return product;
};

const getAllProducts = async (query) => {
    if (Object.keys(query).length === 0) return await Product.find();

    const { title, category, sort, fields, page, limit, numericFilters } = query;
    const queryObject = {};

    //search by title or category
    if (title) {
        queryObject.title = { $regex: title, $options: 'i' };
    }
    if (category) {
        queryObject.category = { $regex: category, $options: 'i' };
    }

    //search by price
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte'
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
        const options = ['price'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = { [operator]: parseInt(value) };
            }
        });
    }

    //sort
    let result = Product.find(queryObject);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }
    //filter
    if (fields) {
        const fieldLists = fields.split(',').join(' ');
        result = result.select(fieldLists);
    }

    //pagination
    const queriedPage = parseInt(page) || 1;
    const queriedLimit = parseInt(limit) || 10;
    const skip = (queriedPage - 1) * queriedLimit;
    const endIndex = queriedPage * queriedLimit;

    const count = await Product.countDocuments(queryObject).exec();
    if (endIndex < count) {
        queryObject.next = {
            page: queriedPage + 1,
            limit: queriedLimit
        };
    }
    if (queriedLimit > 0) {
        queryObject.previous = {
            page: queriedPage - 1,
            limit: queriedLimit
        };
    }
    result = result.limit(queriedLimit).skip(skip);

    const products = await result;

    return {
        count,
        previousPage: queryObject.previous,
        nextPage: queryObject.next,
        products
    };
};

module.exports = { createProduct, updateProduct, deleteProduct, getProduct, getAllProducts };
