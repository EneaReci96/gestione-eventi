// routes/index.js

const express = require('express');
const router = express.Router();
const { Event, User, Participation, Review, Sequelize } = require('../models');
const categories = require('../utils/categories');

router.get('/', async (req, res) => {
  try {
    // Eventi con più partecipanti
    const eventiPopolari = await Event.findAll({
      attributes: {
        include: [
          [Sequelize.literal(`(
            SELECT COUNT(*)
            FROM Participations AS Participation
            WHERE
              Participation.EventId = Event.id
          )`), 'numeroPartecipanti'],
        ],
      },
      order: [[Sequelize.literal('numeroPartecipanti'), 'DESC']],
      limit: 3,
    });

    // Eventi con migliori valutazioni
    let eventiMigliori = await Event.findAll({
      include: [
        { model: Review },
      ],
    });

    // Calcola la media delle valutazioni
    eventiMigliori.forEach(evento => {
      let mediaValutazioni = 0;
      if (evento.Reviews.length > 0) {
        const sommaValutazioni = evento.Reviews.reduce((acc, recensione) => acc + recensione.valutazione, 0);
        mediaValutazioni = sommaValutazioni / evento.Reviews.length;
      }
      evento.setDataValue('mediaValutazioni', mediaValutazioni);
    });

    // Ordina per valutazione media
    eventiMigliori = eventiMigliori.sort((a, b) => b.get('mediaValutazioni') - a.get('mediaValutazioni'));
    eventiMigliori = eventiMigliori.slice(0, 3); // Prendi i primi 3

    // Funzione per ottenere l'icona della categoria
    const getCategoryIcon = (categoria) => {
      const icons = {
        'Concerto': 'bi-music-note-beamed',
        'Mostra': 'bi-easel',
        'Conferenza': 'bi-mic',
        'Sport': 'bi-trophy',
        'Teatro': 'bi-mask',
        'Festival': 'bi-stars',
        'Workshop': 'bi-tools',
        'Webinar': 'bi-laptop',
        'Altro': 'bi-three-dots',
      };
      return icons[categoria] || 'bi-calendar-event';
    };

    res.render('index', { categories, eventiPopolari, eventiMigliori, getCategoryIcon });
  } catch (error) {
    console.error(error);
    res.status(500).send('Errore nel caricamento della home page.');
  }
});

module.exports = router;
