'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const eventsData = [];

    const categories = [
      'Concerto',
      'Mostra',
      'Conferenza',
      'Sport',
      'Teatro',
      'Festival',
      'Workshop',
      'Webinar',
      'Altro',
    ];

    // Mappa delle categorie con gli eventi corrispondenti
    const eventsByCategory = {
      'Concerto': [
        {
          titolo: 'Concerto di Vasco Rossi',
          descrizione: 'Un live imperdibile del grande Vasco Rossi.',
          luogo: 'Stadio San Siro, Milano',
          latitudine: 45.478074,
          longitudine: 9.123865,
          data_inizio: new Date(2025, 5, 15, 21, 0),
          data_fine: new Date(2025, 5, 15, 23, 30),
          prezzo: 50.0,
        },
        {
          titolo: 'Coldplay Live',
          descrizione: 'Il tour mondiale dei Coldplay arriva in Italia.',
          luogo: 'Stadio Olimpico, Roma',
          latitudine: 41.933900,
          longitudine: 12.454379,
          data_inizio: new Date(2025, 6, 20, 20, 0),
          data_fine: new Date(2025, 6, 20, 22, 30),
          prezzo: 70.0,
        },
        {
          titolo: 'Jovanotti Beach Party',
          descrizione: 'Musica e divertimento sulla spiaggia con Jovanotti.',
          luogo: 'Spiaggia di Rimini, Rimini',
          latitudine: 44.067828,
          longitudine: 12.580180,
          data_inizio: new Date(2025, 7, 5, 18, 0),
          data_fine: new Date(2025, 7, 5, 23, 0),
          prezzo: 40.0,
        },
      ],
      'Mostra': [
        {
          titolo: 'Mostra di Leonardo da Vinci',
          descrizione: 'Esposizione delle opere di Leonardo da Vinci.',
          luogo: 'Museo degli Uffizi, Firenze',
          latitudine: 43.767798,
          longitudine: 11.255046,
          data_inizio: new Date(2025, 3, 1, 9, 0),
          data_fine: new Date(2025, 3, 30, 18, 0),
          prezzo: 15.0,
        },
        {
          titolo: 'Mostra Impressionisti Francesi',
          descrizione: 'Una collezione unica di opere impressioniste.',
          luogo: 'Museo d\'Orsay, Parigi',
          latitudine: 48.860007,
          longitudine: 2.326583,
          data_inizio: new Date(2025, 4, 10, 10, 0),
          data_fine: new Date(2025, 5, 10, 18, 0),
          prezzo: 20.0,
        },
        {
          titolo: 'Biennale di Venezia',
          descrizione: 'Esposizione internazionale d\'arte contemporanea.',
          luogo: 'Giardini della Biennale, Venezia',
          latitudine: 45.426420,
          longitudine: 12.363634,
          data_inizio: new Date(2025, 5, 11, 10, 0),
          data_fine: new Date(2025, 11, 24, 18, 0),
          prezzo: 25.0,
        },
      ],
      'Conferenza': [
        {
          titolo: 'Conferenza sulle Energie Rinnovabili',
          descrizione: 'Esperti internazionali discutono il futuro delle energie pulite.',
          luogo: 'Centro Congressi, Bologna',
          latitudine: 44.494887,
          longitudine: 11.342616,
          data_inizio: new Date(2025, 2, 5, 9, 0),
          data_fine: new Date(2025, 2, 5, 17, 0),
          prezzo: 0.0,
        },
        {
          titolo: 'Tech Conference 2025',
          descrizione: 'Le ultime novità nel mondo della tecnologia e dell\'innovazione.',
          luogo: 'Fiera Milano, Milano',
          latitudine: 45.519935,
          longitudine: 9.078989,
          data_inizio: new Date(2025, 9, 15, 9, 0),
          data_fine: new Date(2025, 9, 17, 18, 0),
          prezzo: 100.0,
        },
        {
          titolo: 'Conferenza Internazionale sulla Medicina',
          descrizione: 'Ricercatori condividono le ultime scoperte mediche.',
          luogo: 'Palazzo dei Congressi, Roma',
          latitudine: 41.834246,
          longitudine: 12.472615,
          data_inizio: new Date(2025, 4, 20, 9, 0),
          data_fine: new Date(2025, 4, 22, 17, 0),
          prezzo: 150.0,
        },
      ],
      'Sport': [
        {
          titolo: 'Finale Coppa Italia',
          descrizione: 'Le due migliori squadre si sfidano per il titolo.',
          luogo: 'Stadio Olimpico, Roma',
          latitudine: 41.933900,
          longitudine: 12.454379,
          data_inizio: new Date(2025, 4, 25, 20, 45),
          data_fine: new Date(2025, 4, 25, 23, 0),
          prezzo: 60.0,
        },
        {
          titolo: 'Maratona di New York',
          descrizione: 'La maratona più famosa del mondo.',
          luogo: 'Central Park, New York',
          latitudine: 40.785091,
          longitudine: -73.968285,
          data_inizio: new Date(2025, 10, 3, 9, 0),
          data_fine: new Date(2025, 10, 3, 15, 0),
          prezzo: 0.0,
        },
        {
          titolo: 'Partita NBA: Lakers vs Celtics',
          descrizione: 'Sfida epica tra due grandi squadre NBA.',
          luogo: 'Crypto.com Arena, Los Angeles',
          latitudine: 34.043017,
          longitudine: -118.267254,
          data_inizio: new Date(2025, 1, 18, 19, 30),
          data_fine: new Date(2025, 1, 18, 22, 0),
          prezzo: 80.0,
        },
      ],
      'Teatro': [
        {
          titolo: 'La Traviata',
          descrizione: 'Opera in tre atti di Giuseppe Verdi.',
          luogo: 'Teatro alla Scala, Milano',
          latitudine: 45.467985,
          longitudine: 9.189911,
          data_inizio: new Date(2025, 3, 12, 20, 0),
          data_fine: new Date(2025, 3, 12, 23, 0),
          prezzo: 70.0,
        },
        {
          titolo: 'Romeo e Giulietta',
          descrizione: 'La famosa tragedia di William Shakespeare.',
          luogo: 'Shakespeare\'s Globe Theatre, Londra',
          latitudine: 51.508095,
          longitudine: -0.097247,
          data_inizio: new Date(2025, 6, 20, 19, 0),
          data_fine: new Date(2025, 6, 20, 22, 0),
          prezzo: 50.0,
        },
        {
          titolo: 'Notre-Dame de Paris',
          descrizione: 'Musical basato sul romanzo di Victor Hugo.',
          luogo: 'Palais des Congrès, Parigi',
          latitudine: 48.879614,
          longitudine: 2.283457,
          data_inizio: new Date(2025, 9, 5, 20, 0),
          data_fine: new Date(2025, 9, 5, 22, 30),
          prezzo: 65.0,
        },
      ],
      'Festival': [
        {
          titolo: 'Festival di Sanremo',
          descrizione: 'Il festival della canzone italiana.',
          luogo: 'Teatro Ariston, Sanremo',
          latitudine: 43.817799,
          longitudine: 7.775591,
          data_inizio: new Date(2025, 1, 4, 20, 30),
          data_fine: new Date(2025, 1, 8, 23, 30),
          prezzo: 100.0,
        },
        {
          titolo: 'Oktoberfest',
          descrizione: 'La più grande fiera della birra al mondo.',
          luogo: 'Theresienwiese, Monaco di Baviera',
          latitudine: 48.131253,
          longitudine: 11.549355,
          data_inizio: new Date(2025, 8, 20, 10, 0),
          data_fine: new Date(2025, 9, 5, 23, 0),
          prezzo: 0.0,
        },
        {
          titolo: 'Festival del Cinema di Venezia',
          descrizione: 'Uno dei festival cinematografici più prestigiosi al mondo.',
          luogo: 'Lido di Venezia, Venezia',
          latitudine: 45.414442,
          longitudine: 12.366343,
          data_inizio: new Date(2025, 8, 2, 9, 0),
          data_fine: new Date(2025, 8, 12, 23, 0),
          prezzo: 50.0,
        },
      ],
      'Workshop': [
        {
          titolo: 'Workshop di Fotografia',
          descrizione: 'Impara le tecniche avanzate di fotografia.',
          luogo: 'Centro Fotografico, Torino',
          latitudine: 45.070339,
          longitudine: 7.686864,
          data_inizio: new Date(2025, 4, 15, 10, 0),
          data_fine: new Date(2025, 4, 15, 17, 0),
          prezzo: 80.0,
        },
        {
          titolo: 'Corso di Cucina Italiana',
          descrizione: 'Scopri i segreti della cucina tradizionale italiana.',
          luogo: 'Scuola di Cucina, Firenze',
          latitudine: 43.769871,
          longitudine: 11.255576,
          data_inizio: new Date(2025, 5, 10, 9, 0),
          data_fine: new Date(2025, 5, 14, 15, 0),
          prezzo: 200.0,
        },
        {
          titolo: 'Workshop di Yoga',
          descrizione: 'Ritrova il tuo equilibrio interiore.',
          luogo: 'Ubud Yoga Centre, Bali',
          latitudine: -8.519026,
          longitudine: 115.262168,
          data_inizio: new Date(2025, 6, 20, 8, 0),
          data_fine: new Date(2025, 6, 25, 12, 0),
          prezzo: 150.0,
        },
      ],
      'Webinar': [
        {
          titolo: 'Webinar sulla Cybersecurity',
          descrizione: 'Proteggi la tua azienda dalle minacce informatiche.',
          luogo: 'Online',
          latitudine: null,
          longitudine: null,
          data_inizio: new Date(2025, 2, 28, 14, 0),
          data_fine: new Date(2025, 2, 28, 16, 0),
          prezzo: 0.0,
        },
        {
          titolo: 'Corso Online di Marketing Digitale',
          descrizione: 'Strategie efficaci per promuovere il tuo business online.',
          luogo: 'Online',
          latitudine: null,
          longitudine: null,
          data_inizio: new Date(2025, 3, 5, 18, 0),
          data_fine: new Date(2025, 3, 5, 20, 0),
          prezzo: 30.0,
        },
        {
          titolo: 'Webinar su Intelligenza Artificiale',
          descrizione: 'Introduzione all\'AI e alle sue applicazioni.',
          luogo: 'Online',
          latitudine: null,
          longitudine: null,
          data_inizio: new Date(2025, 7, 15, 17, 0),
          data_fine: new Date(2025, 7, 15, 19, 0),
          prezzo: 0.0,
        },
      ],
      'Altro': [
        {
          titolo: 'Fiera del Libro',
          descrizione: 'Scopri le ultime novità editoriali.',
          luogo: 'Lingotto Fiere, Torino',
          latitudine: 45.033224,
          longitudine: 7.663940,
          data_inizio: new Date(2025, 4, 14, 9, 0),
          data_fine: new Date(2025, 4, 18, 20, 0),
          prezzo: 10.0,
        },
        {
          titolo: 'Comicon',
          descrizione: 'Festival internazionale del fumetto e della cultura pop.',
          luogo: 'Mostra d\'Oltremare, Napoli',
          latitudine: 40.823081,
          longitudine: 14.202226,
          data_inizio: new Date(2025, 3, 22, 10, 0),
          data_fine: new Date(2025, 3, 25, 19, 0),
          prezzo: 15.0,
        },
        {
          titolo: 'Mercatini di Natale',
          descrizione: 'Immergiti nell\'atmosfera natalizia tra bancarelle e luci.',
          luogo: 'Piazza Navona, Roma',
          latitudine: 41.898853,
          longitudine: 12.473078,
          data_inizio: new Date(2025, 11, 1, 10, 0),
          data_fine: new Date(2025, 11, 24, 22, 0),
          prezzo: 0.0,
        },
      ],
    };

    // ID degli organizzatori esistenti
    const organizzatoriIds = [1, 2]; // Supponendo che gli organizzatori abbiano ID 1 e 2

    let eventIdCounter = 1;
    for (const [categoria, eventi] of Object.entries(eventsByCategory)) {
      for (const evento of eventi) {
        // Assegniamo un organizzatore casuale tra quelli disponibili
        const organizzatoreId = organizzatoriIds[Math.floor(Math.random() * organizzatoriIds.length)];

        eventsData.push({
          titolo: evento.titolo,
          descrizione: evento.descrizione,
          data_inizio: evento.data_inizio,
          data_fine: evento.data_fine,
          luogo: evento.luogo,
          categoria: categoria,
          latitudine: evento.latitudine,
          longitudine: evento.longitudine,
          prezzo: evento.prezzo,
          organizzatoreId: organizzatoreId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        eventIdCounter++;
      }
    }

    await queryInterface.bulkInsert('Events', eventsData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Events', null, {});
  },
};
