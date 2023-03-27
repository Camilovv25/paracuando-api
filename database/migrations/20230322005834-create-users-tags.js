'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('users_tags', {
        tag_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          foreignKey: true,
          references: {
            model: 'tags',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
          
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: true,
          primaryKey: true,
          foreignKey: true,
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE'
  
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        }
      },{transaction});
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error 
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('users_tags',{transaction});
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error 
    }
  }
};