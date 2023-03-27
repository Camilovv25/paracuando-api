'use strict';
const { Op } = require('sequelize');
const statesServices = require('../../services/states.service');
const statesService = new statesServices();

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const state1 = await statesService.findStateByName('Campeche');
      const state2 = await statesService.findStateByName('Chihuahua');
      const state3 = await statesService.findStateByName('Chiapas');

      const cities = [
        {
          id: '1',
          state_id: state1.id,
          name: 'Pomuch',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '2',
          state_id: state2.id,
          name: 'Sabancuy',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '3',
          state_id: state3.id,
          name: 'Palenque',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]
      await queryInterface.bulkInsert('cities', cities, { transaction })
      await transaction.commit();
    } catch (error) {
      console.log(error.stack)
      await transaction.rollback();
      throw error
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const state1 = await statesService.findStateByName('Campeche');
      const state2 = await statesService.findStateByName('Chihuahua');
      const state3 = await statesService.findStateByName('Chiapas');
      await queryInterface.bulkDelete('cities', {
        [Op.or]: [
          {
            state_id: {
              [Op.and]: [state1.id]
            }
          },
          {
            state_id: {
              [Op.and]: [state2.id]
            }
          },
          {
            state_id: {
              [Op.and]: [state3.id]
            }
          }
        ]
      }, { transaction })
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error
    }
  }
}