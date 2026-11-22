const playerRepository = require('../repositories/player.repository');
const gameSessionService = require('./game-session.service');
const { conflict } = require('../errors/app-error');

// The service holds the rules. It says no by THROWING. It never touches req or res.

// The questions are asked in this order. The first "no" decides the answer.
async function join(code, nickname, user) {
  const session = await gameSessionService.findOrFail(code);

  // Rejoin: this account already has a seat. Same row, same score.
  const seat = await playerRepository.findSeat(session.session_id, user.user_id);
  if (seat) return { session, player: seat, created: false };

  // One game at a time: no new seat while playing in another RUNNING game.
  const elsewhere = await playerRepository
    .findRunningSeatElsewhere(user.user_id, session.session_id);
  if (elsewhere) {
    throw conflict('ALREADY_IN_GAME',
      'You are still playing another game. Finish it first.');
  }

  // New seats only in the lobby.
  if (session.status === 'CLOSED') {
    throw conflict('SESSION_ENDED', 'This game has ended.');
  }
  if (session.status !== 'LOBBY') {
    throw conflict('SESSION_NOT_JOINABLE', 'This game has already started.');
  }

  // A taken nickname is refused by the UNIQUE constraint in the database.
  const player = await playerRepository.create({
    session_id: session.session_id,
    user_id: user.user_id,
    nickname,
  });
  return { session, player, created: true };
}

// Anyone with the code may list the players of a game.
async function list(code) {
  const session = await gameSessionService.findOrFail(code);
  const players = await playerRepository.findAllBySession(session.session_id);
  return { session, players };
}

module.exports = { join, list };