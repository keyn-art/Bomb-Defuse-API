'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      question_id: {
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

question_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

correct_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('questions');
  },
};
