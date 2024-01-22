const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (data) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  return jwt.sign(data, secretKey);
}

const verifyToken = (data) => {
  const secreteKey = process.env.JWT_SECRET_KEY;
  return jwt.verify(data, secreteKey);
}

module.exports = {
  generateToken,
  verifyToken
}
