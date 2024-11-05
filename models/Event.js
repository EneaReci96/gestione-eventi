// models/Event.js

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    titolo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descrizione: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    data_inizio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    data_fine: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    luogo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitudine: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitudine: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    prezzo: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    organizzatoreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  // models/Event.js

  Event.associate = (models) => {
    Event.belongsTo(models.User, { as: 'organizzatore', foreignKey: 'organizzatoreId' });
    Event.belongsToMany(models.User, {
    through: models.Participation,
    as: 'partecipanti',
    foreignKey: 'EventId',
    otherKey: 'UserId',
  });
  Event.hasMany(models.Review, { foreignKey: 'eventoId' });
};


  return Event;
};
