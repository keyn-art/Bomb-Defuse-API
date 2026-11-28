const gameSessionRepository = require('../repositories/game-session.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden, conflict } = require('../errors/app-error');

// The service holds the rules. It says no by THROWING. It never touches req or res.

// Status moves forward only. A game still in the lobby may also be closed.
const ALLOWED_CHANGES = {
  LOBBY: ['RUNNING', 'CLOSED'],
  RUNNING: ['CLOSED'],
  CLOSED: [],
};

async function findOrFail(code) {
  const session = await gameSessionRepository.findByCode(code);
  if (!session) {
    throw notFound('SESSION_NOT_FOUND', `No game has the code ${code}.`);
  }
  return session;
}

function isOwner(session, user) {
  return session.user_id === user.user_id || user.role === 'ADMIN';
}

// A random six-digit code, from 100000 to 999999.
function makeCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Try a few times to find a code nobody uses. The UNIQUE constraint on
// join_code is the last guard if two requests pick the same code together.
async function freeCode() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = makeCode();
    if (!(await gameSessionRepository.findByCode(code))) return code;
  }
  throw conflict('JOIN_CODE_TAKEN', 'Could not make a free join code. Please try again.');
}

// Rule: the question set must exist and belong to the caller (or an admin).
// Rule: the host is the caller, and a new game always starts in the lobby.
async function create(data, user) {
  const questionSet = await questionSetRepository.findById(data.question_set_id);
  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND',
      `No question set has the id ${data.question_set_id}.`);
  }
  if (questionSet.user_id !== user.user_id && user.role !== 'ADMIN') {
    throw forbidden('This question set belongs to another host.');
  }
  return gameSessionRepository.create({
    question_set_id: questionSet.question_set_id,
    user_id: user.user_id,
    join_code: await freeCode(),
    status: 'LOBBY',
  });
}

// Anyone with the code may read a game.
function get(code) {
  return findOrFail(code);
}

// Rule: only the host (or an admin) changes the status, and only forward.
// The start and end times are recorded when the status changes.
async function changeStatus(code, status, user) {
  const session = await findOrFail(code);
  if (!isOwner(session, user)) {
    throw forbidden('This game belongs to another host.');
  }
  if (!ALLOWED_CHANGES[session.status].includes(status)) {
    throw conflict('INVALID_STATUS_CHANGE',
      `A game that is ${session.status} cannot become ${status}.`);
  }
  const changes = { status };
  if (status === 'RUNNING') changes.started_at = new Date();
  if (status === 'CLOSED') changes.ended_at = new Date();
  return gameSessionRepository.update(session, changes);
}

module.exports = { findOrFail, create, get, changeStatus };