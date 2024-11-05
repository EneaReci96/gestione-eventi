// routes/user.js

const express = require('express');
const router = express.Router();
const { User, Event } = require('../models');
const { isAuthenticated, isOrganizzatore } = require('../middlewares/auth');

// Rotta per richiedere di diventare organizzatore (GET)
router.get('/diventa-organizzatore', isAuthenticated, (req, res) => {
  res.render('diventaOrganizzatore');
});

// Rotta per richiedere di diventare organizzatore (POST)
router.post('/diventa-organizzatore', isAuthenticated, async (req, res) => {
  try {
    // Aggiorna il ruolo dell'utente a 'organizzatore'
    await User.update({ ruolo: 'organizzatore' }, { where: { id: req.user.id } });
    req.flash('success', 'Ora sei un organizzatore! Puoi creare nuovi eventi.');
    res.redirect('/');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Errore nell\'aggiornamento del ruolo.');
    res.redirect('/diventa-organizzatore');
  }
});

// Rotta per visualizzare gli eventi a cui l'utente partecipa
router.get('/eventi-partecipati', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Event,
          as: 'eventiPartecipati',
          include: [{ model: User, as: 'organizzatore' }],
        },
      ],
    });

    res.render('eventsParticipated', { eventi: user.eventiPartecipati });
  } catch (error) {
    console.error(error);
    res.status(500).send("Errore nel recupero degli eventi dell'utente.");
  }
});

// Rotta per visualizzare gli eventi creati dall'organizzatore
router.get('/eventi-creati', isAuthenticated, isOrganizzatore, async (req, res) => {
  try {
    const eventi = await Event.findAll({
      where: { organizzatoreId: req.user.id },
      include: [{ model: User, as: 'organizzatore' }],
    });

    res.render('eventsCreated', { eventi });
  } catch (error) {
    console.error(error);
    res.status(500).send("Errore nel recupero degli eventi dell'organizzatore.");
  }
});

// Rotta per visualizzare i biglietti acquistati
router.get('/tickets', isAuthenticated, async (req, res) => {
  try {
    const userWithEvents = await User.findByPk(req.user.id, {
      include: [
        {
          model: Event,
          as: 'eventiPartecipati',
          include: [{ model: User, as: 'organizzatore' }],
          through: {
            attributes: [],
          },
        },
      ],
    });

    res.render('tickets', { eventi: userWithEvents.eventiPartecipati });
  } catch (error) {
    console.error(error);
    res.status(500).send('Errore del server');
  }
});

module.exports = router;
