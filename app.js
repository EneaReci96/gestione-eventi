// app.js
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');
require('dotenv').config();
require('./config/passport');

const { sequelize } = require('./models');

// Importa il Session Store di Sequelize
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Inizializza l'applicazione Express
const app = express();

app.locals.GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Configurazione del motore di template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware per parsing delle richieste
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurazione della sessione
const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(session({
  secret: 'il_mio_segreto', 
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
}));

// Sincronizza il session store
sessionStore.sync();

// Inizializza Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Inizializza Flash per messaggi temporanei
app.use(flash());

// Middleware per rendere disponibili i messaggi flash e l'utente corrente nelle viste
app.use((req, res, next) => {
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages = req.flash('error');
  res.locals.currentUser = req.user;
  res.locals.process = { env: process.env };
  
  next();
});

// Serve file statici
app.use(express.static(path.join(__dirname, 'public')));

// Importa le rotte
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/user');

// Usa le rotte
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/eventi', eventRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server in esecuzione su http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Errore nella sincronizzazione del database:', error);
  });
