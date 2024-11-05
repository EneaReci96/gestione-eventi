// models/Participation.js

module.exports = (sequelize, DataTypes) => {
  const Participation = sequelize.define('Participation', {
    data_partecipazione: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return Participation;
};
