'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('question_sets', {
      question_set_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

description: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    });
  },

async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('question_sets');
  },
};
