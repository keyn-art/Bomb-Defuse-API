// Reads the name of the database constraint that an insert, update or delete broke.
// Returns null when the error is not a constraint violation.
const { UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

// PostgreSQL code 23001 is "restrict_violation": a row cannot be deleted
// because ON DELETE RESTRICT protects it. Sequelize reports it as a plain
// database error, not as a ForeignKeyConstraintError.
const RESTRICT_VIOLATION = '23001';

function constraintOf(error) {
  if (error instanceof UniqueConstraintError || error instanceof ForeignKeyConstraintError) {
    return (error.parent && error.parent.constraint) || error.index || 'unknown';
  }
  if (error && error.parent && error.parent.code === RESTRICT_VIOLATION) {
    return error.parent.constraint || 'unknown';
  }
  return null;
}

module.exports = { constraintOf };