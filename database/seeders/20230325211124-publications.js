'use strict'
const uuid = require('uuid')
const { Op } = require('sequelize')
const publicationsServices = require('../../services/publications.service')
const usersServices = require('../../services/users.service')
const publicationsTypesServices = require('../../services/publicationsTypes.service')
const citiesServices = require('../../services/cities.service')

const publicationsService = new publicationsServices()
const usersService = new usersServices()
const publicationsTypesService = new publicationsTypesServices()
const citiesService = new citiesServices()

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const user1 = await usersService.findUserByEmailOr404('catriana0398@gmail.com')
      const user2 = await usersService.findUserByEmailOr404('camilo.venegas122@gmail.com')
      const publicationType = await publicationsTypesService.findPublicationByName('Torneos')
      const city = await citiesService.findCityByName('Palenque')
      const publications = [
        {
          id: uuid.v4(),
          user_id: user1.id,
          publication_type_id: publicationType.id,
          city_id: city.id,
          title: 'Torneo de Pelota Maya',
          description: 'Conoce sobre el Torneo de Pelota Maya, un deporte tradicional en Palenque',
          content: 'El Torneo de Pelota Maya es un deporte ancestral que se juega en Palenque desde hace siglos. Consiste en golpear una pelota de caucho con los codos, las rodillas o las caderas, y el objetivo es hacer que la pelota atraviese un aro. Este deporte es considerado sagrado por los mayas y se lleva a cabo en fechas importantes del calendario maya.',
          reference_link: 'https://ejemplo.com/torneo-de-pelota-maya-en-palenque',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuid.v4(),
          user_id: user2.id,
          publication_type_id: publicationType.id,
          city_id: city.id,
          title: 'Torneo de Ajedrez en Palenque',
          description: 'Entérate sobre el Torneo de Ajedrez que se celebra en Palenque cada año',
          content: 'El Torneo de Ajedrez de Palenque es un evento anual que reúne a jugadores de todo México y otros países. El torneo se lleva a cabo en el mes de agosto y cuenta con varias categorías, desde principiantes hasta profesionales. Los participantes compiten por premios en efectivo y la oportunidad de mejorar su ranking mundial de ajedrez.',
          reference_link: 'https://ejemplo.com/torneo-de-ajedrez-en-palenque',
          created_at: new Date(),
          updated_at: new Date(),
        }
      ]
      await queryInterface.bulkInsert('publications', publications, { transaction })
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
      const publicationType = await publicationsTypesService.findPublicationByName('Torneos')
      const city = await citiesService.findCityByName('Palenque')

      await queryInterface.bulkDelete('publications', {
        [Op.or]: [
          {
            user_id: {
              [Op.and]: [user1.id, user2.id]
            },
            publication_type_id: {
              [Op.and]: [publicationType.id]
            },
            city_id: {
              [Op.and]: [city.id]
            },
            title: {
              [Op.in]: ['Torneo de Pelota Maya', 'Torneo de Ajedrez en Palenque']
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
