const { Post, User, Bookmark } = require('../models');
const _ = require('lodash');

const { responseSuccess, responseError } = require('../helpers/responseHandler');
const { validateCreateBookmarkBody } = require('../helpers/validationHelper')

exports.getBookmark = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const bookmarks = await Bookmark.findAll({
      where: {
        idUser: userId
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      include: [
        {
          model: User,
          as: 'userBookmarks',
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt']
          }
        },
        {
          model: Post,
          as: 'postBookmarks',
          attributes: {
            exclude: ['userId', 'createdAt', 'updatedAt']
          }
        }
      ]
    })
    return responseSuccess(res, 200, 'Success', bookmarks)
  } catch (error) {
    return responseError(res, 500, 'Internal Server Error', 'An error occurred');
  }
}

exports.createBookmark = async (req, res) => {
  try {
    const { postId } = req?.body;
    const userId = req?.user?.id;

    const validate = validateCreateBookmarkBody({ postId });

    if (validate) return responseError(res, 400, 'Validation Error', validate)

    const checkPost = await Post.findOne({
      where: {
        id: postId
      }
    });

    if (!checkPost) return responseError(res, 404, 'Not Found', 'Post not found');

    const checkBookmark = await Bookmark.findAll({
      where: {
        idPost: postId
      }
    })

    if (!_.isEmpty(checkBookmark)) return responseError(res, 400, 'Bad Request', 'Post with this id already bookmarked')

    await Bookmark.create({
      idUser: userId,
      idPost: postId
    })

    return responseSuccess(res, 201, 'Success', 'Post added to bookmark');
  } catch (error) {
    return responseError(res, 500, 'Internal Server Error', 'An error occurred');
  }
}

exports.removeBookmark = async (req, res) => {
  try {
    const { id } = req?.params;
    const userId = req?.user?.id;

    const bookmark = await Bookmark.findOne({
      where: [
        { idPost: id },
        { idUser: userId },
      ]
    })

    if (!bookmark) return responseError(res, 404, 'Not Found', 'Post Not Found');

    if (bookmark?.idUser !== userId) return responseError(res, 403, 'Unauthorized', 'Forbidden access');
    bookmark.destroy()

    return responseSuccess(res, 200, 'Success');
  } catch (error) {
    return responseError(res, 500, 'Internal Server Error', 'An error occurred')
  }
}