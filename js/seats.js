/* Seat selection: generated seat map, quantity, best-seat picker, ticket types, change-showtime modal */
(function () {
  const { $, $$, icon, ratingChip, qs, store, openModal, closeModal, toast } = SMUI;
  const saved = store.get('booking', null) || {};
  const booking = {
    movieId: qs('id') || saved.movieId || 'two-valid-ids',
    cinemaId: qs('cinema') || saved.cinemaId || 'iloilo',
    dateIso: qs('date') || saved.dateIso || SM.dates[0].iso,
    time: qs('time') || saved.time || '1:30 PM',
    format: qs('format') || saved.format || '2D',
    hall: qs('hall') || saved.hall || 'Cinema 4',
  };
  booking.price = SM.prices[booking.format] || 350;
  const movie = SM.movieById(booking.movieId) || SM.movies[0];
  const cinema = () => SM.cinemaById(booking.cinemaId);
  const dateObj = () => SM.dates.find(d => d.iso === booking.dateIso) || SM.dates[0];
  document.title = `Choose seats – ${movie.title} – SM Cinema`;

  const state = { qty: 2, selected: [...SM.seatMap.selected], senior: 0, pwd: 0 };
  const taken = new Set(SM.seatMap.taken);
  const wheel = new Set(SM.seatMap.wheelchair);

  /* ---------- booking bar ---------- */
  function renderBar() {
    $('#barPoster').src = movie.poster; $('#barTitle').textContent = movie.title;
    $('#barChips').innerHTML = `${ratingChip(movie.rating)}<span class="tag">${booking.format}</span><span class="tag">${movie.language}</span>`;
    $('#barCinema').textContent = cinema().name; $('#barDate').textContent = dateObj().full; $('#barTime').textContent = booking.time; $('#barHall').textContent = booking.hall;
    $('#backLink').href = `movie.html?id=${movie.id}&cinema=${booking.cinemaId}&date=${booking.dateIso}`;
  }

  /* ---------- seat map ---------- */
  const map = $('#seatMap');
  function renderMap() {
    const { rows, seatsPerRow, blocks } = SM.seatMap;
    let html = '';
    rows.forEach(r => {
      html += `<div class="rowlabel">${r}</div>`;
      blocks.forEach((b, bi) => {
        for (let n = b[0]; n <= b[1]; n++) {
          const id = r + n; const isTaken = taken.has(id), isWheel = wheel.has(id), isSel = state.selected.includes(id);
          html += `<button class="seat ${isTaken ? 'taken' : ''} ${isWheel ? 'wheel' : ''} ${isSel ? 'selected' : ''}" data-seat="${id}" ${isTaken ? 'disabled' : ''} aria-pressed="${isSel}" aria-label="Seat ${id}${isTaken ? ', taken' : isWheel ? ', wheelchair space' : ''}" title="${id}${isWheel ? ' · wheelchair space' : ''}">${isWheel ? icon('accessible') : n}</button>`;
        }
        if (bi < blocks.length - 1) html += `<div class="gap"></div>`;
      });
      html += `<div class="rowlabel">${r}</div>`;
    });
    map.innerHTML = html;
    void seatsPerRow;
  }
  map.addEventListener('click', (e) => {
    const b = e.target.closest('.seat'); if (!b || b.disabled) return;
    const id = b.dataset.seat;
    if (state.selected.includes(id)) state.selected = state.selected.filter(s => s !== id);
    else {
      if (state.selected.length >= state.qty) { state.selected.shift(); }   // replace the oldest pick
      state.selected.push(id);
    }
    $$('.seat', map).forEach(s => { const on = state.selected.includes(s.dataset.seat); s.classList.toggle('selected', on); s.setAttribute('aria-pressed', on); s.classList.remove('best'); });
    renderSummary();
  });

  /* ---------- quantity ---------- */
  const qtyOut = $('#qty');
  function setQty(n) {
    state.qty = Math.max(1, Math.min(8, n)); qtyOut.value = state.qty;
    $('#qtyMinus').disabled = state.qty <= 1; $('#qtyPlus').disabled = state.qty >= 8;
    while (state.selected.length > state.qty) state.selected.pop();
    if (state.senior + state.pwd > state.qty) { state.pwd = Math.max(0, state.qty - state.senior); state.senior = Math.min(state.senior, state.qty); }
    renderMap(); renderSummary();
  }
  $('#qtyMinus').addEventListener('click', () => setQty(state.qty - 1));
  $('#qtyPlus').addEventListener('click', () => setQty(state.qty + 1));

  /* ---------- best seats ---------- */
  $('#bestSeats').addEventListener('click', () => {
    const pref = ['F', 'E', 'G', 'D', 'H', 'C', 'I', 'B', 'J', 'A'];
    for (const r of pref) {
      for (let start = 9 - Math.ceil(state.qty / 2); start >= 5; start--) {
        for (const s of [start, 17 - start - state.qty + 1]) {
          const run = []; for (let n = s; n < s + state.qty; n++) run.push(r + n);
          if (run.every(id => n(id) >= 5 && n(id) <= 12 && !taken.has(id) && !wheel.has(id))) { state.selected = run; renderMap(); $$('.seat.selected', map).forEach(x => x.classList.add('best')); renderSummary(); toast({ icon: 'auto_awesome', tone: 'blue', title: `Picked ${run.join(', ')}`, body: 'Centre of the hall, a few rows back from the screen.', timeout: 3500 }); return; }
        }
      }
    }
    function n(id) { return parseInt(id.slice(1), 10); }
    toast({ icon: 'info', tone: 'yellow', title: 'No block of seats left in the middle', body: 'Try fewer seats or another showtime.' });
  });

  /* ---------- ticket types + summary ---------- */
  function renderSummary() {
    const sel = state.selected.slice().sort();
    $('#seatChips').innerHTML = sel.length ? sel.map(s => `<span class="seat-chip">${s}<button aria-label="Remove seat ${s}" data-rm="${s}">${icon('close', 'xs')}</button></span>`).join('') : `<span class="helper">Tap seats on the map, or use “Pick best seats”.</span>`;
    $$('[data-rm]').forEach(b => b.addEventListener('click', () => { state.selected = state.selected.filter(s => s !== b.dataset.rm); renderMap(); renderSummary(); }));
    const regular = Math.max(0, state.qty - state.senior - state.pwd);
    const disc = Math.round(booking.price * (1 - SM.discounts.senior));
    $('#regCount').textContent = regular; $('#regPrice').textContent = `${SM.peso(booking.price)} each`;
    $('#seniorOut').value = state.senior; $('#pwdOut').value = state.pwd;
    $('#seniorPrice').textContent = `${SM.peso(disc)} each, 20% off`; $('#pwdPrice').textContent = `${SM.peso(disc)} each, 20% off`;
    $('#seniorPlus').disabled = $('#pwdPlus').disabled = state.senior + state.pwd >= state.qty;
    $('#seniorMinus').disabled = state.senior === 0; $('#pwdMinus').disabled = state.pwd === 0;
    const subtotal = state.qty * booking.price, discount = (state.senior + state.pwd) * (booking.price - disc), total = subtotal - discount;
    $('#subLine').innerHTML = `<span>${state.qty} ticket${state.qty > 1 ? 's' : ''} × ${SM.peso(booking.price)}</span><span>${SM.peso(subtotal)}</span>`;
    $('#discLine').hidden = !discount; $('#discLine').innerHTML = `<span>Senior / PWD discount</span><span>−${SM.peso(discount)}</span>`;
    $('#total').textContent = SM.peso(total);
    const ready = sel.length === state.qty;
    const btn = $('#toPayment'); btn.toggleAttribute('aria-disabled', !ready);
    $('#seatHint').textContent = ready ? 'We’ll hold your seats for 10 minutes while you pay.' : `Choose ${state.qty - sel.length} more seat${state.qty - sel.length > 1 ? 's' : ''} to continue.`;
    state.total = total; state.regular = regular; state.discount = discount;
  }
  $('#seniorPlus').addEventListener('click', () => { state.senior++; renderSummary(); });
  $('#seniorMinus').addEventListener('click', () => { state.senior--; renderSummary(); });
  $('#pwdPlus').addEventListener('click', () => { state.pwd++; renderSummary(); });
  $('#pwdMinus').addEventListener('click', () => { state.pwd--; renderSummary(); });
  $('#toPayment').addEventListener('click', (e) => {
    if ($('#toPayment').hasAttribute('aria-disabled')) { e.preventDefault(); toast({ icon: 'event_seat', tone: 'blue', title: 'Pick your seats first', body: `Choose ${state.qty} seat${state.qty > 1 ? 's' : ''} on the map to continue.`, timeout: 3500 }); return; }
    const tickets = [];
    if (state.regular) tickets.push({ type: 'Regular', qty: state.regular, price: booking.price });
    if (state.senior) tickets.push({ type: 'Senior citizen', qty: state.senior, price: Math.round(booking.price * .8) });
    if (state.pwd) tickets.push({ type: 'PWD', qty: state.pwd, price: Math.round(booking.price * .8) });
    store.set('booking', { ...booking, seats: state.selected.slice().sort(), tickets, total: state.total });
  });

  /* ---------- change showtime modal ---------- */
  const cs = { dateIso: booking.dateIso, time: null };
  function renderChange() {
    $('#csCurrent').textContent = `Current: ${dateObj().full} at ${booking.time}, ${booking.hall}`;
    $('#csSub').textContent = `${movie.title} at ${cinema().name}`;
    $('#csDates').innerHTML = SM.dates.map(d => `<button class="date-chip" data-d="${d.iso}" aria-pressed="${d.iso === cs.dateIso}" ${d.disabled ? 'disabled' : ''}><span class="dow">${d.dow}</span><span class="day">${d.day}</span><span class="mon">${d.mon}</span></button>`).join('');
    $$('#csDates .date-chip').forEach(b => b.addEventListener('click', () => { cs.dateIso = b.dataset.d; cs.time = null; renderChange(); }));
    const groups = SM.showtimesFor(booking.cinemaId, movie.id);
    const di = SM.dates.findIndex(d => d.iso === cs.dateIso);
    $('#csTimes').innerHTML = groups.map(g => `<div class="format-group"><div class="fg-head"><b>${g.hall === g.format ? g.format : g.format + ' · ' + g.hall}</b><span class="muted">${SM.peso(SM.prices[g.format])} per seat</span></div><div class="showtimes">${g.times.map((t, i) => {
      let st = t.state || ''; if (di > 0) st = (i + di) % 5 === 0 ? 'few' : (i + di) % 7 === 0 ? 'sold' : '';
      const isCur = cs.dateIso === booking.dateIso && t.t === booking.time && g.format === booking.format;
      const on = cs.time === t.t && cs.format === g.format;
      return `<button class="showtime ${st} ${isCur ? 'current' : ''}" data-t="${t.t}" data-f="${g.format}" data-h="${g.hall}" aria-pressed="${on}" ${st === 'sold' ? 'disabled' : ''}>${t.t}<small>${isCur ? 'Current' : st === 'few' ? '<span class="status-dot warn"></span>Few seats left' : st === 'sold' ? 'Sold out' : ''}</small></button>`;
    }).join('')}</div></div>`).join('');
    $$('#csTimes .showtime').forEach(b => b.addEventListener('click', () => { cs.time = b.dataset.t; cs.format = b.dataset.f; cs.hall = b.dataset.h; renderChange(); }));
    const changed = cs.time && !(cs.dateIso === booking.dateIso && cs.time === booking.time && cs.format === booking.format);
    const btn = $('#csUpdate'); btn.disabled = !changed; btn.textContent = changed ? `Update to ${cs.time}` : 'Update showtime';
    $('#csNote').innerHTML = changed ? `${icon('warning', 'sm')}<span>Updating clears your seats ${state.selected.join(' and ') || ''}. You’ll pick new seats for ${cs.time} on this screen.</span>` : `${icon('info', 'sm')}<span>Pick another time to change your showing. Your seats ${state.selected.join(' and ')} stay saved until you update.</span>`;
  }
  $('#changeShowtime').addEventListener('click', () => { cs.dateIso = booking.dateIso; cs.time = null; renderChange(); openModal('changeModal'); });
  $('#csUpdate').addEventListener('click', () => {
    booking.dateIso = cs.dateIso; booking.time = cs.time; booking.format = cs.format; booking.hall = cs.hall; booking.price = SM.prices[cs.format];
    state.selected = []; store.set('booking', { ...booking });
    closeModal('changeModal'); renderBar(); renderMap(); renderSummary();
    toast({ icon: 'schedule', title: 'Showtime updated', body: `${dateObj().full} at ${booking.time}, ${booking.hall}. Pick your seats again.` });
  });
  $('#csChangeCinema').href = `movie.html?id=${movie.id}`;

  renderBar(); renderMap(); setQty(2);
})();
