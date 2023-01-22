const router = require('express').Router();
const authController = require('../../controllers/auth.controller');
const { authorized } = require('../../middlewares/auth/auth.middlewares');

router.post('/register', authController.signUp);
router.post('/login', authController.signin);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/change-password/:id', authorized, authController.changePassword);
router.get('/resend-emailVerification', authController.resendVerificationLink);

module.exports = router;
