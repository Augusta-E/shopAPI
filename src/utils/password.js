const bcrypt = require('bcrypt');
const config = require('../config/index');

const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
    const passwordIsValid = await bcrypt.compare(password, hashedPassword);
    return passwordIsValid;
};
module.exports = {
    hashPassword,
    comparePassword
};
