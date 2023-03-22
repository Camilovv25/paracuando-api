'use strict'
const uuid = require('uuid')
const { Op } = require('sequelize')
const { hashPassword } = require('../../libs/bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    const usersSeeds = [
      {
        id: uuid.v4(),
        first_name: 'Camilo',
        last_name: 'Vanegas',
        email: 'camilo.venegas122@gmail.com',
        username: 'Admin1',
        password: hashPassword('root'),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid.v4(),
        first_name: 'Cesar',
        last_name: 'Triana',
        email: 'catriana0398@gmail.com',
        username: 'Admin2',
        password: hashPassword('root'),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]

    try {
      await queryInterface.bulkInsert('users', usersSeeds, { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    const userNames = [
      'example@academlo.com',
    ]

    try {
      await queryInterface.bulkDelete(
        'users',
        {
          username: {
            [Op.or]: userNames,
          },
        },
        { transaction }
      )

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
}
