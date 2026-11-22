const { matchedData } = require('express-validator');
const gameSessionService = require('../services/game-session.service');

// What a client is allowed to see of a game.
function toJson(session) {
  return {
    code: session.join_code,
    status: session.status,
    question_set_id: session.question_set_id,
    host_id: session.user_id,
  };
}

async function create(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const session = await gameSessionService.create(data, req.user);
  res.status(201).json(toJson(session));
}

async function get(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const session = await gameSessionService.get(code);
  res.status(200).json(toJson(session));
}

async function changeStatus(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const { status } = matchedData(req, { locations: ['body'] });
  const session = await gameSessionService.changeStatus(code, status, req.user);
  res.status(200).json(toJson(session));
}

module.exports = { create, get, changeStatus };