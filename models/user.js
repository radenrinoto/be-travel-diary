'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../utils/bcryptPassword');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, {
        as: 'posts',
        foreignKey: {
          name: 'userId'
        }
      }),
      User.hasMany(models.Bookmark, {
        as: 'userBookmarks',
        foreignKey: {
          name: 'idUser'
        }
      })
    }
  }
  User.init({
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    profileImage: DataTypes.STRING,
    image_public_id: DataTypes.STRING,
  }, {
    hooks: {
      beforeCreate: (user) => {
        user.password = hashPassword(user.password)
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};