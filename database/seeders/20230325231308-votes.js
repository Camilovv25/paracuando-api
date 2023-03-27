'use strict'
const uuid = require('uuid')
const { Op } = require('sequelize')
const publicationsServices = require('../../services/publications.service')
const usersServices = require('../../services/users.service')

const publicationsService = new publicationsServices()
const usersService = new usersServices()


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const user1 = await usersService.findUserByEmailOr404('catriana0398@gmail.com')
      const user2 = await usersService.findUserByEmailOr404('camilo.venegas122@gmail.com')
      const publication1 = await publicationsService.findPublicationByTitle('Torneo de Pelota Maya')
      const publication2 = await publicationsService.findPublicationByTitle('Torneo de Ajedrez en Palenque')

      const votes = [
        {
          publication_id: publication1.id,
          user_id: user1.id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          publication_id: publication2.id,
          user_id: user2.id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]

      await queryInterface.bulkInsert('votes', votes, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const user1 = await usersService.findUserByEmailOr404('catriana0398@gmail.com')
      const user2 = await usersService.findUserByEmailOr404('camilo.venegas122@gmail.com')
      const publication1 = await publicationsService.findPublicationByTitle('Torneo de Pelota Maya')
      const publication2 = await publicationsService.findPublicationByTitle('Torneo de Ajedrez en Palenque')

      await queryInterface.bulkDelete('votes', {
        [Op.or]: [
          {
            user_id: {
              [Op.and]: [user1.id, user2.id]
            },
            publication_id: {
              [Op.and]: [publication1.id, publication2.id]
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
