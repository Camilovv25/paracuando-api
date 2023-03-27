'use strict';
const { Op } = require('sequelize');
const countriesServices = require('../../services/countries.service')
const countriesService = new countriesServices()
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const country = await countriesService.findCountryByName('México');
      const state = [
        {
          id: '1',
          country_id: country.id,
          name: 'Campeche',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '2',
          country_id: country.id,
          name: 'Chihuahua',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '3',
          country_id: country.id,
          name: 'Chiapas',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]
      await queryInterface.bulkInsert('states', state, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const country = await countriesService.findCountryByName('México');
      await queryInterface.bulkDelete('states', {
        [Op.or]: [
          {
            country_id: {
              [Op.and]: [country.id]
            }
          }
        ]
      }, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}