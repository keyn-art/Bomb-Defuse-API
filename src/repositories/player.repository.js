const { Op } = require('sequelize');
const { Player, GameSession } = require('../models');

// The repository only talks to the table. No rules, no status codes.

// This account's seat in this game, or null.
function findSeat(sessionId, userId) {
  return Player.findOne({ where: { session_id: sessionId, user_id: userId } });
}

// A RUNNING game, other than this one, where this account has a seat. Or null.
async function findRunningSeatElsewhere(userId, sessionId) {
  const seats = await Player.findAll({
    where: { user_id: userId, session_id: { [Op.ne]: sessionId } },
    attributes: ['session_id'],
  });
  if (seats.length === 0) return null;
  return GameSession.findOne({
    where: {
      status: 'RUNNING',
      session_id: { [Op.in]: seats.map((seat) => seat.session_id) },
    },
  });
}

function create(data) {
  return Player.create(data);
}

function findAllBySession(sessionId) {
  return Player.findAll({
    where: { session_id: sessionId },
    order: [['score', 'DESC'], ['player_id', 'ASC']],
  });
}

module.exports = { findSeat, findRunningSeatElsewhere, create, findAllBySession };