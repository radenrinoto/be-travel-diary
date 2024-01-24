const moment = require('moment');
const { Op } = require('sequelize')

const { Post, User } = require('../models');

const { uploadToCloudinary, cloudinaryDeleteImg } = require("../utils/cloudinary");

const { responseSuccess, responseError } = require('../helpers/responseHandler');
const { validateCreatePostBody } = require('../helpers/validationHelper');

exports.createPost = async (req, res) => {
  let imageResult;
  try {
    if (req?.fileValidationError)
      return responseError(
        res,
        400,
        'Bad Request',
        req.fileValidationError.message
      );
    if (!req?.files?.imageUrl)
      return responseError(res, 400, 'Validation Failed', 'Image is required');

    const { title, shortDesc, description } = req.body;

    const validate = validateCreatePostBody({ title, shortDesc, description });

    if (validate) return responseError(res, 400, 'Validation Error', validate);

    imageResult = await uploadToCloudinary(req.files.imageUrl[0], 'image');

    if (!imageResult?.url)
      return responseError(res, 500, 'Internal server error', imageResult.error)

    const timestamp = moment().format('DD-MMMM-YYYY').split('-').join(' ');

    await Post.create({
      title,
      shortDesc,
      description,
      imageUrl: imageResult?.url,
      image_public_id: imageResult?.public_id,
      timestamp,
      userId: req.user.id
    })

    return responseSuccess(res, 201, 'Success', 'Successfuly create post');
  } catch (error) {
    if (imageResult?.public_id) {
      await cloudinaryDeleteImg(imageResult.public_id, 'image')
    }
    return responseError(res, 500, 'Internal Server Error', 'An error occurred');
  }
}

exports.getMyPost = async (req, res) => {
  try {
    const myPost = await Post.findAll({
      where: {
        userId: req?.user?.id
      },
      attributes: {
        exclude: ['userId', 'createdAt', 'updatedAt', 'image_public_id']
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['fullname']
        }
      ]
    })

    return responseSuccess(res, 200, 'Success', myPost);
  } catch (error) {
    return responseError(res, 500, 'Internal Server Error', 'An error occurred');
  }
}

exports.getAllPost = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['fullname']
        }
      ],
      attributes: {
        exclude: ['userId', 'image_public_id', 'createdAt', 'updatedAt']
      }
    })
    return responseSuccess(res, 200, 'Success', posts)
  } catch (error) {
    return responseError(res, 500, 'Internal Server Error', 'An error occurred')
  }
}

exports.removePost = async (req, res) => {
  try {
    const { id } = req?.params;
    const userId = req?.user?.id;

    const post = await Post.findOne({
      where: {
        id: id
      }
    })
    if (!post) return responseError(res, 404, 'Not Found', 'Post Not Found');

    if (post?.userId !== userId) return responseError(res, 403, 'Unauthorized', 'Forbidden access');
    const removePost = post.destroy()
    const removeImage = await cloudinaryDeleteImg(post.public_id, 'image')

    await Promise.all([removeImage, removePost]);

    return responseSuccess(res, 200, 'Success');
  } catch (error) {
    return responseError(res, 500, 'Internal Server Error', 'An error occurred')
  }
}

exports.getDetailPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findOne({
      where: {
        id: id
      },
      attributes: {
        exclude: ['userId', 'createdAt', 'updatedAt', 'image_public_id']
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['fullname']
        }
      ]
    })

    if (!post) return responseError(res, 404, 'Not Found', 'Post not found')

    return responseSuccess(res, 200, 'Success', post);
  } catch (error) {
    return responseError(res, 500, 'Internal Server Error', 'An error occurred')
  }
}