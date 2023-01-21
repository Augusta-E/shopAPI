const User = require('../models/User.model');
const DeletedUser = require('../models/Deleted.model');
const { validateupdateSchema } = require('../validations/user.validator');
const ObjectId = require('mongoose').Types.ObjectId;

const { CustomError } = require('../utils/customErrors');

const updateUser = async (id, userData) => {
    const { firstName, lastName, phoneNumber, email } = await validateupdateSchema(userData);
    const userId = id;
    const user = await User.findById(userId);
    if (!user || ObjectId.isValid(userId) == false) throw CustomError('No user with the id');
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            firstName,
            lastName,
            email,
            phoneNumber
        },
        { new: true }
    );
    return { updatedUser };
};

const deactivateUser = async (id) => {
    const user = await User.findById(id);
    if (!user || ObjectId.isValid(id) == false) throw new CustomError('User does not exist', 400);

    if (user.deactivated) throw new CustomError('User has already been deactivated');

    await User.updateOne({ deactivated: true });

    return `successfully deactivated user '${user.firstName}'`;
};

const getUserById = async (id) => {
    const userId = id;
    const user = await User.findById(userId);
    if (!user || ObjectId.isValid(userId) == false) throw new CustomError('No user with the id');

    const userDetails = await User.findById(id);

    return userDetails;
};

const getAllUsers = async (query) => {
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
    let result = User.find(queryObject);
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
    const queriedLimit = parseInt(limit) || 10;
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
    const user = await User.findById(id);
    if (!user || ObjectId.isValid(id) == false) throw new CustomError('User does not exist', 400);
    const { _id, ...userDoc } = user._doc;

    const oldUser = await DeletedUser.findOne({ email: user.email });

    if (user.email && oldUser.email) {
        await User.deleteOne({ _id: id });
        return;
    }

    await DeletedUser.create(userDoc);

    await User.deleteOne({ _id: id });

    return `successfully deleted the user '${user.firstName}'`;
};

module.exports = { updateUser, deactivateUser, getUserById, getAllUsers, deleteUser };
