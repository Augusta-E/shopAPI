const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const authRoute = require('./auth/auth.route');
const userRoute = require('./user/user.route');
const productRoute = require('./product/product.route');
const swaggerRoute = require('./swagger');

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/product', productRoute);
router.use('/docs', swaggerUi.serve, swaggerRoute);

module.exports = router;
