// migrations/20200101000001-create-events.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      titolo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      descrizione: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      data_inizio: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      data_fine: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      luogo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      categoria: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      latitudine: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      longitudine: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      prezzo: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      organizzatoreId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Events');
  },
};
