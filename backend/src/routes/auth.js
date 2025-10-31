const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticate } = require('../middlewares');
const { validate, schemas } = require('../utils/validation');

// Public routes
router.post('/login', validate(schemas.login), AuthController.login);
router.post('/trial', AuthController.createTrial);
router.post('/refresh', AuthController.refresh);

// Protected routes
router.get('/me', authenticate, AuthController.me);
router.post('/logout', authenticate, AuthController.logout);

module.exports = router;
