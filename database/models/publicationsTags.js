'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PublicationsTags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PublicationsTags.belongsTo(models.Tags, {as: 'tag', foreignKey: 'tag_id'});
      PublicationsTags.belongsTo(models.Publications, {as: 'publication', foreignKey: 'publication_id'});
    }
  }
  PublicationsTags.init({
    tag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'Tags',
        key: 'id'
      }
    },
    publication_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Publications',
        key: 'id'
      }
    } 
  }, {
    sequelize,
    modelName: 'PublicationsTags',
    tableName: 'PublicationsTags',
    underscored: true,
    timestamps: true
  });
  return PublicationsTags;
};