const CryptoJS = require('crypto-js')
const dotenv = require('dotenv');
dotenv.config();

const decryptObjectPayload = (token) => {
  try {
    const bytes = CryptoJS.AES.decrypt(token, process.env.CRYPTO_SECRET)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  } catch (error) {
    return null
  }
}
const decryptTextPayload = (token) => {
  try {
    const bytes = CryptoJS.AES.decrypt(token, process.env.CRYPTO_SECRET)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    return null
  }
}

module.exports = {
  decryptObjectPayload,
  decryptTextPayload,
}
