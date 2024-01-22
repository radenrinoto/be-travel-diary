const express = require('express');
const router = express.Router();

const uploadMedia = require('../middleware/uploadMedia');
const {
  register,
  login,
  getProfile,
  updateUserProfile
} = require('../controllers/userController');
const Authentication = require('../middleware/authentication');

router.post('/register', register);
router.post('/login', login);
router.get('/get-profile', Authentication, getProfile);
router.patch(
  '/update/profile',
  Authentication,
  uploadMedia.fields([{ name: 'profileImage', maxCount: 1 }]),
  updateUserProfile
)

module.exports = router