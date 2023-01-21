const router = require('express').Router();
const productController = require('../../controllers/product.controller');
const { restrictedTodAdmin } = require('../../middlewares/auth/auth.middlewares');

router.post('/', productController.createProduct);
router.patch('/:id', productController.updateProduct);
router.get('/products', productController.getProducts);
router.get('/:id', productController.getProductById);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
