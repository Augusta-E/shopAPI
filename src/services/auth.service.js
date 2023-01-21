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

    //  if (emailExists && emailExists.deactivated || phoneNumberExists && phoneNumberExists.deactivated)
    //      throw new CustomError('User has been deactivated, please reactivate your account', 409);

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

const login = async (data) => {
    const { phoneNumber, email, password } = await validateLoginSchema(data);
    const userEmail = await User.findOne({ email, deactivated: false });

    const userPhoneNumber = await User.findOne({ phoneNumber, deactivated: false });
    const user = userEmail || userPhoneNumber;
    const isValidPassword = await comparePassword(password, user.password);

    if (!user || !isValidPassword)
        throw new CustomError('Invalid Login Credentials or user does not exist', 400);

    if (!user.isVerified) throw new CustomError('Please verify your email to login', 403);

    const token = generateToken({ id: user._id, isAdmin: user.isAdmin });

    return { token };
};

const resendEmailVerificationLink = async (userEmail) => {
    const { email } = await validatePasswordSchema(userEmail);
    const userExists = await User.findOne({ email, deactivated: false });

    if (!userExists)
        throw new CustomError('Email not found, please register with a valid email', 400);

    if (userExists.isVerified)
        throw new CustomError(`user email '${email}' has already been verified`);

    await emailVerificationLink(email, userExists.firstName);

    return;
};

const verifyEmail = async (token) => {
    const isTokenValid = verifyToken(token);
    //if(!isTokenValid) throw new CustomError('Token is invalid or has expired, please generate new link here');

    const userId = new ObjectId(isTokenValid.id);
    const user = await User.findById(userId);
    if (!user || user.deactivated) throw new CustomError('User does not exis', 400);

    if (user.isVerified) throw new CustomError('email is already verified.', 403);

    await User.updateOne({ isVerified: true });

    return;
};

//reset password link
const resetPasswordLink = async (userEmail) => {
    const { email } = await validatePasswordSchema(userEmail);
    const userExists = await User.findOne({ email, deactivated: false });
    if (!userExists) throw new CustomError('User does not exist', 400);
    const userName = userExists.firstName;
    const validEmail = userExists.email;

    await passwordVerificationLink(validEmail, userName);

    return;
};

//reset password
const resetPassword = async (token, userPassword) => {
    const isTokenValid = verifyToken(token);
    //if (!isTokenValid) throw new CustomError ('expired')
    const { password } = await validatePasswordSchema(userPassword);
    const hashedPassword = await hashPassword(password);
    const userId = new ObjectId(isTokenValid.id);
    const user = await User.findById(userId);

    if (!user || user.deactivated) throw new CustomError('User does not exis', 400);

    await User.updateOne({ password: hashedPassword });
    return;
};

//change password
const changePassword = async (id, data) => {
    const { password, new_password } = await validatePasswordSchema(data);
    const user = await User.findById(id);
    if (!user) throw new CustomError('user does not exists', 400);
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) throw new CustomError('Sorry, you have entered a wrong password', 400);
    const hashedPassword = await hashPassword(new_password);
    await User.updateOne({ password: hashedPassword });
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
