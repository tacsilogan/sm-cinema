/* My Tickets: upcoming + past bookings, e-ticket modal with QR, receipt modal, post-payment confirmation */
(function () {
  const { $, $$, icon, ratingChip, qs, store, openModal, closeModal, toast, qrSVG } = SMUI;
  const bookings = SM.bookings.map(b => ({ ...b }));
  const last = store.get('lastBooking', null);
  const confirmedRef = qs('confirmed');
  if (last && !bookings.some(b => b.ref === last.ref)) bookings.unshift({ ...last, status: 'upcoming' });

  const info = (b) => {
    const m = SM.movieById(b.movieId);
    return { title: b.title || (m && m.title) || 'Movie', rating: b.rating || (m && m.rating) || 'PG', runtime: m ? SM.runtimeLabel(m.runtime) : '', genre: m ? m.genre : '', poster: b.poster || (m && m.poster) || '', cinema: SM.cinemaById(b.cinemaId) || SM.cinemas[0], qty: b.tickets.reduce((a, t) => a + t.qty, 0) };
  };

  function stub(b) {
    const i = info(b); const past = b.status === 'past';
    return `<article class="stub" data-ref="${b.ref}">
      <img class="poster" src="${i.poster}" alt="${i.title} poster">
      <div class="lines">
        <div class="row" style="gap:10px;flex-wrap:wrap"><span class="title">${i.title}</span>${past ? `<span class="tag">Watched</span>` : `<span class="tag green">Upcoming</span>`}</div>
        <div class="meta">${ratingChip(i.rating)}${i.runtime ? `<span>${i.runtime}</span>` : ''}${i.genre ? `<span class="sep">·</span><span>${i.genre}</span>` : ''}<span class="tag blue">${b.hall === b.format ? b.format : b.format + ' · ' + b.hall}</span></div>
        <div class="row wrap" style="gap:16px;color:var(--text-2)"><span class="row" style="gap:6px">${icon('location_on', 'sm')}${i.cinema.name}</span><span class="row" style="gap:6px">${icon('calendar_month', 'sm')}${b.date}</span><span class="row" style="gap:6px">${icon('schedule', 'sm')}${b.time}</span></div>
        <div class="row wrap" style="gap:16px;color:var(--text-2)"><span class="row" style="gap:6px">${icon('event_seat', 'sm')}${i.qty} ticket${i.qty > 1 ? 's' : ''} · Seats ${b.seats.join(', ')}</span><span class="row muted" style="gap:6px">${icon('tag', 'sm')}<span class="tabular">${b.ref}</span></span></div>
      </div>
      <span class="perf" aria-hidden="true"></span>
      <div class="side">
        <span class="barcode" aria-hidden="true"></span>
        ${past ? `<button class="btn btn-secondary btn-sm" data-receipt="${b.ref}">${icon('receipt_long')}View receipt</button><a class="link sm" href="movie.html?id=${b.movieId}">Book again</a>` : `<button class="btn btn-primary btn-sm" data-ticket="${b.ref}">${icon('qr_code_2')}View ticket</button><button class="link sm" data-receipt="${b.ref}">View receipt</button>`}
      </div>
    </article>`;
  }
  const up = bookings.filter(b => b.status === 'upcoming'), past = bookings.filter(b => b.status === 'past');
  $('#listUp').innerHTML = up.length ? up.map(stub).join('') : `<div class="empty">${icon('confirmation_number')}<h3>No upcoming tickets</h3><p>Book a movie and your e-tickets will show up here.</p><a class="btn btn-primary" href="index.html">Browse movies</a></div>`;
  $('#listPast').innerHTML = past.map(stub).join('');
  $('#countUp').textContent = up.length; $('#countPast').textContent = past.length;

  /* ---------- e-ticket ---------- */
  function showTicket(ref) {
    const b = bookings.find(x => x.ref === ref); if (!b) return; const i = info(b);
    const m = $('#ticketModal');
    $('#tkPoster').src = i.poster; $('#tkTitle').textContent = i.title;
    $('#tkChips').innerHTML = `${ratingChip(i.rating)}<span class="muted">${b.format} · ${i.genre} · ${i.runtime}</span>`;
    $('#tkStatus').className = `tag ${b.status === 'past' ? '' : 'green'}`; $('#tkStatus').textContent = b.status === 'past' ? 'Watched' : 'Upcoming';
    $('#tkQr').innerHTML = qrSVG(b.ref); $('#tkRef').textContent = b.ref;
    $('#tkDetails').innerHTML = `<div><small>Cinema</small><b>${i.cinema.name} · ${b.hall}</b></div><div><small>Date</small><b>${b.date}</b></div><div><small>Time</small><b>${b.time}</b></div><div><small>Seats</small><b>${b.seats.join(', ')}</b></div><div><small>Tickets</small><b>${b.tickets.map(t => `${t.qty} × ${t.type}`).join(', ')}</b></div><div><small>Total paid</small><b>${SM.peso(b.total)}</b></div>`;
    $('#tkReceipt').innerHTML = receiptRows(b, i);
    $('#tkCal').href = '#';
    openModal(m);
  }
  function receiptRows(b, i) {
    return `<dl class="kv">${b.tickets.map(t => `<dt>${t.type} tickets</dt><dd>${t.qty} × ${SM.peso(t.price)}.00</dd>`).join('')}${b.reward ? `<dt>Reward</dt><dd>−${SM.peso(b.reward)}.00</dd>` : ''}${b.promo ? `<dt>Promo ${b.promoCode}</dt><dd>−${SM.peso(b.promo)}.00</dd>` : ''}<dt>VAT included (12%)</dt><dd>${SM.peso(b.vat || Math.round(b.total * 0.12 / 1.12))}.00</dd><dt>Paid with</dt><dd>${b.paidWith}</dd><dt>Booking reference</dt><dd class="tabular">${b.ref}</dd><dt>Invoice no.</dt><dd class="tabular">${b.invoice}</dd></dl>`;
  }
  function showReceipt(ref) {
    const b = bookings.find(x => x.ref === ref); if (!b) return; const i = info(b);
    $('#rcTitle').textContent = i.title; $('#rcChips').innerHTML = `${ratingChip(i.rating)}<span class="muted">${b.format} · ${b.hall}</span><span class="tag">${b.status === 'past' ? 'Watched' : 'Upcoming'}</span>`;
    $('#rcBody').innerHTML = `<dl class="kv"><dt>Date and time</dt><dd>${b.date} · ${b.time}</dd><dt>Cinema</dt><dd>${i.cinema.name} · ${b.hall}</dd><dt>Seats</dt><dd>${b.seats.join(', ')}</dd></dl>` + receiptRows(b, i);
    $('#rcTotal').textContent = `${SM.peso(b.total)}.00`;
    openModal('receiptModal');
  }
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-ticket]'); if (t) showTicket(t.dataset.ticket);
    const r = e.target.closest('[data-receipt]'); if (r) showReceipt(r.dataset.receipt);
  });
  $('#tkDownload').addEventListener('click', () => toast({ icon: 'download_done', title: 'E-ticket downloaded', body: 'Saved as SM-Cinema-e-ticket.pdf. It’s also in your email.', timeout: 4000 }));
  $('#tkCal').addEventListener('click', (e) => { e.preventDefault(); toast({ icon: 'event_available', tone: 'blue', title: 'Added to your calendar', body: 'We set a reminder 2 hours before showtime.', timeout: 4000 }); });
  $('#rcDownload').addEventListener('click', () => toast({ icon: 'download_done', title: 'Receipt downloaded', body: 'Saved as SM-Cinema-receipt.pdf.', timeout: 4000 }));

  /* ---------- post-payment confirmation ---------- */
  if (confirmedRef) {
    const b = bookings.find(x => x.ref === confirmedRef) || up[0];
    if (b) {
      const i = info(b);
      history.replaceState(null, '', 'tickets.html');
      setTimeout(() => {
        toast({ icon: 'check', tone: 'green', title: 'Booking confirmed', body: `Payment of ${SM.peso(b.total)} received. Your e-ticket was sent to ${b.email || SM.user.email}.`, timeout: 12000,
          extra: `<div class="mini"><img src="${i.poster}" alt=""><span><b>${i.title}</b><small>${b.date} at ${b.time} (${b.format})</small><small>${i.cinema.name}, ${b.hall}, Seats ${b.seats.join(' and ')}</small></span></div><div class="row between mt-2"><span class="helper">Booking reference</span><b class="tabular">${b.ref}</b></div>`,
          actions: [{ label: 'View my ticket', primary: true, onClick: () => showTicket(b.ref) }, { label: 'Dismiss' }] });
        showTicket(b.ref);
      }, 300);
      SM.notifications.unshift({ id: 99, title: 'Booking confirmed', body: `${i.title} · ${b.date}, ${b.time} · Seats ${b.seats.join(', ')}`, time: 'Just now', unread: true, link: 'tickets.html' });
    }
  }
  if (qs('open')) showTicket(qs('open'));
})();
