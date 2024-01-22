const express = require('express');
const router = express.Router();

const { register, login, getProfile } = require('../controllers/userController');
const Authentication = require('../middleware/authentication');

router.post('/register', register);
router.post('/login', login);
router.get('/get-profile', Authentication, getProfile)

module.exports = router