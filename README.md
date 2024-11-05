# Gestione Eventi

## Descrizione

"Gestione Eventi" è un'applicazione web che permette agli utenti di registrarsi, visualizzare eventi, partecipare agli eventi e, per gli organizzatori, creare e gestire eventi. L'applicazione offre funzionalità come registrazione e login, ricerca avanzata di eventi, partecipazione agli eventi, gestione dei biglietti, e molto altro.

# LINK Presentazione Progetto Youtube

    -https://youtu.be/aODRxK1V7bs

## Prerequisiti

- **Node.js** versione 14.x o superiore
- **npm** versione 6.x o superiore
- **SQLite** (incluso nel progetto tramite il file `database.sqlite`)

## Installazione

1. **Clona il repository o estrai l'archivio**

   ```bash
   # Clona il repository
   git clone https://github.com/EneaReci96/gestione-eventi.git
   
   # Oppure estrai l'archivio .zip nella directory desiderata

1. **Entra nella cartella del progetto**
   
    cd gestione-eventi

3. **Installa dipendenze**

    npm install

4. **Configura le variabili d'ambiente**

Crea un file .env nella root del progetto e aggiungi le seguenti variabili:
    PORT=3000
    EMAIL_USER=
    EMAIL_PASS=
    GOOGLE_MAPS_API_KEY=
    STRIPE_SECRET_KEY=
    SENDGRID_API_KEY=

5. **Esegui le migrazioni e i seeders per configurare il database**

-npx sequelize-cli db:migrate
Ripristinare il database (opzionale):

Se vuoi ripulire il database prima di inserire i nuovi dati, puoi usare:

- npx sequelize-cli db:seed:undo:all
Eseguire i nuovi seed:

- npx sequelize-cli db:seed:all

# Utilizzo dell'Applicazione

Credenziali Utenti di Prova
Sono stati creati alcuni utenti di prova che puoi utilizzare per accedere all'applicazione:

Organizzatore 1
Username: organizzatore1
Password: password1
Organizzatore 2
Username: organizzatore2
Password: password2
Partecipante 1
Username: partecipante1
Password: password3
Partecipante 2
Username: partecipante2
Password: password4


Funzionalità Principali
Registrazione e Login

Gli utenti possono registrarsi fornendo username, password, email, nome e cognome. Dopo la registrazione, possono effettuare il login per accedere alle funzionalità riservate.

Visualizzazione degli Eventi

Tutti gli utenti possono visualizzare la lista degli eventi disponibili. È possibile effettuare una ricerca avanzata utilizzando filtri come parola chiave, date, luogo, categoria, prezzo massimo e valutazione minima.

Partecipazione a un Evento

Gli utenti possono partecipare agli eventi gratuiti con un semplice click. Per gli eventi a pagamento, è integrato un sistema di pagamento con Stripe.

Visualizzazione dei Biglietti

Gli utenti possono visualizzare i biglietti degli eventi a cui hanno partecipato o per i quali hanno acquistato un biglietto.

Creazione di un Evento (per Organizzatori)

Gli utenti con ruolo di "organizzatore" possono creare nuovi eventi, specificando dettagli come titolo, descrizione, date, luogo (con selezione su mappa), categoria, prezzo, ecc.

Recensioni

Gli utenti che hanno partecipato a un evento possono lasciare una recensione con valutazione e commento.

Funzionalità Aggiuntive
Diventa Organizzatore

Gli utenti possono richiedere di diventare organizzatori direttamente dall'applicazione.

Invio Email di Conferma e Notifiche

Il sistema invia email di conferma per la registrazione, partecipazione a eventi, acquisto di biglietti, e notifiche in caso di modifiche o cancellazioni di eventi.

Mappa Interattiva

Utilizzo di Google Maps per selezionare la posizione degli eventi e visualizzare la loro posizione.

Sistema di Pagamento Integrato

Integrazione con Stripe per gestire i pagamenti degli eventi a pagamento.

Ricerca Avanzata

Possibilità di effettuare ricerche avanzate tra gli eventi con diversi filtri.

Recensioni e Valutazioni

Sistema di recensioni per gli eventi, con calcolo della valutazione media.