'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('answers', {
      answer_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

player_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'players',
          key: 'player_id',
        },
        onDelete: 'CASCADE',
      },

question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'question_id',
        },
        onDelete: 'CASCADE',
      },

choice_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'choices',
          key: 'choice_id',
        },
        onDelete: 'CASCADE',
      },

correct: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },

points: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });
  },

async down(queryInterface) {
    await queryInterface.dropTable('answers');
  },
};
