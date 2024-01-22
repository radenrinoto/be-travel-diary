const express = require('express');
const router = express.Router();

const encryptPayload = require('../utils/encryptPayload');

router.get('/', (req, res) => {
  const response = {
    fullname: encryptPayload('dummy'),
    email: encryptPayload('dummy@mail.com'),
    password: encryptPayload('123123'),
  }

  res.status(200).json(response)
})

module.exports = router