/* Cinemas: search, location permission + distance sort, experience filter, branch list, schedule panel, info modal */
(function () {
  const { $, $$, icon, ratingChip, qs, store, openModal, closeModal, toast } = SMUI;
  const state = { selected: qs('cinema') || null, filter: 'All', locationOn: store.get('location', false), query: '', dateIso: SM.dates[0].iso };
  const FEATURE = { 'IMAX': c => c.features.includes('IMAX'), "Director's Club": c => c.features.includes("Director's Club"), 'ScreenX': c => c.features.includes('ScreenX'), 'All': () => true };
  const FORMAT_OF = { 'IMAX': 'IMAX', "Director's Club": "Director's Club", 'ScreenX': 'ScreenX' };

  /* ---------- branch list ---------- */
  function renderList() {
    const q = state.query.toLowerCase();
    let list = SM.cinemas.filter(c => !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.address.toLowerCase().includes(q));
    if (state.locationOn) list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
    const regions = [...new Set(list.map(c => c.region))];
    const host = $('#branches');
    if (!list.length) { host.innerHTML = `<div class="empty">${icon('search_off')}<h3>No branch matches “${state.query}”</h3><p>Try a city like Iloilo or Cebu, or clear the search.</p><button class="btn btn-secondary btn-sm" id="clearQ">Clear search</button></div>`; $('#clearQ').addEventListener('click', () => { $('#q').value = ''; state.query = ''; renderList(); }); return; }
    host.innerHTML = regions.map(r => {
      const items = list.filter(c => c.region === r);
      return `<div class="branch-group"><div class="eyebrow">${r} · ${state.locationOn ? 'nearest first' : items.length + ' branch' + (items.length > 1 ? 'es' : '')}</div>${items.map(c => {
        const ok = FEATURE[state.filter](c);
        return `<button class="branch" data-c="${c.id}" aria-pressed="${state.selected === c.id}" style="${ok ? '' : 'opacity:.55'}">${icon('location_on')}<span class="grow"><b>${c.name}</b><small>${c.address}</small><span class="feat">${c.features.join(' · ')} · ${c.halls} halls${ok ? '' : ` · <span style="color:var(--text-3)">No ${state.filter}</span>`}</span></span>${state.locationOn ? `<span class="km">${c.distanceKm} km</span>` : ''}</button>`;
      }).join('')}</div>`;
    }).join('');
    $$('#branches .branch').forEach(b => b.addEventListener('click', () => { state.selected = b.dataset.c; renderList(); renderPanel(); if (innerWidth < 900) $('#panel').scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
  }

  /* ---------- schedule panel ---------- */
  function renderPanel() {
    const host = $('#panel');
    if (!state.selected) { host.innerHTML = `<div class="empty" style="min-height:260px;justify-content:center">${icon('location_searching')}<h3>Pick a cinema on the left</h3><p>You’ll see its address, dates and every movie showing there.</p></div>`; return; }
    const c = SM.cinemaById(state.selected);
    const di = SM.dates.findIndex(d => d.iso === state.dateIso);
    let groups = SM.showtimesFor(c.id);
    if (state.filter !== 'All') groups = groups.filter(g => g.format === FORMAT_OF[state.filter]);
    const movieIds = [...new Set(groups.map(g => g.movieId))];
    const dateChips = SM.dates.map(d => `<button class="date-chip" data-d="${d.iso}" aria-pressed="${d.iso === state.dateIso}" ${d.disabled ? 'disabled' : ''}><span class="dow">${d.dow}</span><span class="day">${d.day}</span><span class="mon">${d.mon}</span></button>`).join('');
    const rows = movieIds.map(id => {
      const m = SM.movieById(id); const gs = groups.filter(g => g.movieId === id);
      return `<article class="movie-row"><img class="poster" src="${m.poster}" alt="${m.title} poster" loading="lazy"><div>
        <div class="head"><div><div class="title">${m.title}</div><div class="meta mt-1">${ratingChip(m.rating)}<span>${SM.runtimeLabel(m.runtime)}</span><span class="sep">·</span><span>${m.genre}</span></div></div><a class="link sm" href="movie.html?id=${m.id}&cinema=${c.id}&date=${state.dateIso}">Movie details${icon('chevron_right', 'xs')}</a></div>
        ${gs.map(g => `<div class="row mt-3" style="gap:8px"><span class="tag blue">${g.hall === g.format ? g.format : g.format + ' · ' + g.hall}</span><span class="helper">${SM.peso(SM.prices[g.format])} per seat</span></div><div class="showtimes mt-2">${g.times.map((t, i) => { let st = t.state || ''; if (di > 0) st = (i + di) % 5 === 0 ? 'few' : (i + di) % 7 === 0 ? 'sold' : ''; return `<button class="showtime ${st}" data-m="${m.id}" data-t="${t.t}" data-f="${g.format}" data-h="${g.hall}" data-st="${st}">${t.t}${st === 'few' ? `<small><span class="status-dot warn"></span>Few left</small>` : st === 'sold' ? `<small>Sold out</small>` : ''}</button>`; }).join('')}</div>`).join('')}
      </div></article>`;
    }).join('');
    host.innerHTML = `<div class="branch-panel"><div class="row between wrap"><h2>${c.name}</h2><button class="link sm underline" id="viewInfo">View cinema info</button></div><div class="addr">${icon('location_on', 'sm')}${c.address}${state.locationOn ? ` · ${c.distanceKm} km away` : ''}</div><div class="hours">${icon('schedule', 'sm')}Open today · ${c.hours}</div></div>
      <h3 class="mb-3">Choose a date</h3><div class="date-strip" id="panelDates">${dateChips}</div>
      <h3 class="mt-5 mb-3">${di === 0 ? 'Showing today' : 'Showing ' + SM.dates[di].full} · ${movieIds.length} movie${movieIds.length !== 1 ? 's' : ''}${state.filter !== 'All' ? ' in ' + state.filter : ''}</h3>
      ${rows || `<div class="empty">${icon('event_busy')}<h3>No ${state.filter} showings at ${c.name}</h3><p>Try Regular 2D here, or pick a branch with ${state.filter}.</p><button class="btn btn-secondary btn-sm" id="resetFilter">Show all formats</button></div>`}
      <div class="cinema-movies" id="rows"></div>`;
    $('#viewInfo').addEventListener('click', () => showInfo(c));
    $('#resetFilter')?.addEventListener('click', () => setFilter('All'));
    $$('#panelDates .date-chip').forEach(b => b.addEventListener('click', () => { state.dateIso = b.dataset.d; renderPanel(); }));
    $$('#panel .showtime').forEach(b => b.addEventListener('click', () => {
      const m = SM.movieById(b.dataset.m);
      if (b.dataset.st === 'sold') { toast({ icon: 'event_busy', tone: 'yellow', title: 'Sold out', body: `${b.dataset.t} for ${m.title} is sold out. Pick another time.`, timeout: 4000 }); return; }
      store.set('booking', { movieId: m.id, cinemaId: c.id, dateIso: state.dateIso, time: b.dataset.t, format: b.dataset.f, hall: b.dataset.h, price: SM.prices[b.dataset.f] });
      location.href = `seats.html?id=${m.id}&cinema=${c.id}&date=${state.dateIso}&time=${encodeURIComponent(b.dataset.t)}&format=${encodeURIComponent(b.dataset.f)}&hall=${encodeURIComponent(b.dataset.h)}`;
    }));
  }

  /* ---------- info modal ---------- */
  let infoCinema = null;
  function showInfo(c) {
    infoCinema = c; const m = $('#cinemaInfo');
    m.querySelector('.ci-name').textContent = c.name; m.querySelector('.ci-addr').textContent = c.address; m.querySelector('.ci-hours').textContent = `Open today · ${c.hours}`;
    m.querySelector('.ci-tags').innerHTML = [...c.features, `${c.halls} halls`].map(f => `<span class="tag blue">${f}</span>`).join('');
    m.querySelector('.ci-amen').innerHTML = c.amenities.map(a => `<li class="row" style="gap:8px">${icon('check', 'sm')}${a}</li>`).join('');
    m.querySelector('.ci-street').textContent = c.address.split(',')[0];
    openModal(m);
  }
  $('#saveCinema').addEventListener('click', () => { store.set('cinema', infoCinema.id); SMUI.syncCinema(); closeModal('cinemaInfo'); toast({ icon: 'star', title: 'Saved as my cinema', body: `${infoCinema.name} is now pre-selected when you get tickets.` }); });

  /* ---------- tools ---------- */
  $('#q').addEventListener('input', (e) => { state.query = e.target.value.trim(); renderList(); });
  function setFilter(f) { state.filter = f; $$('#xpFilters .chip').forEach(ch => ch.setAttribute('aria-pressed', ch.dataset.f === f)); renderList(); renderPanel(); }
  $$('#xpFilters .chip').forEach(ch => ch.addEventListener('click', () => setFilter(ch.dataset.f)));
  const locBtn = $('#useLocation');
  function paintLocation() { locBtn.className = `btn ${state.locationOn ? 'btn-primary' : 'btn-secondary'}`; locBtn.innerHTML = state.locationOn ? `${icon('check')}Location on` : `${icon('my_location')}Use my location`; }
  locBtn.addEventListener('click', () => { if (state.locationOn) { state.locationOn = false; store.set('location', false); paintLocation(); renderList(); renderPanel(); toast({ icon: 'location_off', tone: 'blue', title: 'Location turned off', body: 'Branches are listed by region again.', timeout: 3500 }); } else openModal('locationModal'); });
  $('#allowLoc').addEventListener('click', () => { state.locationOn = true; store.set('location', true); closeModal('locationModal'); paintLocation(); renderList(); renderPanel(); toast({ icon: 'near_me', tone: 'blue', title: 'Sorted by distance', body: 'SM City Iloilo is your nearest branch, 2.1 km away.', timeout: 4000 }); });
  $('#denyLoc').addEventListener('click', () => { closeModal('locationModal'); $('#q').placeholder = 'Type a city or mall, like Iloilo'; $('#q').focus(); toast({ icon: 'location_off', tone: 'blue', title: 'Location is off', body: 'Search by city or mall to find a branch instead.', actions: [{ label: 'Got it' }], timeout: 8000 }); });

  paintLocation();
  const xp = qs('xp');
  if (xp && FEATURE[xp]) { setFilter(xp); if (!state.selected) { const first = SM.cinemas.find(FEATURE[xp]); if (first) state.selected = first.id; renderList(); renderPanel(); } }
  else { renderList(); renderPanel(); }
})();
