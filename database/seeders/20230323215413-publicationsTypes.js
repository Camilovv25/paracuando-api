'use strict';

const { Op } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    const publicationsTypes = [
      {
        id: '1',
        name: 'Marcas y tiendas',
        description: 'This type of publication is intended for content related to brands and stores. It includes publications about products, promotions, events and news related to companies and brands in the retail and consumer industry.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '2',
        name: 'Artistas y conciertos',
        description: 'This type of publication is intended to promote and disseminate events related to artists and concerts, offering information on dates, times and venues, as well as news and updates from the world of music.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '3',
        name: 'Torneos',
        description: 'Here you can post information about e-sports tournaments, video games, team sports, individual sports, etc. Encourage people to participate and make new friends while competing.',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]

    try {
      await queryInterface.bulkInsert('publications_types', publicationsTypes, { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    const publicationTypeNames = [
      'Marcas y tiendas',
      'Artistas y conciertos',
      'Torneos',
    ]

    try {
      await queryInterface.bulkDelete(
        'publications_types',
        {
          name: {
            [Op.or]: publicationTypeNames,
          },
        },
        { transaction }
      )

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
