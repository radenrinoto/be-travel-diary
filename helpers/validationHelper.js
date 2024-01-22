const Joi = require('joi');

const validateRegisterBody = (reqBody) => {
  const schema = Joi.object({
    fullname: Joi.string().min(3).required().messages({
      'string.base': 'fullname must be a string',
      'string.min': 'fullname must be at least three digits long',
      'any.required': 'fullname is required',
    }),
    email: Joi.string()
      .email({
        tlds: { allow: false },
      })
      .required()
      .messages({
        'string.base': 'email must be a string.',
        'string.empty': 'email is required.',
        'string.email': 'email must be a valid email address.',
        'any.required': 'email is required.',
      }),
    password: Joi.string().min(6).required(),
  })

  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}

const validateLoginBody = (reqBody) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        tlds: { allow: false },
      })
      .required()
      .messages({
        'string.base': 'email must be a string.',
        'string.empty': 'email is required.',
        'string.email': 'email must be a valid email address.',
        'any.required': 'email is required.',
      }),
    password: Joi.string().min(6).required(),
  })

  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}

const validateCreatePostBody = (reqBody) => {
  const schema = Joi.object({
    title: Joi.string().required().messages({
      'string.base': 'title must be a string.',
      'string.empty': 'title is required.',
      'any.required': 'title is required.',
    }),
    shortDesc: Joi.string().required().messages({
      'string.base': 'short description must be a string.',
      'string.empty': 'short description is required.',
      'any.required': 'short description is required.',
    }),
    description: Joi.string().required().messages({
      'string.base': 'description must be a string.',
      'string.empty': 'description is required.',
      'any.required': 'description is required.',
    }),
  })

  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}

const validateCreateBookmarkBody = (reqBody) => {
  const schema = Joi.object({
    postId: Joi.string().required().messages({
      'string.base': 'postId must be a string.',
      'string.empty': 'postId is required.',
      'any.required': 'postId is required.',
    }),
  })

  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}

const validateBodyUpdateUserProfile = reqBody => {
  const schema = Joi.object({
    profileImage: Joi.string().allow(null, '').invalid(Joi.number()).messages({
      'string.base': 'profileImage should be a string.',
      'any.only': 'profileImage should be a string or null.',
      'any.invalid': 'profileImage cannot be a number.',
    }),
  })
  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}

module.exports = {
  validateRegisterBody,
  validateLoginBody,
  validateCreatePostBody,
  validateCreateBookmarkBody,
  validateBodyUpdateUserProfile
}