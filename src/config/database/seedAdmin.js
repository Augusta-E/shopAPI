const UserService = require('../../services/auth.service');

const seedAdmin = async () => {
    const user = await UserService.createUser(
        {
            firstName: 'Admin',
            lastName: 'Admin',
            phoneNumber: '07025364782',
            email: 'shop@gmail.com',
            password: 'password'
        },
        { timestamps: true }
    );
    console.log(user);
};

module.exports = seedAdmin;
