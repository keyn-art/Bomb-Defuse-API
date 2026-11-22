const { matchedData } = require('express-validator');
const playerService = require('../services/player.service');

// What a client is allowed to see of a player.
function playerJson(player) {
  return {
    player_id: player.player_id,
    nickname: player.nickname,
    score: player.score,
    defuse_progress: player.defuse_progress,
  };
}

// 201 for a new seat, 200 when the same account comes back.
async function join(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const { nickname } = matchedData(req, { locations: ['body'] });
  const { session, player, created } =
    await playerService.join(code, nickname, req.user);
  res.status(created ? 201 : 200).json({
    ...playerJson(player),
    rejoined: !created,
    session: { code: session.join_code, status: session.status },
  });
}

async function list(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const { players } = await playerService.list(code);
  res.status(200).json(players.map(playerJson));
}

module.exports = { join, list };