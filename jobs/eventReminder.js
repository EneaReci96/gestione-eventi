// jobs/eventReminder.js

const cron = require('node-cron');
const { Event, User } = require('../models');
const nodemailer = require('nodemailer'); 
const transporter = require('../config/nodemailer');

// Job che esegue ogni giorno alle 9:00
cron.schedule('0 9 * * *', async () => {
  try {
    const domaniInizio = new Date();
    domaniInizio.setDate(domaniInizio.getDate() + 1);
    domaniInizio.setHours(0, 0, 0, 0);

    const domaniFine = new Date(domaniInizio);
    domaniFine.setHours(23, 59, 59, 999);

    const eventi = await Event.findAll({
      where: {
        data_inizio: {
          [Op.between]: [domaniInizio, domaniFine],
        },
      },
      include: [
        {
          model: User,
          as: 'partecipanti',
        },
      ],
    });

    for (const evento of eventi) {
      for (const partecipante of evento.partecipanti) {
        const mailOptions = {
          from: '"Gestione Eventi" <no-reply@gestione-eventi.com>',
          to: partecipante.email,
          subject: 'Promemoria Evento',
          text: `Ciao ${partecipante.nome},\n\nTi ricordiamo che domani si terrà l'evento "${evento.titolo}".\n\nNon mancare!`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Errore nell\'invio dell\'email:', error);
          } else {
            console.log('Email inviata:', info.messageId);
            console.log('Anteprima disponibile all\'URL:', nodemailer.getTestMessageUrl(info));
          }
        });
      }
    }
  } catch (error) {
    console.error('Errore nel job di promemoria:', error);
  }
});
