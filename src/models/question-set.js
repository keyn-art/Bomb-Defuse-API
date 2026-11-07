module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'QuestionSet',
    {
      question_set_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'question_sets', timestamps: false }
  );