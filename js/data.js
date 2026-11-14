/* SM Cinema redesign — sample data (front-end only, no backend).
   Everything here mirrors the content in the approved Figma prototype. */
window.SM = window.SM || {};

SM.today = { iso: '2026-10-20', label: 'Tue, Oct 20', year: 2026, month: 'October' };

SM.dates = [
  { iso: '2026-10-20', dow: 'Today', day: 20, mon: 'Oct', full: 'Today, Tue Oct 20' },
  { iso: '2026-10-21', dow: 'Wed', day: 21, mon: 'Oct', full: 'Wed, Oct 21' },
  { iso: '2026-10-22', dow: 'Thu', day: 22, mon: 'Oct', full: 'Thu, Oct 22' },
  { iso: '2026-10-23', dow: 'Fri', day: 23, mon: 'Oct', full: 'Fri, Oct 23' },
  { iso: '2026-10-24', dow: 'Sat', day: 24, mon: 'Oct', full: 'Sat, Oct 24' },
  { iso: '2026-10-25', dow: 'Sun', day: 25, mon: 'Oct', full: 'Sun, Oct 25' },
  { iso: '2026-10-26', dow: 'Mon', day: 26, mon: 'Oct', full: 'Mon, Oct 26', disabled: true },
];

SM.prices = { '2D': 350, '3D': 400, 'IMAX': 550, "Director's Club": 650, 'ScreenX': 450 };
SM.discounts = { senior: 0.2, pwd: 0.2 };   // 20% off Regular

SM.movies = [
  {
    id: 'two-valid-ids', title: '2 Valid IDs', rating: 'PG', runtime: 93, genre: 'Drama', language: 'Filipino',
    formats: ['2D'], status: 'now-showing', release: 'Since October 14, 2026',
    poster: 'assets/img/poster-2-valid-ids.jpg', posterLarge: 'assets/img/poster-2-valid-ids-large.jpg',
    trailerThumb: 'assets/img/trailer-2-valid-ids.jpg',
    photos: ['assets/img/photo-2-valid-ids-1.jpg', 'assets/img/photo-2-valid-ids-2.jpg'],
    director: 'Jett P. Espiritu', cast: 'Sylvia Sanchez, Aga Muhlach',
    synopsis: 'Sylvia, a poor farmer, struggles to obtain two valid IDs to claim money sent for her seriously ill husband’s medical treatment. Facing numerous obstacles, she must overcome challenges that test her beliefs and humanity.',
    mtrcb: 'MTRCB rating PG: viewers under 13 must watch with a parent or guardian.',
    tagline: 'Cinemalaya 2026 Best Picture', featured: true,
  },
  { id: 'endgame-encore', title: 'Avengers Endgame: Encore', rating: 'PG', runtime: 183, genre: 'Action', language: 'English', formats: ['2D', 'IMAX'], status: 'now-showing', poster: 'assets/img/poster-endgame-encore.jpg', director: 'Anthony Russo, Joe Russo', cast: 'Robert Downey Jr., Chris Evans, Scarlett Johansson', synopsis: 'The Avengers assemble one last time on the big screen in this remastered encore release with new footage.', release: 'Since September 25, 2026' },
  { id: 'forgotten-island', title: 'Forgotten Island', rating: 'PG', runtime: 148, genre: 'Adventure', language: 'English', formats: ['2D', '3D'], status: 'now-showing', poster: 'assets/img/poster-forgotten-island.jpg', director: 'Jenny Slate', cast: 'Elliott Smith, Mina Park', synopsis: 'Two rival explorers crash-land on an island that keeps rewriting its own map.', release: 'Since September 18, 2026' },
  { id: 'primetime', title: 'Primetime', rating: 'R-16', runtime: 110, genre: 'Thriller', language: 'English', formats: ['2D'], status: 'now-showing', poster: 'assets/img/poster-primetime.jpg', director: 'Lance Oppenheim', cast: 'Robert Pattinson', synopsis: 'A late-night TV host discovers his show is being broadcast to an audience that should not exist.', release: 'Since September 30, 2026' },
  { id: 'other-mommy', title: 'Other Mommy', rating: 'R-16', runtime: 93, genre: 'Horror', language: 'English', formats: ['2D'], status: 'now-showing', poster: 'assets/img/poster-other-mommy.jpg', director: 'James Wan', cast: 'Jessica Chastain', synopsis: 'A mother comes home to a daughter who insists someone else has been tucking her in.', release: 'Since October 7, 2026' },
  { id: 'street-fighter', title: 'Street Fighter', rating: 'PG', runtime: 120, genre: 'Action', language: 'English', formats: ['2D', '3D', 'IMAX'], status: 'now-showing', poster: 'assets/img/poster-street-fighter.jpg', director: 'Kitao Sakurai', cast: 'Andrew Koji, Noah Centineo, Jason Momoa', synopsis: 'The world warriors enter a tournament where every round rewrites the rules of the fight.', release: 'Since October 14, 2026' },
  { id: 'whalefall', title: 'Whalefall', rating: 'PG', runtime: 111, genre: 'Adventure', language: 'English', formats: ['2D'], status: 'now-showing', poster: 'assets/img/poster-whalefall.jpg', director: 'Brian Duffield', cast: 'Austin Abrams, Josh Brolin', synopsis: 'A diver searching for his father’s remains is swallowed by a sperm whale and has one hour of air to escape.', release: 'Since October 14, 2026' },
  { id: 'verity', title: 'Verity', rating: 'PG', runtime: 79, genre: 'Mystery', language: 'English', formats: ['2D'], status: 'now-showing', poster: 'assets/img/poster-verity.jpg', director: 'Michael Showalter', cast: 'Anne Hathaway, Dakota Johnson', synopsis: 'A struggling writer hired to finish a bestselling author’s series finds a manuscript that reads like a confession.', release: 'Since October 2, 2026' },
  { id: 'resident-evil', title: 'Resident Evil', rating: 'R-13', runtime: 103, genre: 'Horror', language: 'English', formats: ['2D', 'IMAX'], status: 'now-showing', poster: 'assets/img/poster-resident-evil.jpg', director: 'Zach Cregger', cast: 'Austin Abrams, Paul Walter Hauser', synopsis: 'A courier’s night delivery drops him into the middle of a city-wide outbreak.', release: 'Since September 16, 2026' },
  { id: 'clayface', title: 'Clayface', rating: 'R-18', runtime: 100, genre: 'Thriller', language: 'English', formats: ['2D'], status: 'now-showing', poster: 'assets/img/poster-clayface.jpg', director: 'James Watkins', cast: 'Tom Rhys Harries', synopsis: 'A washed-up actor’s experimental treatment lets him become anyone, and then no one.', release: 'Since October 16, 2026' },
  // Coming soon
  { id: 'avengers-doomsday', title: 'Avengers: Doomsday', rating: 'PG', runtime: 165, genre: 'Action', language: 'English', formats: ['2D', 'IMAX', 'ScreenX'], status: 'coming-soon', opens: 'December 16, 2026', opensShort: 'Dec 16', poster: null, banner: 'assets/img/banner-avengers-doomsday.jpg', synopsis: 'Doom has arrived. The Avengers face a threat that rewrites the multiverse.', tagline: 'Tickets now on sale · Infinity Vision branches' },
  { id: 'godzilla-minus-zero', title: 'Godzilla Minus Zero', rating: 'PG', runtime: 125, genre: 'Action', language: 'Japanese', formats: ['2D', 'IMAX'], status: 'coming-soon', opens: 'November 4, 2026', opensShort: 'Nov 4', poster: null, synopsis: 'Post-war Japan faces a new kind of terror rising from the sea.' },
  { id: 'wildwood', title: 'Wildwood', rating: 'G', runtime: 104, genre: 'Animation', language: 'English', formats: ['2D', '3D'], status: 'coming-soon', opens: 'November 11, 2026', opensShort: 'Nov 11', poster: null, synopsis: 'A girl ventures into the Impassable Wilderness to rescue her baby brother.' },
  { id: 'look-back', title: 'Look Back', rating: 'PG', runtime: 58, genre: 'Animation', language: 'Japanese', formats: ['2D'], status: 'coming-soon', opens: 'November 25, 2026', opensShort: 'Nov 25', poster: null, synopsis: 'Two young manga artists, one who never leaves her room, and the friendship that changes both.' },
  { id: 'hexed', title: 'Hexed', rating: 'PG', runtime: 96, genre: 'Animation', language: 'English', formats: ['2D'], status: 'coming-soon', opens: 'November 25, 2026', opensShort: 'Nov 25', poster: null, synopsis: 'A boy who sees witches teams up with one to lift the curse on his town.' },
];

SM.heroSlides = [
  { movieId: 'avengers-doomsday', image: 'assets/img/banner-avengers-doomsday.jpg', eyebrow: 'Coming December 16 · Infinity Vision', title: 'Avengers: Doomsday', subtitle: 'Doom has arrived. Advance tickets are now on sale for SM Mall of Asia ScreenX, SM Megamall Cinema 3 and SM Fairview Cinema 1.', cta: 'Get tickets', ctaSecondary: 'Watch trailer' },
  { movieId: 'street-fighter', image: 'assets/img/banner-street-fighter.jpg', eyebrow: 'Now showing', title: 'Street Fighter', subtitle: 'PG · 2h 0m · Action · 2D, 3D and IMAX', cta: 'Buy tickets', ctaSecondary: 'Watch trailer' },
  { movieId: 'two-valid-ids', image: 'assets/img/banner-slide-3.jpg', eyebrow: 'Filipino film of the month', title: '2 Valid IDs', subtitle: 'PG · 1h 33m · Drama · Now showing at SM City Iloilo', cta: 'Buy tickets', ctaSecondary: 'Watch trailer' },
];

SM.cinemas = [
  { id: 'iloilo', name: 'SM City Iloilo', short: 'Iloilo', region: 'Western Visayas', address: 'Benigno Aquino Ave., Mandurriao, Iloilo City', city: 'Iloilo City', features: ['IMAX', "Director's Club"], halls: 6, distanceKm: 2.1, hours: '10:00 AM – 10:00 PM', amenities: ['Mall parking', 'Wheelchair-accessible seating', 'Snack bar on the cinema level'], lat: 10.7202, lng: 122.5621 },
  { id: 'bacolod', name: 'SM City Bacolod', short: 'Bacolod', region: 'Western Visayas', address: 'Rizal St., Reclamation Area, Bacolod City', city: 'Bacolod City', features: ["Director's Club"], halls: 6, distanceKm: 45, hours: '10:00 AM – 10:00 PM', amenities: ['Mall parking', 'Wheelchair-accessible seating', 'Snack Time counter'], lat: 10.676, lng: 122.95 },
  { id: 'roxas', name: 'SM City Roxas', short: 'Roxas', region: 'Western Visayas', address: 'Arnaldo Blvd., Roxas City, Capiz', city: 'Roxas City', features: ['Regular 2D'], halls: 4, distanceKm: 115, hours: '10:00 AM – 9:00 PM', amenities: ['Mall parking', 'Snack Time counter'], lat: 11.585, lng: 122.751 },
  { id: 'seaside-cebu', name: 'SM Seaside City Cebu', short: 'Seaside Cebu', region: 'Central Visayas', address: 'South Road Properties, Cebu City', city: 'Cebu City', features: ['IMAX', "Director's Club"], halls: 8, distanceKm: 190, hours: '10:00 AM – 11:00 PM', amenities: ['Mall parking', 'Wheelchair-accessible seating', 'Snack bar on the cinema level', 'Large Screen Format'], lat: 10.282, lng: 123.88 },
  { id: 'cebu', name: 'SM City Cebu', short: 'Cebu', region: 'Central Visayas', address: 'North Reclamation Area, Cebu City', city: 'Cebu City', features: ['Dolby Atmos'], halls: 6, distanceKm: 192, hours: '10:00 AM – 10:00 PM', amenities: ['Mall parking', 'Wheelchair-accessible seating', 'Snack Time counter'], lat: 10.3119, lng: 123.9177 },
];

/* Showtimes. Each entry: cinema, movie, hall, format, times (with optional state). Dates not listed fall back
   to the same schedule (the build can vary it by day index for realism). */
SM.showtimes = [
  { cinemaId: 'iloilo', movieId: 'two-valid-ids', hall: 'Cinema 4', format: '2D', times: [
    { t: '11:00 AM' }, { t: '1:30 PM' }, { t: '4:00 PM', state: 'few' }, { t: '6:30 PM' }, { t: '9:00 PM' }, { t: '10:30 PM', state: 'sold' } ] },
  { cinemaId: 'iloilo', movieId: 'forgotten-island', hall: 'Cinema 1', format: '3D', times: [ { t: '12:00 PM' }, { t: '3:10 PM' }, { t: '6:20 PM', state: 'few' }, { t: '9:30 PM' } ] },
  { cinemaId: 'iloilo', movieId: 'street-fighter', hall: 'Cinema 2', format: '3D', times: [ { t: '11:30 AM' }, { t: '2:00 PM' }, { t: '4:30 PM' }, { t: '7:00 PM', state: 'few' }, { t: '9:30 PM' } ] },
  { cinemaId: 'iloilo', movieId: 'street-fighter', hall: 'IMAX', format: 'IMAX', times: [ { t: '1:00 PM' }, { t: '4:00 PM' }, { t: '7:00 PM' }, { t: '10:00 PM', state: 'sold' } ] },
  { cinemaId: 'iloilo', movieId: 'endgame-encore', hall: 'IMAX', format: 'IMAX', times: [ { t: '12:30 PM' }, { t: '4:10 PM' }, { t: '7:50 PM', state: 'few' } ] },
  { cinemaId: 'iloilo', movieId: 'clayface', hall: 'Cinema 3', format: '2D', times: [ { t: '2:30 PM' }, { t: '5:00 PM' }, { t: '7:30 PM' }, { t: '10:00 PM' } ] },
  { cinemaId: 'iloilo', movieId: 'resident-evil', hall: 'Cinema 5', format: '2D', times: [ { t: '1:00 PM' }, { t: '3:30 PM' }, { t: '6:00 PM' }, { t: '8:30 PM', state: 'few' } ] },
  { cinemaId: 'iloilo', movieId: 'primetime', hall: 'Cinema 6', format: '2D', times: [ { t: '12:15 PM' }, { t: '2:45 PM' }, { t: '5:15 PM' }, { t: '7:45 PM' } ] },
  { cinemaId: 'iloilo', movieId: 'other-mommy', hall: 'Cinema 6', format: '2D', times: [ { t: '10:15 PM', state: 'few' } ] },
  { cinemaId: 'iloilo', movieId: 'whalefall', hall: 'Cinema 5', format: '2D', times: [ { t: '11:00 AM' } ] },
  { cinemaId: 'iloilo', movieId: 'verity', hall: 'Cinema 3', format: '2D', times: [ { t: '12:00 PM' } ] },
  { cinemaId: 'bacolod', movieId: 'two-valid-ids', hall: 'Cinema 2', format: '2D', times: [ { t: '12:00 PM' }, { t: '2:30 PM' }, { t: '5:00 PM' }, { t: '7:30 PM' } ] },
  { cinemaId: 'bacolod', movieId: 'street-fighter', hall: 'Cinema 1', format: '2D', times: [ { t: '1:00 PM' }, { t: '3:30 PM' }, { t: '6:00 PM', state: 'few' }, { t: '8:30 PM' } ] },
  { cinemaId: 'bacolod', movieId: 'forgotten-island', hall: 'Cinema 3', format: '2D', times: [ { t: '11:30 AM' }, { t: '2:30 PM' }, { t: '5:30 PM' } ] },
  { cinemaId: 'roxas', movieId: 'two-valid-ids', hall: 'Cinema 1', format: '2D', times: [ { t: '1:00 PM' }, { t: '4:00 PM' }, { t: '7:00 PM' } ] },
  { cinemaId: 'roxas', movieId: 'street-fighter', hall: 'Cinema 2', format: '2D', times: [ { t: '12:30 PM' }, { t: '3:30 PM' }, { t: '6:30 PM' } ] },
  { cinemaId: 'seaside-cebu', movieId: 'street-fighter', hall: 'IMAX', format: 'IMAX', times: [ { t: '12:00 PM' }, { t: '3:00 PM' }, { t: '6:00 PM' }, { t: '9:00 PM' } ] },
  { cinemaId: 'seaside-cebu', movieId: 'two-valid-ids', hall: 'Cinema 5', format: '2D', times: [ { t: '11:00 AM' }, { t: '1:30 PM' }, { t: '4:00 PM' }, { t: '6:30 PM' } ] },
  { cinemaId: 'seaside-cebu', movieId: 'endgame-encore', hall: 'IMAX', format: 'IMAX', times: [ { t: '1:00 PM' }, { t: '5:00 PM', state: 'few' } ] },
  { cinemaId: 'seaside-cebu', movieId: 'forgotten-island', hall: 'Cinema 2', format: '3D', times: [ { t: '12:30 PM' }, { t: '3:30 PM' }, { t: '6:30 PM' } ] },
  { cinemaId: 'cebu', movieId: 'two-valid-ids', hall: 'Cinema 3', format: '2D', times: [ { t: '12:00 PM' }, { t: '2:30 PM' }, { t: '5:00 PM' }, { t: '7:30 PM' } ] },
  { cinemaId: 'cebu', movieId: 'resident-evil', hall: 'Cinema 1', format: '2D', times: [ { t: '1:00 PM' }, { t: '3:30 PM' }, { t: '6:00 PM' }, { t: '8:30 PM' } ] },
  { cinemaId: 'cebu', movieId: 'street-fighter', hall: 'Cinema 2', format: '2D', times: [ { t: '11:30 AM' }, { t: '2:00 PM' }, { t: '4:30 PM' }, { t: '7:00 PM' } ] },
];

/* Seat map: rows A–J, 16 seats in three blocks (1-4 | 5-12 | 13-16). Taken seats are fixed sample data.
   J1 and J2 are wheelchair spaces. The current booking has F8 and F9 selected. */
SM.seatMap = {
  rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], seatsPerRow: 16, blocks: [[1, 4], [5, 12], [13, 16]],
  wheelchair: ['J1', 'J2'],
  taken: ['A7', 'A11', 'A12', 'B2', 'B3', 'B8', 'B15', 'B16', 'C2', 'C8', 'C9', 'C14', 'D3', 'D8', 'D9', 'E1', 'E6', 'E7', 'E9', 'E11', 'E12', 'F1', 'F3', 'F10', 'F15', 'G12', 'G14', 'G15', 'G16', 'H4', 'H5', 'H10', 'H12', 'H13', 'I1', 'I2', 'I8', 'I14', 'J6', 'J8', 'J10', 'J11', 'J12', 'J15', 'J16'],
  selected: ['F8', 'F9'],
};

SM.user = {
  name: 'Christopher Dela Cruz', initials: 'CD', email: 'christopher.delacruz@gmail.com', mobile: '0917 123 4567',
  birthday: 'March 14, 2001', preferredCinemaId: 'iloilo', tier: 'Silver', nextTier: 'Gold', memberSince: 'March 2024',
  points: 1250, pointsToNext: 750, tierMax: 2000,
  settings: { promoEmails: true, showtimeReminders: true, darkMode: false },
  paymentMethods: [ { type: 'GCash', label: 'GCash', detail: '0917 ••• 4567', isDefault: true }, { type: 'Card', label: 'Visa ending 4242', detail: 'Expires 12/29' } ],
  discountIds: [],
};

SM.bookings = [
  { ref: 'CMC2283746763', status: 'upcoming', movieId: 'two-valid-ids', cinemaId: 'iloilo', hall: 'Cinema 4', format: '2D', date: 'Tue, 20 Oct 2026', dateShort: '20 October 2026', time: '1:30 PM', seats: ['F8', 'F9'], tickets: [{ type: 'Regular', qty: 2, price: 350 }], total: 700, paidWith: 'GCash', invoice: 'INV-2026-1020-3188', vat: 75 },
  { ref: 'CMC2283747102', status: 'upcoming', movieId: 'clayface', cinemaId: 'iloilo', hall: 'Cinema 3', format: '2D', date: 'Fri, 23 Oct 2026', dateShort: '23 October 2026', time: '2:30 PM', seats: ['F5', 'F6'], tickets: [{ type: 'Regular', qty: 2, price: 350 }], total: 700, paidWith: 'Maya', invoice: 'INV-2026-1019-2971', vat: 75 },
  { ref: 'SMC-9X2P4', status: 'past', movieId: 'spiderman-bnd', title: 'Spider-man: Brand New Day', rating: 'PG', poster: 'assets/img/poster-spiderman-brand-new-day.jpg', cinemaId: 'iloilo', hall: 'Cinema 3', format: '2D', date: 'Fri, 31 Jul 2026', time: '8:30 PM', seats: ['E3', 'E4', 'E5', 'E6'], tickets: [{ type: 'Regular', qty: 4, price: 350 }], total: 1400, vat: 150, paidWith: 'GCash', invoice: 'INV-2026-0731-2041' },
  { ref: 'SMC-4H7N2', status: 'past', movieId: 'the-odyssey', title: 'The Odyssey', rating: 'PG-13', poster: 'assets/img/poster-the-odyssey.jpg', cinemaId: 'iloilo', hall: 'IMAX', format: 'IMAX', date: 'Sat, 15 Aug 2026', time: '7:00 PM', seats: ['D7', 'D8'], tickets: [{ type: 'IMAX', qty: 2, price: 550 }], total: 1100, vat: 118, paidWith: 'Maya', invoice: 'INV-2026-0815-1187' },
  { ref: 'SMC-2K9L8', status: 'past', movieId: 'michael', title: 'Michael', rating: 'PG', poster: 'assets/img/poster-michael.jpg', cinemaId: 'iloilo', hall: 'Cinema 1', format: '2D', date: 'Sat, 5 Sep 2026', time: '6:00 PM', seats: ['G6', 'G7', 'G8'], tickets: [{ type: 'Regular', qty: 3, price: 350 }], total: 1050, vat: 113, paidWith: 'Visa ending 4242', invoice: 'INV-2026-0905-0963' },
];

SM.rewards = [
  { id: 'free-ticket', name: 'Free regular ticket', cost: 1000, voucher: 'RWD-T7K4P2', note: 'Applies to one regular 2D ticket. Pick “Use reward” at payment when you book.', redeemedNote: 'Free regular ticket is ready. Use it at payment when you book your next movie.' },
  { id: 'popcorn-combo', name: 'Popcorn & drink combo', cost: 450, voucher: 'RWD-P3M8Q5', note: 'Claim it at any SM Cinema snack bar by showing your voucher code.', redeemedNote: 'Popcorn & drink combo is ready. Show this code at any SM Cinema snack bar.' },
  { id: 'imax-upgrade', name: 'IMAX upgrade', cost: 600, voucher: 'RWD-X9C2L6', note: 'Upgrades one regular ticket to IMAX. Pick “Use reward” at payment.', redeemedNote: 'IMAX upgrade is ready. Use it at payment when you book an IMAX showing.' },
  { id: 'directors-club', name: "Director's Club seat", cost: 1500, voucher: 'RWD-D5V1R9', note: 'Upgrades one ticket to a Director’s Club recliner at participating branches.' },
];
SM.voucherValidUntil = 'Nov 19, 2026';

SM.pointsActivity = [
  { kind: 'earn', title: 'Avengers: Doomsday · 2 tickets', where: 'SM City Iloilo · Oct 20, 2026', pts: 120 },
  { kind: 'redeem', title: 'Redeemed: Popcorn & drink combo', where: 'SM City Iloilo · Oct 20, 2026', pts: -450 },
  { kind: 'earn', title: 'Forgotten Island · 3 tickets', where: 'SM City Iloilo · Oct 12, 2026', pts: 210 },
];

SM.notifications = [
  { id: 1, title: 'Booking confirmed', body: '2 Valid IDs · Today, 1:30 PM · Seats F8, F9', time: 'Just now', unread: true, link: 'tickets.html' },
  { id: 2, title: 'Tickets on sale soon', body: 'Avengers: Doomsday opens December 16 at SM Cinema.', time: '2h ago', unread: true, link: 'movie.html?id=avengers-doomsday' },
  { id: 3, title: 'Showtime reminder', body: 'Clayface starts Fri, Oct 23 at 2:30 PM in Cinema 3.', time: 'Yesterday', unread: false, link: 'tickets.html' },
];

SM.experiences = [
  { id: 'imax', name: 'IMAX', badge: 'Best for blockbusters', tagline: 'A wall-to-wall, ceiling-to-ceiling screen with sound you can feel.', bullets: ['Wall-to-wall, ceiling-to-ceiling screen', 'IMAX with Laser for a sharper, brighter picture', 'Powerful, precisely tuned sound'], near: 'Near you: SM City Iloilo · 2.1 km', cta: 'See IMAX showtimes', gradient: 'linear-gradient(135deg,#0A2CFF 0%,#00B4FF 100%)', icon: 'crop_free' },
  { id: 'directors-club', name: "Director's Club", badge: 'Most comfortable', tagline: 'Premium cinemas with recliners and snacks brought to your seat.', bullets: ['Leather recliners with push-button controls', 'Dolby Atmos sound and laser projection', 'Snacks and drinks delivered to your seat'], near: 'Near you: SM City Iloilo · 2.1 km', cta: "See Director's Club showtimes", gradient: 'linear-gradient(135deg,#3A0C2A 0%,#8A5300 100%)', icon: 'weekend' },
  { id: 'screenx', name: 'ScreenX', badge: 'Most immersive', tagline: 'The movie spills onto the side walls for a panoramic view.', bullets: ['Picture extends onto both side walls', '270° panoramic viewing', 'Only for movies released in ScreenX'], near: 'Only at SM Mall of Asia, Pasay', cta: 'See ScreenX showtimes', gradient: 'linear-gradient(135deg,#3B0A5E 0%,#E0286A 100%)', icon: 'view_array' },
  { id: 'regular', name: 'Regular Cinema', badge: 'Best value', tagline: 'The classic movie night, showing every film on the schedule.', bullets: ['Every movie on the schedule', 'Available at every SM Cinema branch', 'The most affordable ticket'], near: 'At every branch · nearest 2.1 km', cta: 'See all showtimes', gradient: 'linear-gradient(135deg,#0B1A4F 0%,#0A2CFF 100%)', icon: 'movie' },
];
SM.experienceCompare = {
  columns: ['Regular Cinema', 'IMAX', 'ScreenX', "Director's Club"],
  rows: [
    { label: 'Screen', cells: [['-', 'Standard screen'], ['+', 'Wall-to-wall, ceiling-to-ceiling screen'], ['+', 'Picture extends onto both side walls'], ['+', 'Laser projection']] },
    { label: 'Sound', cells: [['-', 'Standard sound'], ['+', 'IMAX sound system'], ['-', 'Standard sound'], ['+', 'Dolby Atmos']] },
    { label: 'Seats', cells: [['-', 'Standard seats'], ['-', 'Standard seats'], ['-', 'Standard seats'], ['+', 'Leather recliners']] },
    { label: 'Snacks', cells: [['-', 'Snack Time counter'], ['-', 'Snack Time counter'], ['-', 'Snack Time counter'], ['+', 'Delivered to your seat']] },
    { label: 'Where', cells: [['', 'Every branch'], ['', 'Select branches'], ['', 'SM Mall of Asia only'], ['', '25+ branches nationwide']] },
    { label: 'Best for', cells: [['', 'Everyday movie nights'], ['', 'Big blockbusters'], ['', 'Action & adventure'], ['', 'Dates and special occasions']] },
  ],
};

SM.promos = [
  { title: 'Tuesday treat', body: '₱40 off every ticket on Tuesdays, Regular, IMAX or Director’s Club.', tag: 'Every Tuesday' },
  { title: 'Snack Time bundle', body: 'Large popcorn + 2 drinks for ₱199 when you book online.', tag: 'Online only' },
  { title: 'Cinema Points', body: 'Earn 1 point for every ₱10 you spend. 1,000 points = a free ticket.', tag: 'Members' },
];

/* Helpers used by both the mockup and the build */
SM.movieById = id => SM.movies.find(m => m.id === id);
SM.cinemaById = id => SM.cinemas.find(c => c.id === id);
SM.runtimeLabel = min => `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, '0')}m`;
SM.peso = n => '₱' + Number(n).toLocaleString('en-PH');
SM.showtimesFor = (cinemaId, movieId) => SM.showtimes.filter(s => s.cinemaId === cinemaId && (!movieId || s.movieId === movieId));
SM.moviesAt = cinemaId => [...new Set(SM.showtimesFor(cinemaId).map(s => s.movieId))].map(SM.movieById);
