'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('votes', {
        // id: {
        //   allowNull: false,
        //   autoIncrement: true,
        //   primaryKey: true,
        //   type: Sequelize.INTEGER
        // },
        publication_id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
          foreignKey: true,
          references: {
            model: 'publications',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
          foreignKey: true, 
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }, {transaction});
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error 
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('votes',{transaction});
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error 
    }
  }
};