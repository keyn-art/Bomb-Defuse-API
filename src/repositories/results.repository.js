// Hub Contract rule 7. YOUR WORK (Lab Step 9): write the query for YOUR tables.
//
// Return one row per player per FINISHED game (a game whose status is CLOSED,
// or whatever your design calls a game that has ended), with exactly these names:
//
//   session_code   the six-digit join code of the game
//   started_at     when the game started (may be null)
//   ended_at       when the game ended
//   school_id      the player's school ID, from your users table
//   nickname       the nickname the player used in that game
//   score          the player's final score
//   completed      true or false: did this player complete the game?
//                  YOUR game decides what "completed" means. Write the rule
//                  in your README, for example "answered every question".
//
// If "since" is given, return only games that ended after it.
//
// An example for a design with game_sessions, players and users tables:
//
//   SELECT s.join_pin AS session_code, s.started_at, s.ended_at,
//          u.school_id, p.nickname, p.score,
//          (p.finished_at IS NOT NULL) AS completed
//     FROM game_sessions s
//     JOIN players p ON p.session_id = s.session_id
//     JOIN users u ON u.user_id = p.user_id
//    WHERE s.status = 'CLOSED'
//      AND (CAST(:since AS timestamptz) IS NULL OR s.ended_at > :since)
//    ORDER BY s.ended_at, p.score DESC

const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

async function findFinishedGamePlayers(since) {
  const sinceFilter = since ? 'AND 1 = 0' : '';

const sql = `
    SELECT
      gs.join_code AS session_code,
      NULL AS started_at,
      NULL AS ended_at,
      u.username AS school_id,
      p.nickname,
      p.score,

CASE
        WHEN COUNT(DISTINCT a.question_id)
             >= COUNT(DISTINCT q.question_id)
        THEN true
        ELSE false
      END AS completed

FROM game_sessions AS gs

INNER JOIN players AS p
      ON p.session_id = gs.session_id

INNER JOIN users AS u
      ON u.user_id = p.user_id

LEFT JOIN questions AS q
      ON q.question_set_id = gs.question_set_id

LEFT JOIN answers AS a
      ON a.player_id = p.player_id
      AND a.question_id = q.question_id

WHERE gs.status = 'CLOSED'
      ${sinceFilter}

GROUP BY
      gs.join_code,
      u.username,
      p.player_id,
      p.nickname,
      p.score

ORDER BY
      gs.join_code,
      p.score DESC,
      p.nickname ASC;
  `;

return sequelize.query(sql, {
    type: QueryTypes.SELECT,
  });
}

module.exports = {
  findFinishedGamePlayers,
};
