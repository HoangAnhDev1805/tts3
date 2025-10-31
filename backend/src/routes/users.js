const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticate, isAdmin } = require('../middlewares');
const { validate, schemas } = require('../utils/validation');

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', isAdmin, UserController.getAll);
router.get('/stats', isAdmin, UserController.getStats);
router.post('/', isAdmin, validate(schemas.createUser), UserController.create);
router.delete('/:id', isAdmin, UserController.delete);
router.patch('/:id/extend', isAdmin, UserController.extend);

// User or Admin
router.get('/:id', UserController.getById);
router.patch('/:id', validate(schemas.updateUser), UserController.update);
router.patch('/:id/password', validate(schemas.changePassword), UserController.changePassword);

module.exports = router;
