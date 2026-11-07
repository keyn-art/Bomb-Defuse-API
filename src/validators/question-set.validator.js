const { body, param } = require('express-validator');

// A value in the URL: /question-sets/:id
const idParam = param('id')
  .isInt({ min: 1 }).withMessage('id must be a positive whole number')
  .toInt();

// title: text, required (NOT NULL in the table)
const title = () => body('title')
  .exists().withMessage('title is required')
  .bail()
  .isString().withMessage('title must be text')
  .bail()
  .trim()
  .isLength({ min: 3, max: 150 }).withMessage('title must be 3 to 150 characters long');

// description: text, may be empty (allowNull in the table)
const description = () => body('description')
  .optional({ values: 'null' })
  .isString().withMessage('description must be text')
  .bail()
  .trim()
  .isLength({ max: 500 }).withMessage('description must be at most 500 characters long');

const createRules = [title(), description()];

// PATCH changes only what is sent: every field is optional, but not all of them at once.
const updateRules = [
  idParam,
  title().optional(),
  description(),
  body().custom((value) => {
    const sent = Object.keys(value || {});
    if (!sent.some((key) => ['title', 'description'].includes(key))) {
      throw new Error('send at least one of: title, description');
    }
    return true;
  }),
];

module.exports = { idParam, createRules, updateRules };