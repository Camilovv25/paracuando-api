'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cities.belongsTo(models.States, {as: 'state', foreignKey: 'state_id'})
      Cities.hasMany(models.Publications,{as: 'city',foreignKey: 'city_id'})
    }
  }
  Cities.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: 'states',
        key: 'id'
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Cities',
    tableName: 'cities',
    underscored: true,
    timestamps: true,
    scopes: {
      public_view:{
        attributes: ['id','state_id','name']
      },
      no_timestamps:{
        attributes: {exclude: ['created_at', 'updated_at']}
      }

    }
  });
  return Cities;
};