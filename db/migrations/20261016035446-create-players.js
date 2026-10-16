'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('players', {
      player_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'game_sessions',
          key: 'session_id',
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

nickname: {
        type: Sequelize.STRING(24),
        allowNull: false,
      },

score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

defuse_progress: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });

await queryInterface.addConstraint('players', {
      fields: ['session_id', 'user_id'],
      type: 'unique',
      name: 'players_session_id_user_id_unique',
    });
  },

async down(queryInterface) {
    await queryInterface.removeConstraint(
      'players',
      'players_session_id_user_id_unique'
    );

await queryInterface.dropTable('players');
  },
};
