'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable('publications', {
        id: {
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          type: Sequelize.UUID
        },
        user_id: {
          allowNull: false,
          type: Sequelize.UUID,
          foreignKey: true,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        publication_type_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          foreignKey: true,
          references: {
            model: 'publications_types',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        city_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          foreignKey: true,
          references: {
            model: 'cities',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        title: {
          allowNull: false,
          type: Sequelize.STRING
        },
        description: {
          allowNull: false,
          type: Sequelize.STRING
        },
        content: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        reference_link: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          field: 'created_at'
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          field: 'updated_at'
        }
      }, { transaction });

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.dropTable('publications', { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
};