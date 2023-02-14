const router = require('express').Router();
const userController = require('../../controllers/user.controller');
const { authorized, restrictedTodAdmin } = require('../../middlewares/auth/auth.middlewares');

router.patch('/:id', authorized, userController.updateUser);
router.get('/users', restrictedTodAdmin, userController.getUsers);
router.get('/:id', restrictedTodAdmin, userController.getUserById);
router.patch('/deactivate/:id', restrictedTodAdmin, userController.deactivateUser);
router.patch('/reactivate/:id', restrictedTodAdmin, userController.reactivateUser);
router.delete('/:id', authorized, userController.deleteUser);

module.exports = router;
