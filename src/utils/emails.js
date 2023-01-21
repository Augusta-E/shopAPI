//const mail = require('./mailProvider');
const { mail } = require('./mailProvider');
require('dotenv').config();
const { emailVerificationToken } = require('./token');
const User = require('../models/User.model');

let hostURL = 'https://shopAPI.com';
if (process.env.NODE_ENV === 'development') {
    hostURL = `http://localhost:${process.env.PORT || 3000}`;
}

// const sendVerificationEmail = async (email, username, token) => {
//     const link = `${hostURL}/verify-email/${token}`;
//     await check(
//         {   from: 'ehiheboloaugustar@gmail.com',
//             to: email,
//             subject: `Welcome to shopAPI ${username}! please Verify Your Email`,
//             text: 'and easy to do anywhere, even with Node.js',
//             html: `<div style ="background-color: rgb(227, 223, 222); width:100%">
//     <div style= "display: flex; padding-top: 50px; ">
//       <div style= "line-height: 1.6; margin: auto; text-align: left; width: 50%; padding-top: 50px; background-color: white; margin-bottom:20px;">
//       <div><p style ="text-align: center; font-size: 40px; margin: auto; width: 70%; padding-bottom:50px">Welcome to Know Africa!</p></div>
//       <p style="margin: 10px">Dear <strong>${username}</strong>,</p>
//       <div style="margin: 10px">
//           <p>Thank you for joining Know Africa. We look forward to sharing the many beauties of Africa with you! <br> Please click the button below to confirm you own this email address</p>
//         </div>
//             <a href="${link}" style ="text-decoration:none; padding:5px 15px;color:white;background-color:rgb(75,203,250);font-weight:bold; border-radius:30px;
//             margin: 18px; width:40%;">Verify Me</a>
//               <div style= "padding-top:20px; margin-bottom: 20px; display:flex; justify-content:center">
//             <p style = "font-variant: small-caps; opacity: 0.5; margin: 10px;">Regards, ShopAPI Team!</p>
//           </div>
//       </div>
//   </div>`
//         },
//     );
//     return;
// };
// module.exports = { sendVerificationEmail };

const emailVerificationLink = async (email, username) => {
    try {
        const user = await User.findOne({ email });
        const token = emailVerificationToken({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`
        });
        const link = `${hostURL}/api/v1/auth/verify-email/${token}`;
        mail({
            from: process.env.GMAIL_ID,
            to: email,
            subject: `Welcome to shopAPI ${username}! please Verify Your Email`,
            html: `<div style ="background-color: rgb(227, 223, 222); width:100%">
    <div style= "display: flex; padding-top: 10px; ">
      <div style= "line-height: 1.6; margin: auto; text-align: left; padding-top: 20px; background-color: white; margin-bottom:20px;">
      <div><p style ="text-align: center; font-size: 40px; margin: auto; width: 70%; padding-bottom:50px">Welcome to ShopAPI!</p></div>
      <p style="margin: 10px">Dear <strong>${username}</strong>,</p> 
      <div style="margin: 10px">
          <p>Thank you for joining shopAPI. We look forward to giving you our best! <br> Please click the button below to confirm you own this email address</p>
        </div>
            <a href="${link}" style ="text-decoration:none; padding:5px 15px;color:white;background-color:rgb(75,203,250);font-weight:bold; border-radius:30px;
            margin: 18px; width:40%;">Verify Me</a>
              <div style= "padding-top:20px; margin-bottom: 10px; display:flex; justify-content:center">
            <p style = "font-variant: small-caps; opacity: 0.5; margin: 10px;">Regards, ShopAPI Team!</p>
          </div>
      </div>
  </div>`
        });
    } catch (error) {
        return error;
    }
    return mail;
};

const passwordVerificationLink = async (email, username) => {
    try {
        const user = await User.findOne({ email });
        const token = emailVerificationToken({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`
        });
        const link = `${hostURL}/api/v1/auth/reset-password/${token}`;
        mail({
            from: process.env.GMAIL_ID,
            to: email,
            subject: `Hello ${username}! please reset your password`,
            html: `<div style ="background-color: rgb(227, 223, 222); width:100%">
  <div style= "display: flex; padding-top: 10px; ">
    <div style= "line-height: 1.6; margin: auto; text-align: left; padding-top: 20px; background-color: white; margin-bottom:20px;">
    <div><p style ="text-align: center; font-size: 40px; margin: auto; width: 80%; padding-bottom:10px">Reset Your Password</p></div>
    <p style="margin: 10px">Dear <strong>${username}</strong>,</p> 
    <div style="margin: 10px">
        <p>Please click the button below to reset your password</p>
      </div>
          <a href="${link}" style ="text-decoration:none; padding:5px 15px;color:white;background-color:rgb(75,203,250);font-weight:bold; border-radius:30px;
          margin: 18px; width:40%;">reset password</a>
            <div style= "padding-top:20px; margin-bottom: 10px; display:flex; justify-content:center">
          <p style = "font-variant: small-caps; opacity: 0.5; margin: 10px;">Regards, ShopAPI Team!</p>
        </div>
    </div>
</div>`
        });
    } catch (error) {
        return error;
    }
    return mail;
};
module.exports = { emailVerificationLink, passwordVerificationLink };
