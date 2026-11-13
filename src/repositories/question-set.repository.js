const { QuestionSet } = require('../models');

// The only file that queries question_sets. It decides nothing:
// it returns a row, a list, or null.

function findAll() {
  return QuestionSet.findAll({ order: [['question_set_id', 'ASC']] });
}

function findAllByOwner(userId) {
  return QuestionSet.findAll({
    where: { user_id: userId },
    order: [['question_set_id', 'ASC']],
  });
}

function findById(id) {
  return QuestionSet.findByPk(id); // a row, or null
}

function create(data) {
  return QuestionSet.create(data);
}

function update(questionSet, changes) {
  return questionSet.update(changes);
}

function remove(questionSet) {
  return questionSet.destroy();
}

module.exports = { findAll, findAllByOwner, findById, create, update, remove };