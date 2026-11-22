const { body } = require('express-validator');
const { codeParam } = require('./game-session.validator');

// Joining: the game code is in the URL, the nickname is in the body.
const joinRules = [
  codeParam,
  body('nickname')
    .exists().withMessage('nickname is required')
    .bail()
    .isString().withMessage('nickname must be text')
    .bail()
    .trim()
    .isLength({ min: 2, max: 24 }).withMessage('nickname must be 2 to 24 characters long'),
];

module.exports = { joinRules };