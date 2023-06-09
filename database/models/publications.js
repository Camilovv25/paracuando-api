'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publications extends Model {
    static associate(models) {
      Publications.belongsTo(models.Users, { as: 'user', foreignKey: 'user_id' });
      Publications.belongsTo(models.PublicationsTypes, { as: 'publication_type', foreignKey: 'publication_type_id' });
      Publications.belongsTo(models.Cities, { as: 'city', foreignKey: 'city_id' });
      Publications.hasMany(models.PublicationsImages, { as: 'images', foreignKey: 'publication_id' });
      Publications.belongsToMany(models.Users, { as: 'same_vote', foreignKey: 'publication_id', through: models.Votes })
      Publications.belongsToMany(models.Users, { as: 'vote', foreignKey: 'publication_id', through: models.Votes })
      Publications.belongsToMany(models.Tags, { as: 'filtered_tags', foreignKey: 'publication_id', through: models.PublicationsTags })
      Publications.belongsToMany(models.Tags, { as: 'tags', through: models.PublicationsTags, foreignKey: 'publication_id', otherKey: 'tag_id' });
    }
  }
  Publications.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
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
      // this is auto-selected by the backend
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
      no_timestamps: {
        attributes: { exclude: ['created_at', 'updated_at'] }
      }
    }
  });
  return Publications;
};