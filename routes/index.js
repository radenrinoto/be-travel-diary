const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoute');
const encryptionRoutes = require('./encryptionRoute');
const postRoutes = require('./postRoute');
const bookmarksRoute = require('./bookmarkRoute');

router.get('/', (req, res) => {
  res.send('ROUTES CONNECTED')
});

router.use('/user', userRoutes);
router.use('/post', postRoutes);
router.use('/encryption', encryptionRoutes);
router.use('/bookmark', bookmarksRoute);

module.exports = router;