const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

router.get('/register', ensureAuthenticated, ensureRole('student'), eventController.showRegisterEvent);

module.exports = router;