'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('PublicationsTags', {
        // id: {
        //   allowNull: false,
        //   autoIncrement: true,
        //   primaryKey: true,
        //   type: Sequelize.INTEGER
        // },
        tag_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          foreignKey: true,
          references: {
            model: 'Tags',
            key: 'id' 
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        publication_id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
          foreignKey: true,
          references: {
            model: 'Publications',
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
      await queryInterface.dropTable('PublicationsTags',{transaction});
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error 
    }
  }
};