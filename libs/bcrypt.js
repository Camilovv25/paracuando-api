const bcrypt = require('bcrypt')
const { CustomError } = require('../utils/helpers')

const hashPassword = (plainPassword) => {
  console.log('plainPassword in hashPassword:', plainPassword);
  if (!plainPassword) {
    throw new CustomError('Password not provided for hash', 400, 'Bad Request')
  }
  return bcrypt.hashSync(plainPassword, 8)
}

const comparePassword = (plainPassword, hashedPassword) => {
  console.log('plainPassword in comparePassword:', plainPassword);
  console.log('hashedPassword in comparePassword:', hashedPassword);
  if (!plainPassword) {
    throw new CustomError('Password not provided for compare', 400, 'Bad Request')
  }
  if (!hashedPassword) {
    throw new CustomError('The user account is not well setted, contact admin', 409, 'Bad Behaviour')
  }
  let provePassword = bcrypt.compareSync(plainPassword, hashedPassword)
  if (provePassword) return provePassword
  else throw new CustomError('Wrong Credentials', 401, 'Unauthorized')
}

module.exports = {
  hashPassword,
  comparePassword
}
