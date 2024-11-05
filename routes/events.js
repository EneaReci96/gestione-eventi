// routes/events.js

const express = require('express');
const router = express.Router();
const { User, Event, Participation, Review } = require('../models');
const { Op } = require('sequelize');
const categories = require('../utils/categories');
const { isAuthenticated, isOrganizzatore } = require('../middlewares/auth');
const transporter = require('../config/nodemailer');
const nodemailer = require('nodemailer');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Rotta per visualizzare tutti gli eventi o effettuare una ricerca avanzata
router.get('/', async (req, res) => {
  try {
    const { keyword, data_da, data_a, luogo, categoria, prezzo_max, valutazione_min } = req.query;

    const whereClause = {};

    if (keyword) {
      whereClause[Op.or] = [
        { titolo: { [Op.like]: `%${keyword}%` } },
        { descrizione: { [Op.like]: `%${keyword}%` } },
      ];
    }

    if (data_da && data_a) {
      whereClause.data_inizio = {
        [Op.between]: [new Date(data_da), new Date(data_a)],
      };
    }

    if (luogo) {
      whereClause.luogo = { [Op.like]: `%${luogo}%` };
    }

    if (categoria && categories.includes(categoria)) {
      whereClause.categoria = categoria;
    }

    if (prezzo_max) {
      whereClause.prezzo = { [Op.lte]: prezzo_max };
    }

    const eventi = await Event.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'organizzatore' },
        { model: Review },
      ],
    });

    // Filtra per valutazione minima
    let eventiFiltrati = eventi;
    if (valutazione_min) {
      eventiFiltrati = eventi.filter(evento => {
        let mediaValutazioni = 0;
        if (evento.Reviews.length > 0) {
          const sommaValutazioni = evento.Reviews.reduce((acc, recensione) => acc + recensione.valutazione, 0);
          mediaValutazioni = (sommaValutazioni / evento.Reviews.length);
        }
        return mediaValutazioni >= valutazione_min;
      });
    }

    // Calcola la media delle valutazioni per ogni evento
    eventi.forEach(evento => {
      let mediaValutazioni = 0;
      if (evento.Reviews.length > 0) {
        const sommaValutazioni = evento.Reviews.reduce((acc, recensione) => acc + recensione.valutazione, 0);
        mediaValutazioni = (sommaValutazioni / evento.Reviews.length).toFixed(1);
      }
      evento.mediaValutazioni = mediaValutazioni;
    });

    res.render('events', {
      eventi: eventiFiltrati,
      categories,
      keyword,
      data_da,
      data_a,
      luogo,
      categoria,
      prezzo_max,
      valutazione_min,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Errore nel recupero degli eventi.');
  }
});

// Rotta per creare un nuovo evento (GET)
router.get('/nuovo', isAuthenticated, isOrganizzatore, (req, res) => {
  res.render('eventForm', { categories, evento: {} });
});

// Rotta per creare un nuovo evento (POST)
router.post('/nuovo', isAuthenticated, isOrganizzatore, async (req, res) => {
  const {
    titolo,
    descrizione,
    data_inizio,
    data_fine,
    luogo,
    categoria,
    latitudine,
    longitudine,
    prezzo,
  } = req.body;

  if (!categories.includes(categoria)) {
    req.flash('error', 'Categoria non valida.');
    return res.redirect('/eventi/nuovo');
  }

  try {
    await Event.create({
      titolo,
      descrizione,
      data_inizio,
      data_fine,
      luogo,
      categoria,
      latitudine,
      longitudine,
      prezzo,
      organizzatoreId: req.user.id,
    });
    req.flash('success', 'Evento creato con successo.');
    res.redirect('/eventi');
  } catch (error) {
    console.error(error);
    req.flash('error', "Errore nella creazione dell'evento.");
    res.redirect('/eventi/nuovo');
  }
});

// Rotta per modificare un evento (GET)
router.get('/modifica/:id', isAuthenticated, isOrganizzatore, async (req, res) => {
  try {
    const evento = await Event.findByPk(req.params.id);

    if (!evento) {
      req.flash('error', 'Evento non trovato.');
      return res.redirect('/eventi');
    }

    // Verifica che l'utente corrente sia l'organizzatore dell'evento
    if (evento.organizzatoreId !== req.user.id) {
      req.flash('error', 'Non sei autorizzato a modificare questo evento.');
      return res.redirect('/eventi');
    }

    res.render('eventForm', { evento, categories });
  } catch (error) {
    console.error(error);
    res.status(500).send("Errore nel recupero dell'evento.");
  }
});

// Rotta per modificare un evento (POST)
router.post('/modifica/:id', isAuthenticated, isOrganizzatore, async (req, res) => {
  try {
    const evento = await Event.findByPk(req.params.id);

    if (!evento) {
      req.flash('error', 'Evento non trovato.');
      return res.redirect('/eventi-creati');
    }

    if (evento.organizzatoreId !== req.user.id) {
      req.flash('error', 'Non sei autorizzato a modificare questo evento.');
      return res.redirect('/eventi-creati');
    }

    await evento.update({
      titolo: req.body.titolo,
      descrizione: req.body.descrizione,
      data_inizio: req.body.data_inizio,
      data_fine: req.body.data_fine,
      luogo: req.body.luogo,
      categoria: req.body.categoria,
      latitudine: req.body.latitudine,
      longitudine: req.body.longitudine,
      prezzo: req.body.prezzo,
    });

    // Invia email ai partecipanti
    const partecipanti = await evento.getPartecipanti();

    for (const partecipante of partecipanti) {
      const mailOptions = {
        from: '"Gestione Eventi" <no-reply@gestione-eventi.com>',
        to: partecipante.email,
        subject: `Aggiornamento sull'evento "${evento.titolo}"`,
        text: `Ciao ${partecipante.nome},\n\nL'evento "${evento.titolo}" è stato aggiornato. Controlla i dettagli sul sito.\n\nGrazie!`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Errore nell\'invio dell\'email:', error);
        } else {
          console.log('Email inviata:', info.response);
        }
      });
    }

    req.flash('success', 'Evento aggiornato con successo.');
    res.redirect(`/eventi/${evento.id}`);
  } catch (error) {
    console.error(error);
    req.flash('error', "Errore nell'aggiornamento dell'evento.");
    res.redirect(`/eventi/modifica/${req.params.id}`);
  }
});

// Rotta per visualizzare i dettagli di un evento
router.get('/:id', async (req, res) => {
  try {
    const evento = await Event.findByPk(req.params.id, {
      include: [
        { model: User, as: 'organizzatore' },
        { model: User, as: 'partecipanti' },
        {
          model: Review,
          include: [{ model: User, attributes: ['nome', 'cognome'] }],
        },
      ],
    });

    if (!evento) {
      req.flash('error', 'Evento non trovato.');
      return res.redirect('/eventi');
    }

    // Calcola la media delle valutazioni
    let mediaValutazioni = 0;
    if (evento.Reviews.length > 0) {
      const sommaValutazioni = evento.Reviews.reduce((acc, recensione) => acc + recensione.valutazione, 0);
      mediaValutazioni = (sommaValutazioni / evento.Reviews.length).toFixed(1);
    }

    let isPartecipante = false;
    if (req.user) {
      const partecipazione = await Participation.findOne({
        where: { UserId: req.user.id, EventId: evento.id },
      });
      isPartecipante = !!partecipazione;
    }

    res.render('eventDetail', { evento, mediaValutazioni , isPartecipante });
  } catch (error) {
    console.error(error);
    res.status(500).send("Errore nel recupero dell'evento.");
  }
});

// Aggiorna la rotta per partecipare a un evento gratuito
router.post('/:id/partecipa', isAuthenticated, async (req, res) => {
  try {
    const evento = await Event.findByPk(req.params.id);
    if (!evento) {
      req.flash('error', 'Evento non trovato.');
      return res.redirect('/eventi');
    }

    if (evento.prezzo > 0) {
      req.flash('error', 'Devi acquistare un biglietto per partecipare a questo evento.');
      return res.redirect(`/eventi/${evento.id}`);
    }

    // Controlla se l'utente ha già partecipato
    const partecipazioneEsistente = await Participation.findOne({
      where: { UserId: req.user.id, EventId: evento.id },
    });

    if (partecipazioneEsistente) {
      req.flash('error', 'Hai già partecipato a questo evento.');
      return res.redirect(`/eventi/${evento.id}`);
    }

    await Participation.create({
      UserId: req.user.id,
      EventId: evento.id,
      data_partecipazione: new Date(),
    });

    // Invia email di conferma
    const mailOptions = {
      from: '"Gestione Eventi" <no-reply@gestione-eventi.com>',
      to: req.user.email,
      subject: 'Conferma Partecipazione',
      text: `Ciao ${req.user.nome},\n\nHai confermato la tua partecipazione all'evento gratuito "${evento.titolo}".\n\nGrazie!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Errore nell\'invio dell\'email:', error);
      } else {
        console.log('Email inviata:', info.response);
      }
    });

    req.flash('success', 'Partecipazione confermata. Controlla la tua email per la conferma.');
    res.redirect(`/eventi/${evento.id}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Errore nella partecipazione all\'evento.');
    res.redirect('/eventi');
  }
});

// Rotta per inviare una recensione (POST)
router.post('/:id/recensioni', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { valutazione, commento } = req.body;

  try {
    const evento = await Event.findByPk(id);
    if (!evento) {
      req.flash('error', 'Evento non trovato.');
      return res.redirect('/eventi');
    }

    // Verifica se l'utente ha partecipato all'evento
    const partecipazione = await Participation.findOne({
      where: { UserId: req.user.id, EventId: id },
    });

    if (!partecipazione) {
      req.flash('error', 'Devi partecipare all\'evento per lasciare una recensione.');
      return res.redirect(`/eventi/${id}`);
    }

    // Verifica se l'utente ha già recensito l'evento
    const recensioneEsistente = await Review.findOne({
      where: { utenteId: req.user.id, eventoId: id },
    });

    if (recensioneEsistente) {
      req.flash('error', 'Hai già recensito questo evento.');
      return res.redirect(`/eventi/${id}`);
    }

    // Crea la recensione
    await Review.create({
      valutazione,
      commento,
      utenteId: req.user.id,
      eventoId: id,
    });

    req.flash('success', 'Recensione inviata con successo.');
    res.redirect(`/eventi/${id}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Errore nell\'invio della recensione.');
    res.redirect(`/eventi/${id}`);
  }
});

// Aggiorna la rotta per eliminare un evento per inviare email ai partecipanti
router.post('/elimina/:id', isAuthenticated, isOrganizzatore, async (req, res) => {
  try {
    const evento = await Event.findByPk(req.params.id);

    if (!evento) {
      req.flash('error', 'Evento non trovato.');
      return res.redirect('/eventi-creati');
    }

    if (evento.organizzatoreId !== req.user.id) {
      req.flash('error', 'Non sei autorizzato a eliminare questo evento.');
      return res.redirect('/eventi-creati');
    }

    // Invia email ai partecipanti
    const partecipanti = await evento.getPartecipanti();

    partecipanti.forEach(partecipante => {
      const mailOptions = {
        from: '"Gestione Eventi" <no-reply@gestione-eventi.com>',
        to: partecipante.email,
        subject: `Evento "${evento.titolo}" cancellato`,
        text: `Ciao ${partecipante.nome},\n\nSiamo spiacenti di informarti che l'evento "${evento.titolo}" è stato cancellato.\n\nCi scusiamo per il disagio.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Errore nell\'invio dell\'email:', error);
        } else {
          console.log('Email inviata a:', partecipante.email);
        }
      });
    });

    await evento.destroy();

    req.flash('success', 'Evento eliminato con successo.');
    res.redirect('/eventi-creati');
  } catch (error) {
    console.error(error);
    req.flash('error', "Errore nell'eliminazione dell'evento.");
    res.redirect('/eventi-creati');
  }
});

// Rotta per acquistare un biglietto
router.post('/:id/acquista', isAuthenticated, async (req, res) => {
  try {
    const evento = await Event.findByPk(req.params.id);

    if (!evento) {
      req.flash('error', 'Evento non trovato.');
      return res.redirect('/eventi');
    }

    // Crea una sessione di pagamento
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: evento.titolo,
            },
            unit_amount: Math.round(evento.prezzo * 100), // Converti in centesimi
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/eventi/${evento.id}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/eventi/${evento.id}`,
    });

    res.redirect(session.url);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Errore durante il processo di pagamento.');
    res.redirect(`/eventi/${req.params.id}`);
  }
});

// Rotta per gestire il successo del pagamento
router.get('/:id/success', isAuthenticated, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

    if (session.payment_status === 'paid') {
      const evento = await Event.findByPk(req.params.id);

      // Controlla se l'utente ha già partecipato
      const partecipazioneEsistente = await Participation.findOne({
        where: { UserId: req.user.id, EventId: evento.id },
      });

      if (!partecipazioneEsistente) {
        await Participation.create({
          UserId: req.user.id,
          EventId: evento.id,
          data_partecipazione: new Date(),
        });

        // Invia email di conferma
        const mailOptions = {
          from: '"Gestione Eventi" <no-reply@gestione-eventi.com>',
          to: req.user.email,
          subject: 'Conferma Acquisto Biglietto',
          text: `Ciao ${req.user.nome},\n\nHai acquistato un biglietto per l'evento "${evento.titolo}".\n\nGrazie!`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Errore nell\'invio dell\'email:', error);
          } else {
            console.log('Email inviata:', info.response);
          }
        });
      }

      req.flash('success', 'Pagamento effettuato con successo. Sei iscritto all\'evento.');
      res.redirect(`/eventi/${evento.id}`);
    } else {
      req.flash('error', 'Pagamento non riuscito.');
      res.redirect(`/eventi/${req.params.id}`);
    }
  } catch (error) {
    console.error(error);
    req.flash('error', 'Errore durante la verifica del pagamento.');
    res.redirect(`/eventi/${req.params.id}`);
  }
});

module.exports = router;
