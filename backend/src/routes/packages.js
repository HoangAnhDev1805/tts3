const express = require('express');
const router = express.Router();
const PackageController = require('../controllers/PackageController');
const { authenticate, isAdmin, optionalAuth } = require('../middlewares');
const { validate, schemas } = require('../utils/validation');

// Public routes
router.get('/', optionalAuth, PackageController.getAll);
router.get('/:id', optionalAuth, PackageController.getById);

// Admin only routes
router.post('/', authenticate, isAdmin, validate(schemas.createPackage), PackageController.create);
router.patch('/:id', authenticate, isAdmin, PackageController.update);
router.delete('/:id', authenticate, isAdmin, PackageController.delete);

module.exports = router;
