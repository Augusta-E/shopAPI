const User = require('../models/User.model');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken, verifyToken } = require('../utils/token');
const { emailVerificationLink, passwordVerificationLink } = require('../utils/emails');
const ObjectId = require('mongoose').Types.ObjectId;
const { CustomError } = require('../utils/customErrors');
const {
    validateUserSchema,
    validateLoginSchema,
    validatePasswordSchema
} = require('../validations/user.validator');

const createUser = async (userData) => {
    const { firstName, lastName, phoneNumber, email, password } = await validateUserSchema(
        userData
    );
    const emailExists = await User.findOne({ email });
    if (emailExists) throw new CustomError('User with the email already exists', 409);

    const phoneNumberExists = await User.findOne({ phoneNumber });
    if (phoneNumberExists) throw new CustomError('User with the phone number already exists', 409);

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
        firstName,
        lastName,
        phoneNumber,
        password: hashedPassword,
        email
    });
    await emailVerificationLink(email, firstName);

    const Data = {
        userId: newUser._id,
        username: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        isAdmin: newUser.isAdmin
    };
    return { ...Data };
};

//login
const login = async (data) => {
    const { phoneNumber, email, password } = await validateLoginSchema(data);
    const userEmail = await User.findOne({ email });
    const phoneNumberExists = await User.findOne({ phoneNumber });

    const user = userEmail || phoneNumberExists;
    const isValidPassword = await comparePassword(password, user.password);

    if (!user || !isValidPassword)
        throw new CustomError('Invalid Login Credentials or user does not exist', 400);

    const userDeactivatedE = await User.findOne({ email, deactivated: true });
    const userDeactivatedP = await User.findOne({ phoneNumber, deactivated: true });

    if (userDeactivatedE || userDeactivatedP)
        throw new CustomError('Your account has been deactivated, please contact the admin', 401);

    if (!user.isVerified) throw new CustomError('Please verify your email to login', 403);

    const token = generateToken({ id: user._id, isAdmin: user.isAdmin });

    return { id: user._id, token };
};

//resend email verification
const resendEmailVerificationLink = async (data) => {
    const { email } = await validatePasswordSchema(data);
    const userExists = await User.findOne({ email });

    if (!userExists)
        throw new CustomError('Email not found, please register with a valid email', 400);

    if (userExists.deactivated)
        throw new CustomError('Your account has been deactivated, please contact the admin', 401);

    if (userExists.isVerified)
        throw new CustomError(`user email '${email}' has already been verified`, 208);

    await emailVerificationLink(email, userExists.firstName);

    return { email };
};

//verify email service
const verifyEmail = async (token) => {
    //verify token validity and check if user exists
    const isTokenValid = verifyToken(token);
    //if(!isTokenValid) throw new CustomError('Token is invalid or has expired, please generate new link here');
    const userId = new ObjectId(isTokenValid.id);
    const user = await User.findById(userId);
    if (!user) throw new CustomError('User does not exist', 400);
    if (user.isVerified) throw new CustomError('email is already verified.', 208);

    await User.updateOne({ _id: userId }, { $set: { isVerified: true } });
    return;
};

//reset password link
const resetPasswordLink = async (userEmail) => {
    const { email } = await validatePasswordSchema(userEmail);
    const userExists = await User.findOne({ email });
    if (!userExists) throw new CustomError('User does not exist', 400);
    if (userExists.deactivated)
        throw new CustomError('Your account has been deactivated, please contact the admin', 401);
    const userName = userExists.firstName;
    const validEmail = userExists.email;

    await passwordVerificationLink(validEmail, userName);

    return;
};

//reset password
const resetPassword = async (token, newPassword) => {
    const isTokenValid = verifyToken(token);
    //if (!isTokenValid) throw new CustomError ('expired')
    const { password } = await validatePasswordSchema(newPassword);
    const hashedPassword = await hashPassword(password);
    const userId = new ObjectId(isTokenValid.id);
    const user = await User.findById(userId);

    if (!user || user.deactivated) throw new CustomError('User does not exis', 400);

    await User.updateOne({ _id: userId }, { $set: { password: hashedPassword } });
    return;
};

//change password
const changePassword = async (id, data) => {
    const { password, new_password } = await validatePasswordSchema(data);
    const user = await User.findById(id);
    if (!user) throw new CustomError('user does not exists', 400);
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) throw new CustomError('You have entered a wrong old password', 409);
    const hashedPassword = await hashPassword(new_password);
    await User.updateOne({ _id: id }, { $set: { password: hashedPassword } });
    return;
};

//logout

module.exports = {
    createUser,
    login,
    verifyEmail,
    resetPasswordLink,
    resetPassword,
    changePassword,
    resendEmailVerificationLink
};
