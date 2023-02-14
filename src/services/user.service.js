const User = require('../models/User.model');
const { validateupdateSchema } = require('../validations/user.validator');
const ObjectId = require('mongoose').Types.ObjectId;
const { CustomError } = require('../utils/customErrors');

const updateUser = async (id, userData) => {
    const isIdValid = (ObjectId.isValid(id))
    if (!isIdValid) throw new CustomError ('Invalid Id format');

    const { firstName, lastName, phoneNumber, email } = await validateupdateSchema(userData);
    const user = await User.findById(id);
    if (!user || user.isDeleted) throw CustomError('User not found');
    if (user.isDeactivated)
        throw new CustomError('Your account has been deactivated, please contact the admin', 401);
        
    const emailExists = await User.findOne({ email, isDeleted: false });
    if(emailExists) throw new CustomError('email already exists', 409);

    const phoneNumberExists = await User.findOne({ phoneNumber, isDeleted: false });
    if (phoneNumberExists) throw new CustomError('Phone number already exists', 409);

    await User.updateOne(
        {_id:id},
        {
            firstName,
            lastName,
            email,
            phoneNumber
        },
        { new: true }
    );
    return;
};

const deactivateUser = async (id) => {
    const isIdValid = (ObjectId.isValid(id))
    if (!isIdValid) throw new CustomError ('Invalid Id format')

    const user = await User.findById(id);
    if (!user || user.isDeleted) throw new CustomError('User does not exist', 400);

    if (user.isAdmin) throw new CustomError('You can not deactivate an admin');

    if (user.isDeactivated) throw new CustomError('User has already been deactivated');
    

    await User.updateOne({ _id: id }, { $set: { isDeactivated: true } });

    return `successfully deactivated user '${user.firstName}'`;
};

const reactivateUser = async (id) => {
    const isIdValid = (ObjectId.isValid(id))
    if (!isIdValid) throw new CustomError ('Invalid Id format');

    const user = await User.findById(id);
    if (!user || user.isDeleted ) throw new CustomError('User does not exist', 400);

    if (!user.isDeactivated) throw new CustomError('User is already active');

    await User.updateOne({ _id: id }, { $set: { isDeactivated: false } });

    return `successfully re-activated user '${user.firstName}'`;
};

const getUserById = async (id) => {
    const isIdValid = (ObjectId.isValid(id))
    if (!isIdValid) throw new CustomError ('Invalid Id format');

    const user = await User.findById(id);
    if (!user || user.isDeleted) throw new CustomError('User not found');
    if (user.isDeactivated)
        throw new CustomError('Your account has been deactivated, please contact the admin', 401);

    return user;
};

const getAllUsers = async (query) => {
    if (Object.keys(query).length === 0)
        return await User.find({ isDeleted: false, isDeactivated: false });

    const { firstName, lastName, email, isVerified, deactivated, sort, fields, page, limit } =
        query;
    const queryObject = {};
    //Search user
    if (firstName) {
        queryObject.firstName = { $regex: firstName, $options: 'i' };
    }
    if (lastName) {
        queryObject.lastName = { $regex: lastName, $options: 'i' };
    }
    if (email) {
        queryObject.email = { $regex: email, $options: 'i' };
    }
    if (isVerified) {
        queryObject.isVerified = isVerified === 'true' ? true : false;
    }
    if (deactivated) {
        queryObject.deactivated = deactivated === 'true' ? true : false;
    }
    //sort user
    let result = User.find(queryObject, { isDeactivated: false, isDeleted: false });
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }
    //filter by user fields
    if (fields) {
        const fieldLists = fields.split(',').join(' ');
        result = result.select(fieldLists);
    }
    //pagination
    const queriedPage = parseInt(page) || 1;
    const queriedLimit = parseInt(limit) || 30;
    const skip = (queriedPage - 1) * queriedLimit;
    const endIndex = queriedPage * queriedLimit;

    const count = await User.countDocuments(queryObject).exec();

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

    const users = await result;

    return {
        count,
        previousPage: queryObject.previous,
        nextPage: queryObject.next,
        users
    };
};

const deleteUser = async (id) => {
    const isIdValid = (ObjectId.isValid(id))
    if (!isIdValid) throw new CustomError ('Invalid Id format');

    const user = await User.findById(id);
    if (!user || user.isDeleted || ObjectId.isValid(id) == false) throw new CustomError('User does not exist', 400);

    await User.updateOne({ _id: id }, { $set: { isDeleted: true } });

    return `successfully deleted user '${user.firstName}'`;
};

module.exports = {
    updateUser,
    deactivateUser,
    getUserById,
    getAllUsers,
    deleteUser,
    reactivateUser
};
