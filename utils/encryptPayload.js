const { AES } = require('crypto-js')

const encryptPayload = data => {
  try {
    if (typeof data === 'object') {
      return AES.encrypt(JSON.stringify(data), process.env.CRYPTO_SECRET).toString()
    }
    if (typeof data === 'string') {
      return AES.encrypt(data, process.env.CRYPTO_SECRET).toString()
    }
  } catch (error) {
    Promise.reject(error)
  }
}

module.exports = encryptPayload
