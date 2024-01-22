const { User } = require('../models');
const { Op } = require('sequelize')

const { comparePassword } = require('../utils/bcryptPassword');
const { decryptTextPayload } = require('../utils/decryptPayload');
const { generateToken } = require('../utils/jwt');

const { validateRegisterBody, validateLoginBody } = require('../helpers/validationHelper');
const { responseError, responseSuccess } = require('../helpers/responseHandler');

exports.register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) 
      return responseError(res, 400, 'Validation Error', 'Fullname, email and password are required');

    const decryptedFullname = decryptTextPayload(fullname);
    const decryptedEmail = decryptTextPayload(email);
    const decryptedPassword = decryptTextPayload(password);

    const validate = validateRegisterBody({
      fullname: decryptedFullname,
      email: decryptedEmail,
      password: decryptedPassword
    });

    if (validate) return responseError(res, 400, 'Validation Error', validate);

    const userExisted = await User.findOne({
      where: {
        [Op.or]: [
          { fullname: decryptedFullname },
          { email: decryptedEmail }
        ]
      }
    });

    if (userExisted) return responseError(res, 400, 'Bad Request', 'Email or Fullname already Exists')

    await User.create({
      fullname: decryptedFullname,
      email: decryptedEmail,
      password: decryptedPassword
    });

    return responseSuccess(res, 201, 'Register Success');
  } catch (error) {
    return responseError(res, 500, 'Internal Server Error', 'An error occurred');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return responseError(res, 400, 'Validation Error', 'Email and Password are required');

    const decryptedEmail = decryptTextPayload(email);
    const decryptedPassword = decryptTextPayload(password);

    const validate = validateLoginBody({
      email: decryptedEmail,
      password: decryptedPassword
    });

    if (validate) return responseError(res, 400, 'Validation Error', validate);

    const user = await User.findOne({ where: {
      email: decryptedEmail
    }})

    if (!user) return responseError(res, 404, 'Not Found', 'User Not Found');

    const checkPassword = comparePassword(decryptedPassword, user.password);

    if (!checkPassword) return responseError(res, 400, 'Bad Request', 'Invalid Password');

    const accessToken = generateToken({
      id: user.id,
      email: user.email,
      fullname: user.fullname
    });
    return responseSuccess(res, 200, 'Success', { token: accessToken });
  } catch (error) {
    return responseError(res, 500, 'Internal Server Error', 'An error occurred');
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userData = await User.findOne({
      where: {
        id: req.user.id
      },
      attributes: {
        exclude: ['id', 'password', 'image_public_id', 'createdAt', 'updatedAt']
      }
    });

    if (!userData) return responseError(res, 404, 'Not Found', 'User Not Found');

    return responseSuccess(res, 200, 'Success', { profile: userData })
  } catch (error) {
    return responseError(res, 500, 'Internal Server Error', 'An error occurred');
  }
}
