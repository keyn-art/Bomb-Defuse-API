const { body, param } = require('express-validator');

// The join code in the URL: exactly six digits, no leading 0.
const codeParam = param('code')
  .matches(/^[1-9][0-9]{5}$/).withMessage('the join code must be six digits');

// A host starts a game from one of their question sets.
const createRules = [
  body('question_set_id')
    .exists().withMessage('question_set_id is required')
    .bail()
    .isInt({ min: 1 }).withMessage('question_set_id must be a positive whole number')
    .toInt(),
];

// A client may only ask for RUNNING or CLOSED. LOBBY is where a game starts.
const statusRules = [
  codeParam,
  body('status')
    .exists().withMessage('status is required')
    .bail()
    .isIn(['RUNNING', 'CLOSED']).withMessage('status must be RUNNING or CLOSED'),
];

module.exports = { codeParam, createRules, statusRules };