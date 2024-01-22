const bcrypt = require('bcryptjs')

const salt = bcrypt.genSaltSync(10)

const hashPassword = password => {
  return bcrypt.hashSync(password, salt)
}

const comparePassword = (currPass, hashPass) => {
  return bcrypt.compareSync(currPass, hashPass)
}

module.exports = { hashPassword, comparePassword }
