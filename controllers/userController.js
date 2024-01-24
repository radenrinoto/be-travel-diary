const { User } = require('../models');
const { Op } = require('sequelize');

const { uploadToCloudinary, cloudinaryDeleteImg } = require("../utils/cloudinary");
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

    const user = await User.findOne({
      where: {
        email: decryptedEmail
      },
      attributes: {
        exclude: ['image_public_id', 'createdAt', 'updatedAt']
      }
    })

    if (!user) return responseError(res, 404, 'Not Found', 'User Not Found');

    const checkPassword = comparePassword(decryptedPassword, user.password);

    if (!checkPassword) return responseError(res, 400, 'Bad Request', 'Invalid Password');

    const accessToken = generateToken({
      id: user.id,
      email: user.email,
      fullname: user.fullname
    });

    const dataUser = {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      profileImage: user.profileImage
    }

    return responseSuccess(res, 200, 'Success', { token: accessToken, user: dataUser });
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

exports.updateUserProfile = async (req, res) => {
  let imageResult
  try {
    if (req.fileValidationError)
      return responseError(
        res,
        400,
        'Bad Request',
        req.fileValidationError.message
      )

    if (!req?.files?.profileImage)
      return responseError(res, 400, 'Validation Failed', 'Image is required')

    imageResult = await uploadToCloudinary(req?.files?.profileImage[0], 'image')

    if (!imageResult?.url)
      return responseError(res, 500, 'Internal server error', imageResult)

    const authData = req.user

    const response = await User.update(
      { profileImage: imageResult?.url, image_public_id: imageResult?.public_id },
      {
        where: {
          id: authData.id,
        },
      }
    )

    if (!response.length && imageResult?.public_id) {
      await cloudinaryDeleteImg(imageResult.public_id, 'image')
      return responseError(res, 404, 'Not Found', 'User not found')
    }

    return responseSuccess(res, 200, 'success')
  } catch (error) {
    if (imageResult?.public_id) {
      await cloudinaryDeleteImg(imageResult.public_id, 'image')
    }

    return responseError(res, error?.status, error?.message)
  }
}
