// A database rule was broken -> what the client should hear.
// The key is the constraint name from YOUR migrations.
// A constraint that is not listed here still answers 409, with the code CONFLICT.
module.exports = {
  // Two players in the same game cannot share a nickname.
  uq_player_nickname: {
    status: 409,
    code: 'NICKNAME_TAKEN',
    message: 'That nickname is already used in this game.',
  },

  // A question set that was used in a game cannot be deleted.
  game_sessions_question_set_id_fkey: {
    status: 409,
    code: 'QUESTION_SET_IN_USE',
    message: 'This question set was used in a game and cannot be deleted.',
  },

  // One seat per account per game. Only reached if two join requests
  // from the same account arrive at the same instant.
  players_session_id_user_id_unique: {
    status: 409,
    code: 'ALREADY_JOINED',
    message: 'You already have a seat in this game.',
  },

  // Two new games got the same join code at the same instant.
  game_sessions_join_code_key: {
    status: 409,
    code: 'JOIN_CODE_TAKEN',
    message: 'That join code is already used. Please try again.',
  },
};