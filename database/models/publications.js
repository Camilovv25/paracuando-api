'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Publications.belongsTo(models.Users, {as: 'user', foreignKey: 'user_id'});
      Publications.belongsTo(models.PublicationsTypes, {as: 'publication_type', foreignKey: 'publication_type_id'});
      Publications.belongsTo(models.Cities, {as: 'city', foreignKey: 'city_id'});
      Publications.hasMany(models.PublicationImages, {as: 'publication_image', foreignKey: 'publication_id' });
      Publications.belongsToMany(models.Users, {as: 'vote', through: models.Votes, foreignKey: 'publication_id'});
      Publications.belongsToMany(models.Tags, {as: 'publication_tag', through: models.PublicationsTags, foreignKey: 'publication_id'});
    }
  }
  Publications.init({
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
          references: {
            model:'Users',
            key: 'id'
          }
    },
    publication_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
          references: {
            model: 'PublicationsTypes',
            key: 'id'
          }
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
          references: {
            model: 'Cities',
            key: 'id'
          }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    reference_link: {
      type: DataTypes.TEXT,
      allowNull: false 
    }
  }, {
    sequelize,
    modelName: 'Publications',
    tableName: 'publications',
    underscored: true,
    timestamps: true,
    scopes: {
      public_view: {
        attributes: []
      },
      no_timestamps:{
        attributes: {exclude: ['created_at', 'updated_at']}
      }
    }
  });
  return Publications;
};