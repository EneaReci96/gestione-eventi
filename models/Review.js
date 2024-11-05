// models/Review.js

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    valutazione: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    commento: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  Review.associate = (models) => {
    Review.belongsTo(models.User, { foreignKey: 'utenteId' });
    Review.belongsTo(models.Event, { foreignKey: 'eventoId' });
  };

  return Review;
};
