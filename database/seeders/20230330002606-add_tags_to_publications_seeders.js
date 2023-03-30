'use strict';
const models = require('../models')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const publication1 = await models.Publications.findOne({where: {title: 'Torneo de Pelota Maya'}},{transaction})
      await publication1.setTags(1,{transaction})
      const publication2 = await models.Publications.findOne({where: {title: 'Torneo de Ajedrez en Palenque'}},{transaction})
      await publication2.setTags(1,{transaction})
      await transaction.commit()
    } catch (error){
      await transaction.rollback()
      throw error
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const publication1 = await models.Publications.findOne({where: {title: 'Torneo de Pelota Maya'}},{transaction})
      await publication1.removeTags({transaction})
      const publication2 = await models.Publications.findOne({where: {title: 'Torneo de Ajedrez en Palenque'}},{transaction})
      await publication2.removeTags({transaction})
      await transaction.commit()
    } catch (error){
      await transaction.rollback()
      throw error
    }
  }
};
