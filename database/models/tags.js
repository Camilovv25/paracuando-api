'use strict';
const {
  Model
} = require('sequelize');
const publicationsTags = require('./publicationsTags');
module.exports = (sequelize, DataTypes) => {
  class Tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tags.hasMany(models.PublicationsTags, { as: 'publicationTag', foreignKey: 'tag_id' });
      Tags.hasMany(models.UsersTags, { as: 'userTag', foreignKey: 'tag_id' });
    }
  }
  Tags.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING,

    }
  }, {
    sequelize,
    modelName: 'Tags',
    tableName: 'tags',
    underscored: true,
    timestamps: true
  });
  return Tags;
};