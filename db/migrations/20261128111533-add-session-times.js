'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('game_sessions', 'started_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('game_sessions', 'ended_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('game_sessions', 'ended_at');
    await queryInterface.removeColumn('game_sessions', 'started_at');
  },
};