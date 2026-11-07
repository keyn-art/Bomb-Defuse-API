module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'GameSession',
    {
      session_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      question_set_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      join_code: { type: DataTypes.STRING(10), allowNull: false, unique: true },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'waiting' },
    },
    { tableName: 'game_sessions', timestamps: false }
  );