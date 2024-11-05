// middlewares/auth.js

// Middleware per verificare se l'utente è autenticato
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Devi effettuare il login per accedere a questa pagina.');
  res.redirect('/login');
}

// Middleware per verificare se l'utente è un organizzatore
function isOrganizzatore(req, res, next) {
  if (req.user && req.user.ruolo === 'organizzatore') {
    return next();
  }
  req.flash('error', 'Devi essere un organizzatore per accedere a questa pagina.');
  res.redirect('/eventi');
}

module.exports = {
  isAuthenticated,
  isOrganizzatore,
};
