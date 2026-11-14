/* Movie details page: hero, facts, media, booking rail (cinema → date → showtime → continue) */
(function () {
  const { $, $$, icon, ratingChip, currentCinema, qs, store, openModal, closeModal, toast } = SMUI;
  const movie = SM.movieById(qs('id')) || SM.movieById('two-valid-ids');
  const soon = movie.status === 'coming-soon';
  document.title = `${movie.title} – SM Cinema`;

  /* ---------- state ---------- */
  const state = {
    cinemaId: qs('cinema') || currentCinema().id,
    dateIso: qs('date') || SM.dates[0].iso,
    time: qs('time') || null, format: null, hall: null,
  };
  const cinema = () => SM.cinemaById(state.cinemaId);
  const dateObj = () => SM.dates.find(d => d.iso === state.dateIso) || SM.dates[0];

  /* ---------- hero + body ---------- */
  const poster = movie.posterLarge || movie.poster;
  $('#heroBg').style.backgroundImage = poster ? `url(${poster})` : `url(${movie.banner || ''})`;
  $('#crumbTitle').textContent = movie.title;
  $('#poster').outerHTML = poster ? `<img class="poster" id="poster" src="${poster}" alt="${movie.title} poster">` : `<div class="poster" id="poster" style="display:grid;place-items:center;background:linear-gradient(160deg,var(--blue-800),var(--blue-600));font:800 22px var(--font-display);text-align:center;padding:16px">${movie.title}</div>`;
  $('#title').textContent = movie.title;
  $('#chips').innerHTML = [ratingChip(movie.rating), ...[SM.runtimeLabel(movie.runtime), movie.genre, ...movie.formats, movie.language].map(x => `<span class="tag">${x}</span>`)].join('');
  $('#mtrcb').textContent = movie.mtrcb || `MTRCB rating ${movie.rating}.`;
  $('#synopsis').textContent = movie.synopsis;
  $('#facts').innerHTML = `<dt>Director</dt><dd>${movie.director || 'TBA'}</dd><dt>Cast</dt><dd>${movie.cast || 'TBA'}</dd><dt>In cinemas</dt><dd>${soon ? 'Opens ' + movie.opens : movie.release}</dd><dt>Language</dt><dd>${movie.language}</dd><dt>Formats</dt><dd>${movie.formats.join(', ')}</dd>`;
  const photos = [...(movie.photos || []), ...(poster ? [poster] : [])];
  const media = [];
  media.push(`<a class="media-tile trailer" href="#" data-open="trailerModal" aria-label="Watch the official trailer"><img src="${movie.trailerThumb || poster || movie.banner}" alt=""><span class="play">${icon('play_arrow', 'lg')}</span><span class="cap">Watch the official trailer</span></a>`);
  if (photos[0]) media.push(`<a class="media-tile" href="#" data-photo="0"><img src="${photos[0]}" alt="${movie.title} photo 1"></a>`);
  if (photos[1]) media.push(`<a class="media-tile more" href="#" data-photo="1"><img src="${photos[1]}" alt=""><span class="cap">${icon('photo_library', 'lg')}View all 12 photos</span></a>`);
  else media.push(`<div class="media-tile more"><span class="cap">${icon('photo_library', 'lg')}Photos coming soon</span></div>`);
  $('#media').innerHTML = media.join('');
  $('#trailerThumb').src = movie.trailerThumb || poster || movie.banner;
  $('#trailerTitle').textContent = `${movie.title} — official trailer`;
  // lightbox
  const lb = $('#lightbox'); let photoIdx = 0;
  const showPhoto = (i) => { photoIdx = (i + photos.length) % photos.length; $('#lbImg').src = photos[photoIdx]; $('#lbCount').textContent = `${photoIdx + 1} / ${photos.length}`; };
  $$('[data-photo]').forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); showPhoto(+a.dataset.photo); openModal(lb); }));
  $('#lbPrev').addEventListener('click', () => showPhoto(photoIdx - 1));
  $('#lbNext').addEventListener('click', () => showPhoto(photoIdx + 1));

  /* ---------- booking rail ---------- */
  function renderCinema() {
    const c = cinema();
    $('#cinemaPick').innerHTML = `${icon('location_on')}<span><b>${c.name}</b><small>${c.address}</small></span><button class="link" id="changeCinema">Change</button>`;
    $('#changeCinema').addEventListener('click', () => openModal('cinemaModal'));
    $('#cinemaList').innerHTML = SM.cinemas.map(x => {
      const has = SM.showtimesFor(x.id, movie.id).length;
      return `<button class="branch" data-c="${x.id}" aria-pressed="${x.id === c.id}">${icon('location_on')}<span><b>${x.name}</b><small>${x.address}</small><span class="feat">${has ? x.features.join(' · ') + ' · ' + x.halls + ' halls' : 'Not showing this movie'}</span></span><span class="km">${x.distanceKm} km</span></button>`;
    }).join('');
    $$('#cinemaList .branch').forEach(b => b.addEventListener('click', () => { state.cinemaId = b.dataset.c; state.time = null; store.set('cinema', state.cinemaId); closeModal('cinemaModal'); renderCinema(); renderShowtimes(); SMUI.syncCinema(); }));
    const info = $('#cinemaInfo'); info.querySelector('.ci-name').textContent = c.name; info.querySelector('.ci-addr').textContent = c.address; info.querySelector('.ci-hours').textContent = `Open today · ${c.hours}`;
    info.querySelector('.ci-tags').innerHTML = [...c.features, `${c.halls} halls`].map(f => `<span class="tag blue">${f}</span>`).join('');
    info.querySelector('.ci-amen').innerHTML = c.amenities.map(a => `<li>${icon('check', 'sm')}${a}</li>`).join('');
  }
  function renderDates() {
    $('#dateStrip').innerHTML = SM.dates.map(d => `<button class="date-chip" data-d="${d.iso}" aria-pressed="${d.iso === state.dateIso}" ${d.disabled ? 'disabled title="Schedule not released yet"' : ''}><span class="dow">${d.dow}</span><span class="day">${d.day}</span><span class="mon">${d.mon}</span></button>`).join('');
    $$('#dateStrip .date-chip').forEach(b => b.addEventListener('click', () => { state.dateIso = b.dataset.d; state.time = null; $$('#dateStrip .date-chip').forEach(x => x.setAttribute('aria-pressed', x === b)); renderShowtimes(); }));
    $('#monthLbl').textContent = `${SM.today.month} ${SM.today.year}`;
  }
  function renderShowtimes() {
    const groups = SM.showtimesFor(state.cinemaId, movie.id);
    const host = $('#showtimeGroups');
    if (!groups.length) { host.innerHTML = `<div class="empty"><span class="ms">event_busy</span><h3>No showtimes at ${cinema().name}</h3><p>Pick another branch to see its schedule.</p><button class="btn btn-secondary btn-sm" id="emptyChange">Change cinema</button></div>`; $('#emptyChange').addEventListener('click', () => openModal('cinemaModal')); updateSelection(); return; }
    // shift times by date index for a little realism (sold-out/few states rotate)
    const di = SM.dates.findIndex(d => d.iso === state.dateIso);
    host.innerHTML = groups.map(g => `<div class="format-group">
        <div class="fg-head"><b>${g.hall === g.format ? g.format : g.format + ' · ' + g.hall}</b><span class="muted">${SM.peso(SM.prices[g.format])} per seat</span></div>
        <div class="showtimes">${g.times.map((t, i) => {
          let st = t.state || ''; if (di > 0) { st = (i + di) % 5 === 0 ? 'few' : (i + di) % 7 === 0 ? 'sold' : ''; }
          const pressed = state.time === t.t && state.format === g.format;
          return `<button class="showtime ${st}" data-t="${t.t}" data-f="${g.format}" data-h="${g.hall}" aria-pressed="${pressed}" ${st === 'sold' ? 'disabled' : ''}>${t.t}${st === 'few' ? `<small><span class="status-dot warn"></span>Few left</small>` : st === 'sold' ? `<small>Sold out</small>` : ''}</button>`;
        }).join('')}</div></div>`).join('');
    $$('#showtimeGroups .showtime').forEach(b => b.addEventListener('click', () => { state.time = b.dataset.t; state.format = b.dataset.f; state.hall = b.dataset.h; $$('#showtimeGroups .showtime').forEach(x => x.setAttribute('aria-pressed', x === b)); updateSelection(); }));
    // preselect from query
    if (state.time && !state.format) { const b = $(`#showtimeGroups .showtime[data-t="${state.time}"]:not([disabled])`); if (b) b.click(); else state.time = null; }
    updateSelection();
  }
  function updateSelection() {
    const sel = $('#selection'), btn = $('#continueBtn');
    if (state.time) {
      sel.hidden = false;
      sel.innerHTML = `<div class="l">Your selection</div><div class="v">${dateObj().full} at ${state.time}</div><div class="s">${cinema().name}, ${state.hall}, ${state.format} · ${SM.peso(SM.prices[state.format])} per seat</div>`;
      btn.removeAttribute('aria-disabled');
      btn.href = `seats.html?id=${movie.id}&cinema=${state.cinemaId}&date=${state.dateIso}&time=${encodeURIComponent(state.time)}&format=${encodeURIComponent(state.format)}&hall=${encodeURIComponent(state.hall)}`;
      $('#railHint').textContent = 'Seats are chosen on the next step.';
    } else {
      sel.hidden = true; btn.setAttribute('aria-disabled', 'true'); btn.href = '#';
      $('#railHint').textContent = 'Pick a date and a showtime to continue.';
    }
  }
  $('#continueBtn').addEventListener('click', (e) => {
    if (!state.time) { e.preventDefault(); toast({ icon: 'schedule', tone: 'blue', title: 'Pick a showtime first', body: 'Choose a date and time to continue to seats.', timeout: 3500 }); return; }
    store.set('booking', { movieId: movie.id, cinemaId: state.cinemaId, dateIso: state.dateIso, time: state.time, format: state.format, hall: state.hall, price: SM.prices[state.format] });
  });

  if (soon) {
    $('#railBody').innerHTML = `<div class="notice info">${icon('event')}<div><b>Opens ${movie.opens}</b><br>Advance tickets go on sale two weeks before opening day.</div></div><button class="btn btn-primary btn-block mt-4" id="notify">${icon('notifications')}Notify me when tickets are on sale</button><p class="helper mt-3 center">We'll send a push notification and an email.</p>`;
    $('#notify').addEventListener('click', () => toast({ icon: 'notifications_active', title: 'You’re on the list', body: `We’ll let you know when ${movie.title} tickets go on sale.` }));
  } else { renderCinema(); renderDates(); renderShowtimes(); }

  // Save cinema from info modal
  $('#saveCinema').addEventListener('click', () => { store.set('cinema', state.cinemaId); closeModal('cinemaInfo'); toast({ icon: 'star', title: 'Saved as my cinema', body: `${cinema().name} is now pre-selected when you get tickets.` }); });

  /* ---------- more movies ---------- */
  const more = SM.moviesAt(state.cinemaId).filter(m => m.id !== movie.id).slice(0, 5);
  $('#moreGrid').innerHTML = more.map(m => `<a class="poster-card" href="movie.html?id=${m.id}"><div class="art"><img src="${m.poster}" alt="${m.title} poster" loading="lazy"><div class="overlay"><span class="btn btn-primary btn-sm">Get tickets</span></div></div><div class="title clamp-2">${m.title}</div><div class="meta">${ratingChip(m.rating)}<span>${SM.runtimeLabel(m.runtime)}</span></div></a>`).join('');
  $('#moreCinema').textContent = cinema().name;
})();
