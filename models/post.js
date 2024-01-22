'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, {
        as: 'user',
        foreignKey: {
          name: 'userId'
        }
      }),
      Post.hasMany(models.Bookmark, {
        as: 'postBookmarks',
        foreignKey: {
          name: 'idPost'
        }
      })
    }
  }
  Post.init({
    title: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    image_public_id: DataTypes.STRING,
    shortDesc: DataTypes.STRING,
    description: DataTypes.TEXT,
    timestamp: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};