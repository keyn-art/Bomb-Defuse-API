'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('game_sessions', {
      session_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

question_set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'question_sets',
          key: 'question_set_id',
        },
        onDelete: 'CASCADE',
      },

user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onDelete: 'CASCADE',
      },

join_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
      },

status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'waiting',
      },
    });
  },

async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('game_sessions');
  },
};
