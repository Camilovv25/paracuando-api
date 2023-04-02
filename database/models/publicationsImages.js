'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PublicationsImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PublicationsImages.belongsTo(models.Publications, { as: 'publication', foreignKey: 'publication_id' })
    }
  }
  PublicationsImages.init({
    publication_id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    image_url: {
      type: DataTypes.TEXT,
      primaryKey: true
    },
    order: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 3
      }
    },
  }, {
    sequelize,
    modelName: 'PublicationsImages',
    tableName: 'publications_images',
    underscored: true,
    timestamps: true
  });
  return PublicationsImages;
};