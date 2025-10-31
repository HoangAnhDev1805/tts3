const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/MessageController');
const { authenticate, notTrial, checkExpiry } = require('../middlewares');
const { validate, schemas } = require('../utils/validation');

// All routes require authentication
router.use(authenticate);
router.use(checkExpiry);
router.use(notTrial);

router.get('/', MessageController.getAll);
router.get('/stats', MessageController.getStats);
router.post('/parse', validate(schemas.parseMessage), MessageController.parse);
router.post('/', validate(schemas.createMessage), MessageController.create);
router.get('/:id', MessageController.getById);
router.patch('/:id', MessageController.update);
router.delete('/:id', MessageController.delete);
router.post('/:id/process', MessageController.processResult);

module.exports = router;
