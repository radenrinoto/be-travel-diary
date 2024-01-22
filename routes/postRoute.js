const express = require('express');
const router = express.Router();

const uploadMedia = require('../middleware/uploadMedia');
const {
  createPost,
  getMyPost,
  getAllPost,
  removePost,
  getDetailPost
} = require('../controllers/postController');

const Authentication = require('../middleware/authentication');

router.get('/', getAllPost);
router.get('/detail/:id', getDetailPost)
router.post('/create', Authentication, uploadMedia.fields([{ name: 'imageUrl', maxCount: 1 }]), createPost);
router.get('/my-post', Authentication, getMyPost);
router.delete('/remove/:id', Authentication, removePost);

module.exports = router;
