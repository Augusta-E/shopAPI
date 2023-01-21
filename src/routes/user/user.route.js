const router = require('express').Router();
const userController = require('../../controllers/user.controller');
const { authorized, restrictedTodAdmin } = require('../../middlewares/auth/auth.middlewares');

router.patch('/:id', authorized, userController.updateUser);
router.get('/users', userController.getUsers);
router.get('/:id', restrictedTodAdmin, userController.getUserById);
router.put('/:id', authorized, userController.deactivateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
