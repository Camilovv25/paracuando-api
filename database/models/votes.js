'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Votes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Votes.belongsTo(models.Publications, {as: 'publication', foreignKey: 'publication_id'});
      Votes.belongsTo(models.Users, {as: 'user', foreignKey: 'user_id'});
    }
  }
  Votes.init({
    publication_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'Publications',
        key: 'id'
      }
    },
    user_id: {
      type:DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    } 
  }, {
    sequelize,
    modelName: 'Votes',
    tableName: 'votes',
    timestamps: true,
    underscored: true
  });
  return Votes;
};