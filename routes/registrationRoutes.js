const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

router.post('/register', ensureAuthenticated, ensureRole('student'), registrationController.registerEvent);
router.post('/cancel', ensureAuthenticated, ensureRole('student'), registrationController.cancelRegistration);
router.get('/list', ensureAuthenticated, ensureRole('admin'), registrationController.listRegistrations);
router.get('/search', ensureAuthenticated, ensureRole('admin'), registrationController.searchRegistrations);

module.exports = router;