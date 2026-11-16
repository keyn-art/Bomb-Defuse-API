'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const q = (sql) => queryInterface.sequelize.query(sql);

    // 1. Status words: LOBBY, RUNNING, CLOSED.
    await q(`UPDATE game_sessions SET status = 'LOBBY' WHERE status = 'waiting'`);
    await q(`ALTER TABLE game_sessions ALTER COLUMN status SET DEFAULT 'LOBBY'`);
    await q(`ALTER TABLE game_sessions
             ADD CONSTRAINT game_sessions_status_check
             CHECK (status IN ('LOBBY', 'RUNNING', 'CLOSED'))`);

    // 2. No two players in one game share a nickname.
    await queryInterface.addConstraint('players', {
      type: 'unique',
      name: 'uq_player_nickname',
      fields: ['session_id', 'nickname'],
    });

    // 3. A question set that was used in a game cannot be deleted.
    await q(`ALTER TABLE game_sessions
             DROP CONSTRAINT game_sessions_question_set_id_fkey`);
    await q(`ALTER TABLE game_sessions
             ADD CONSTRAINT game_sessions_question_set_id_fkey
             FOREIGN KEY (question_set_id)
             REFERENCES question_sets (question_set_id)
             ON DELETE RESTRICT`);
  },

  async down(queryInterface) {
    const q = (sql) => queryInterface.sequelize.query(sql);

    await q(`ALTER TABLE game_sessions
             DROP CONSTRAINT game_sessions_question_set_id_fkey`);
    await q(`ALTER TABLE game_sessions
             ADD CONSTRAINT game_sessions_question_set_id_fkey
             FOREIGN KEY (question_set_id)
             REFERENCES question_sets (question_set_id)
             ON DELETE CASCADE`);

    await queryInterface.removeConstraint('players', 'uq_player_nickname');

    await q(`ALTER TABLE game_sessions DROP CONSTRAINT game_sessions_status_check`);
    await q(`ALTER TABLE game_sessions ALTER COLUMN status SET DEFAULT 'waiting'`);
  },
};