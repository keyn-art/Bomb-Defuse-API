'use strict';

module.exports = {
  async up(queryInterface) {
    const { QueryTypes } = queryInterface.sequelize;
    const transaction = await queryInterface.sequelize.transaction();

try {
      // Find users created by the demo-users seeder.
      const users = await queryInterface.sequelize.query(
        `
        SELECT user_id, username
        FROM users
        WHERE username IN (
          'demo_host',
          'demo_alice',
          'demo_bob',
          'demo_carla',
          'demo_dylan'
        )
        `,
        {
          type: QueryTypes.SELECT,
          transaction,
        }
      );

const userByUsername = Object.fromEntries(
        users.map((user) => [user.username, user.user_id])
      );

// Create a question set.
      await queryInterface.bulkInsert(
        'question_sets',
        [
          {
            title: 'Demo Bomb Defusal',
            description: 'Fictional seed data for testing the game API.',
            user_id: userByUsername.demo_host,
          },
        ],
        { transaction }
      );

const [questionSet] = await queryInterface.sequelize.query(
        `
        SELECT question_set_id
        FROM question_sets
        WHERE title = 'Demo Bomb Defusal'
        ORDER BY question_set_id DESC
        LIMIT 1
        `,
        {
          type: QueryTypes.SELECT,
          transaction,
        }
      );

// Create questions.
      await queryInterface.bulkInsert(
        'questions',
        [
          {
            question_set_id: questionSet.question_set_id,
            question_text: 'Which color is made by mixing blue and yellow?',
            correct_index: 0,
          },
          {
            question_set_id: questionSet.question_set_id,
            question_text: 'How many sides does a triangle have?',
            correct_index: 0,
          },
        ],
        { transaction }
      );

const questions = await queryInterface.sequelize.query(
        `
        SELECT question_id, question_text
        FROM questions
        WHERE question_set_id = :questionSetId
        ORDER BY question_id
        `,
        {
          replacements: {
            questionSetId: questionSet.question_set_id,
          },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

const questionByText = Object.fromEntries(
        questions.map((question) => [
          question.question_text,
          question.question_id,
        ])
      );

// Create choices.
      await queryInterface.bulkInsert(
        'choices',
        [
          {
            question_id:
              questionByText[
                'Which color is made by mixing blue and yellow?'
              ],
            choice_index: 0,
            choice_text: 'Green',
          },
          {
            question_id:
              questionByText[
                'Which color is made by mixing blue and yellow?'
              ],
            choice_index: 1,
            choice_text: 'Purple',
          },
          {
            question_id:
              questionByText['How many sides does a triangle have?'],
            choice_index: 0,
            choice_text: 'Three',
          },
          {
            question_id:
              questionByText['How many sides does a triangle have?'],
            choice_index: 1,
            choice_text: 'Four',
          },
        ],
        { transaction }
      );

const choices = await queryInterface.sequelize.query(
        `
        SELECT choice_id, question_id, choice_index
        FROM choices
        WHERE question_id IN (:questionIds)
        ORDER BY question_id, choice_index
        `,
        {
          replacements: {
            questionIds: questions.map((question) => question.question_id),
          },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

const choiceId = (questionId, choiceIndex) =>
        choices.find(
          (choice) =>
            choice.question_id === questionId &&
            choice.choice_index === choiceIndex
        ).choice_id;

// Create one finished game.
      await queryInterface.bulkInsert(
        'game_sessions',
        [
          {
            question_set_id: questionSet.question_set_id,
            user_id: userByUsername.demo_host,
            join_code: '123456',
            status: 'CLOSED',
          },
        ],
        { transaction }
      );

const [gameSession] = await queryInterface.sequelize.query(
        `
        SELECT session_id
        FROM game_sessions
        WHERE join_code = '123456'
        `,
        {
          type: QueryTypes.SELECT,
          transaction,
        }
      );

// Create four players:
      // three completed players and one incomplete player.
      await queryInterface.bulkInsert(
        'players',
        [
          {
            session_id: gameSession.session_id,
            user_id: userByUsername.demo_alice,
            nickname: 'Alice',
            score: 20,
            defuse_progress: 100,
          },
          {
            session_id: gameSession.session_id,
            user_id: userByUsername.demo_bob,
            nickname: 'Bob',
            score: 20,
            defuse_progress: 100,
          },
          {
            session_id: gameSession.session_id,
            user_id: userByUsername.demo_carla,
            nickname: 'Carla',
            score: 20,
            defuse_progress: 100,
          },
          {
            session_id: gameSession.session_id,
            user_id: userByUsername.demo_dylan,
            nickname: 'Dylan',
            score: 0,
            defuse_progress: 50,
          },
        ],
        { transaction }
      );

const players = await queryInterface.sequelize.query(
        `
        SELECT player_id, user_id
        FROM players
        WHERE session_id = :sessionId
        `,
        {
          replacements: {
            sessionId: gameSession.session_id,
          },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

const playerId = (username) =>
        players.find(
          (player) => player.user_id === userByUsername[username]
        ).player_id;

// Add answers for the three players who completed the game.
      const answerRows = [];

for (const username of ['demo_alice', 'demo_bob', 'demo_carla']) {
        answerRows.push(
          {
            player_id: playerId(username),
            question_id:
              questionByText[
                'Which color is made by mixing blue and yellow?'
              ],
            choice_id: choiceId(
              questionByText[
                'Which color is made by mixing blue and yellow?'
              ],
              0
            ),
            correct: true,
            points: 10,
          },
          {
            player_id: playerId(username),
            question_id:
              questionByText['How many sides does a triangle have?'],
            choice_id: choiceId(
              questionByText['How many sides does a triangle have?'],
              0
            ),
            correct: true,
            points: 10,
          }
        );
      }

await queryInterface.bulkInsert('answers', answerRows, {
        transaction,
      });

await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

async down(queryInterface) {
    await queryInterface.bulkDelete('game_sessions', {
      join_code: '123456',
    });
  },
};
