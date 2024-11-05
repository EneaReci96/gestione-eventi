'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersData = [];

    // Definiamo gli utenti con le password in chiaro
    const users = [
      {
        username: 'organizzatore1',
        password: 'password1',
        email: 'organizzatore1@example.com',
        nome: 'Mario',
        cognome: 'Rossi',
        ruolo: 'organizzatore',
      },
      {
        username: 'organizzatore2',
        password: 'password2',
        email: 'organizzatore2@example.com',
        nome: 'Luigi',
        cognome: 'Verdi',
        ruolo: 'organizzatore',
      },
      {
        username: 'partecipante1',
        password: 'password3',
        email: 'partecipante1@example.com',
        nome: 'Anna',
        cognome: 'Bianchi',
        ruolo: 'partecipante',
      },
      {
        username: 'partecipante2',
        password: 'password4',
        email: 'partecipante2@example.com',
        nome: 'Paolo',
        cognome: 'Neri',
        ruolo: 'partecipante',
      },
    ];

    // Hashiamo le password e prepariamo i dati per l'inserimento
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      usersData.push({
        username: user.username,
        password: hashedPassword,
        email: user.email,
        nome: user.nome,
        cognome: user.cognome,
        ruolo: user.ruolo,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Users', usersData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
