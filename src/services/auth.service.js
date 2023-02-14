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
    const emailExists = await User.findOne({ email, isDeleted: false });
    if(emailExists && !emailExists.isVerified) throw new CustomError('email exists, activate your account to login', 409)
    if (emailExists) throw new CustomError('User with the email already exists', 409);

    const phoneNumberExists = await User.findOne({ phoneNumber, isDeleted: false });
    if(phoneNumberExists && !phoneNumberExists.isVerified) throw new CustomError('Phone number exists, activate your account to login', 409)
    if (phoneNumberExists) throw new CustomError('User with the phone number already exists', 409);

    const emailDeleted = await User.findOne({ email, isDeleted: true });
    const phoneNumberDeleted = await User.findOne({ phoneNumber, isDeleted: true });
    const hashedPassword = await hashPassword(password);

    if (emailDeleted || phoneNumberDeleted) {
        const userId = (emailDeleted && emailDeleted._id || phoneNumberDeleted && phoneNumberDeleted._id);
        await User.updateOne({_id:userId},
                {firstName,
                lastName,
                password: hashedPassword,
                email,
                phoneNumber,
                isDeleted: false,
                isVerified: false
            },           
        );
        await emailVerificationLink(email, firstName);

        return {userId, name:`${firstName} ${lastName}`, email};
    }

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
    };
    return { ...Data };
};

//login
const login = async (data) => {
    const { phoneNumber, email, password } = await validateLoginSchema(data);
    const userEmail = await User.findOne({ email, isDeleted:false });
    const phoneNumberExists = await User.findOne({ phoneNumber, isDeleted:false });

    const user = userEmail || phoneNumberExists;
    if (!user) throw new CustomError('Invalid Login Credentials or user does not exist', 400);

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) throw new CustomError('Invalid Login Credentials or user does not exist', 400);

    const userDeactivatedE = await User.findOne({ email, isDeactivated: true });
    const userDeactivatedP = await User.findOne({ phoneNumber, isDeactivated: true });

    if (userDeactivatedE || userDeactivatedP)
        throw new CustomError('Your account has been deactivated, please contact the admin', 401);

    if (!user.isVerified) throw new CustomError('Please verify your email to login', 403);

    const token = generateToken({ id: user._id, isAdmin: user.isAdmin });

    return { id: user._id, token };
};

//resend email verification
const resendEmailVerificationLink = async (data) => {
    const { email } = await validatePasswordSchema(data);
    const userExists = await User.findOne({ email, isDeleted: false });

    if (!userExists)
        throw new CustomError('Email not found', 400);

    if (userExists.isDeactivated)
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
    const userExists = await User.findOne({ email, isDeleted: false });
    if (!userExists) throw new CustomError('User not found', 400);
    if (!userExists.isVerified) throw new CustomError('User is not verified, please verify your account', 400);
    if (userExists.isDeactivated)
        throw new CustomError('Your account has been deactivated, please contact the admin', 401);
    const userName = userExists.firstName;
    const validEmail = userExists.email;

    await passwordVerificationLink(validEmail, userName);

    return;
};

//reset password
const resetPassword = async (token, newPassword) => {
    const isTokenValid = verifyToken(token);
    if(!isTokenValid) throw new CustomError('token not found, or invalid token', 400)
    const { password } = await validatePasswordSchema(newPassword);
    const hashedPassword = await hashPassword(password);
    const userId = new ObjectId(isTokenValid.id);
    const user = await User.findById(userId);
    if (!user || user.isDeleted) throw new CustomError('User not found', 400);
    if (user.isDeactivated)
        throw new CustomError('Your account has been deactivated, please contact the admin', 401);

    await User.updateOne({ _id: userId }, { $set: { password: hashedPassword } });
    return;
};

//change password
const changePassword = async (id, data) => {
    const isIdValid = (ObjectId.isValid(id))
    if (!isIdValid) throw new CustomError ('Invalid Id format');
    
    const { password, new_password } = await validatePasswordSchema(data);
    const user = await User.findById(id);
    if (!user || user.isDeleted) throw new CustomError('user does not exists', 400);
    if (user && user.isDeactivated)
        throw new CustomError('Your account has been deactivated, please contact the admin', 401);
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
