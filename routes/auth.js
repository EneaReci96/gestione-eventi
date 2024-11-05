// routes/auth.js

const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { Op } = require('sequelize'); 
const transporter = require('../config/nodemailer');

// Rotta per la registrazione (GET)
router.get('/register', (req, res) => {
  res.render('register');
});

// Rotta per la registrazione (POST)
router.post('/register', async (req, res) => {
  const { username, password, email, nome, cognome } = req.body;

  try {
    // Controlla se l'username o l'email esistono già
    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (userExists) {
      req.flash('error', 'Nome utente o email già in uso.');
      return res.redirect('/register');
    }

    // Crea il nuovo utente
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      password: hashedPassword,
      email,
      nome,
      cognome,
      ruolo: 'partecipante', 
    });

    // Invia email di conferma
    const mailOptions = {
      from: '"Gestione Eventi" <no-reply@gestione-eventi.com>',
      to: email,
      subject: 'Conferma Registrazione',
      text: `Ciao ${nome},\n\nGrazie per esserti registrato alla nostra piattaforma!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Errore nell\'invio dell\'email:', error);
      } else {
        console.log('Email inviata:', info.response);
      }
    });

    req.flash('success', 'Registrazione avvenuta con successo. Controlla la tua email per la conferma.');
    res.redirect('/login');
  } catch (error) {
    console.error(error);

    // Gestione specifica dell'errore SequelizeUniqueConstraintError
    if (error.name === 'SequelizeUniqueConstraintError') {
      let errorMessage = 'Errore nella registrazione.';

      // Determina quale campo ha causato l'errore
      if (error.errors && error.errors.length > 0) {
        const field = error.errors[0].path;
        if (field === 'username') {
          errorMessage = 'Nome utente già in uso.';
        } else if (field === 'email') {
          errorMessage = 'Email già in uso.';
        }
      }

      req.flash('error', errorMessage);
      res.redirect('/register');
    } else {
      req.flash('error', 'Errore nella registrazione. Riprova.');
      res.redirect('/register');
    }
  }
});

// Rotta per il login (GET)
router.get('/login', (req, res) => {
  res.render('login');
});

// Rotta per il login (POST)
router.post('/login', passport.authenticate('local', {
  successRedirect: '/eventi',
  failureRedirect: '/login',
  failureFlash: true,
}));

// Rotta per il logout
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    req.flash('success', 'Logout effettuato con successo.');
    res.redirect('/login');
  });
});

module.exports = router;
