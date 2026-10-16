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

school_id: {
  type: Sequelize.STRING(50),
  allowNull: true,
},

full_name: {
  type: Sequelize.STRING(100),
  allowNull: true,
},

email: {
  type: Sequelize.STRING(255),
  allowNull: true,
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
