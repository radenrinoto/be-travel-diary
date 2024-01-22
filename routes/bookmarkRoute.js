const express = require('express');
const router = express.Router();

const {
  getBookmark,
  createBookmark,
  removeBookmark
} = require('../controllers/bookmarkController');
const Authentication = require('../middleware/authentication');

router.get('/', Authentication, getBookmark);
router.post('/create', Authentication, createBookmark);
router.delete('/remove/:id', Authentication, removeBookmark)

module.exports = router;