const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/ContactController');
const { authenticate, notTrial, checkExpiry } = require('../middlewares');
const { validate, schemas } = require('../utils/validation');

// All routes require authentication
router.use(authenticate);
router.use(checkExpiry);
router.use(notTrial);

router.get('/', ContactController.getAll);
router.get('/:id', ContactController.getById);
router.post('/', validate(schemas.createContact), ContactController.create);
router.patch('/:id', validate(schemas.updateContact), ContactController.update);
router.delete('/:id', ContactController.delete);
router.patch('/:id/pricing', ContactController.updatePricing);
router.patch('/:id/debt', ContactController.updateDebt);

module.exports = router;
