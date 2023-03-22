'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsersTags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UsersTags.belongsTo(models.Tags,{as: 'tag',foreignKey: 'tag_id'});
      UsersTags.belongsTo(models.Users,{as: 'user',foreignKey: 'user_id'});
    }
  }
  UsersTags.init({

    tag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    } ,
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'UsersTags',
    tableName: 'users_tags',
    underscored: true,
    timestamps: true
  });
  return UsersTags;
};