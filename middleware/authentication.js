const { User } = require('../models');
const { verifyToken } = require('../utils/jwt');
const { responseError } = require('../helpers/responseHandler');

const Authentication = async (req, res, next) => {
  try {
    const headers = req?.headers?.authorization || req?.headers?.Authorization
    if (!headers || !headers.startsWith('Bearer ')) {
      return responseError(res, 401, 'Unauthorized', 'Invalid Authorization Bearer');
    }

    const token = headers.split(' ')[1];
    
    if (!token) return responseError(res, 401, 'Unauthorized', 'Token is required');

    const verified = verifyToken(token);

    if (!verified) return responseError(res, 401, 'Unauthorized', 'Invalid Token') 

    const checkUser = await User.findOne({
      where: {
        id: verified.id
      }
    });

    if (!checkUser) return responseError(res, 401, 'Unauthorized', 'Invalid Token');

    req.user = verified;

    return next();

  } catch (error) {
    return responseError(res, 500, 'Internal Server Error', 'An error occurred')
  }
}

module.exports = Authentication;