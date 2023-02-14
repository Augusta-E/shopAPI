const router = require('express').Router();
const orderController = require('../../controllers/order.controller');
const { restrictedTodAdmin, authorized } = require('../../middlewares/auth/auth.middlewares');

router.patch('/order/:id', authorized, orderController.placeOrder);
router.get('/orders', restrictedTodAdmin, orderController.getOrders);
router.get('/monthlyStats', restrictedTodAdmin, orderController.monthlySales);
router.get('/:id', authorized, orderController.getOrder);
router.get('/history', authorized, orderController.orderHistory);
router.get('/Stat', restrictedTodAdmin, orderController.orderCount);
router.get('/orders/sales', restrictedTodAdmin, orderController.totalSales);
router.get('/salesStats', restrictedTodAdmin, orderController.monthlyCount);

module.exports = router;
