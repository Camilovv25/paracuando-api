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
      // define association here
      PublicationsImages.belongsTo(models.Publications, {as: 'publication', foreignKey: 'publication_id'});
    }
  }
  PublicationsImages.init({
    publication_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Publications',
        key: 'id'
      }
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false 
    }
  }, {
    sequelize,
    modelName: 'PublicationsImages',
    tableName: 'PublicationsImages',
    underscored: true,
    timestamps: true
  });
  return PublicationsImages;
};