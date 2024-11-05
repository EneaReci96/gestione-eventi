// models/User.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cognome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ruolo: {
      type: DataTypes.STRING,
      defaultValue: 'partecipante',
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Event, { as: 'eventiCreati', foreignKey: 'organizzatoreId' });
    User.belongsToMany(models.Event, {
      through: models.Participation,
      as: 'eventiPartecipati',
      foreignKey: 'UserId',
      otherKey: 'EventId',
    });
    User.hasMany(models.Review, { foreignKey: 'utenteId' });
  };

  return User;
};
