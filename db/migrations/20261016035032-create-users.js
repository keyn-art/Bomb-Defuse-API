'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

username: {
        type: Sequelize.STRING(24),
        allowNull: false,
        unique: true,
      },

role: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },

created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
