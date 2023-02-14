const router = require('express').Router();
const cartController = require('../../controllers/cart.controller');
const { authorized } = require('../../middlewares/auth/auth.middlewares');

router.post('/', authorized, cartController.createCart);
router.get('/:id', authorized, cartController.getCart);
router.delete('/:id', authorized, cartController.deleteCart);

module.exports = router;
