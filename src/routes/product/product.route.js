const router = require('express').Router();
const productController = require('../../controllers/product.controller');
const { restrictedTodAdmin } = require('../../middlewares/auth/auth.middlewares');

router.post('/', restrictedTodAdmin, productController.createProduct);
router.patch('/:id', restrictedTodAdmin, productController.updateProduct);
router.get('/products', productController.getProducts);
router.get('/:id', productController.getProductById);
router.delete('/:id', restrictedTodAdmin, productController.deleteProduct);

module.exports = router;