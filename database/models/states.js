'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class States extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      States.belongsTo(models.Countries, {as:'country',foreignKey: 'country_id'})
    }
  }
  States.init({
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    country_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: 'Countries',
        key: 'id'
      }
    }, 
    name: {
      type: DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'States',
    tableName: 'states',
    underscored: true,
    timestamps: true,
    scopes: {
      public_view: {
        attributes: ['id', 'country_id', 'name']
      },
      no_timestamps: {
        attributes: {exclude:['created_at','updated_at']}
      }
    }
  });
  return States;
};