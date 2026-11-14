/* Payment: hold timer, contact validation, payment methods, reward + promo, order summary, simulated payment */
(function () {
  const { $, $$, icon, ratingChip, store, openModal, toast } = SMUI;
  const saved = store.get('booking', null) || {};
  const booking = {
    movieId: saved.movieId || 'two-valid-ids', cinemaId: saved.cinemaId || 'iloilo', dateIso: saved.dateIso || SM.dates[0].iso,
    time: saved.time || '1:30 PM', format: saved.format || '2D', hall: saved.hall || 'Cinema 4', price: saved.price || 350,
    seats: saved.seats || ['F8', 'F9'], tickets: saved.tickets || [{ type: 'Regular', qty: 2, price: 350 }],
  };
  const movie = SM.movieById(booking.movieId) || SM.movies[0];
  const cinema = SM.cinemaById(booking.cinemaId);
  const dateObj = SM.dates.find(d => d.iso === booking.dateIso) || SM.dates[0];
  const qty = booking.tickets.reduce((a, t) => a + t.qty, 0);
  const subtotal = booking.tickets.reduce((a, t) => a + t.qty * t.price, 0);
  const state = { reward: 0, promo: 0, promoCode: null, method: 'GCash' };

  /* ---------- summary ---------- */
  $('#sumPoster').src = movie.poster; $('#sumTitle').textContent = movie.title;
  $('#sumMeta').textContent = `${movie.rating}, ${SM.runtimeLabel(movie.runtime)}, ${booking.format}, ${movie.language}`;
  $('#sumKv').innerHTML = `<dt>Cinema</dt><dd>${cinema.name}</dd><dt>Hall</dt><dd>${booking.hall}</dd><dt>Date</dt><dd>${dateObj.full}</dd><dt>Time</dt><dd>${booking.time}</dd><dt>Seats</dt><dd>${booking.seats.join(', ')}</dd>`;
  $('#changeSeats').href = `seats.html?id=${movie.id}&cinema=${booking.cinemaId}&date=${booking.dateIso}&time=${encodeURIComponent(booking.time)}&format=${encodeURIComponent(booking.format)}&hall=${encodeURIComponent(booking.hall)}`;
  $('#backSeats').href = $('#changeSeats').href;
  function renderTotals() {
    const total = Math.max(0, subtotal - state.reward - state.promo);
    $('#lines').innerHTML = booking.tickets.map(t => `<div class="sub-row"><span>${t.qty} × ${t.type} ticket${t.qty > 1 ? 's' : ''}</span><span>${SM.peso(t.qty * t.price)}</span></div>`).join('')
      + (state.reward ? `<div class="sub-row discount"><span>Reward: Free regular ticket</span><span>−${SM.peso(state.reward)}</span></div>` : '')
      + (state.promo ? `<div class="sub-row discount"><span>Promo ${state.promoCode}</span><span>−${SM.peso(state.promo)}</span></div>` : '');
    $('#total').textContent = SM.peso(total);
    $('#payBtn').innerHTML = total ? `Pay ${SM.peso(total)}` : 'Confirm booking';
    $('#payHint').textContent = state.method === 'Card' ? 'Your card is charged once you confirm.' : `You’ll approve the payment in your ${state.method} app.`;
    state.total = total;
  }

  /* ---------- hold timer ---------- */
  let secs = 10 * 60; const timerEl = $('#holdTime'), notice = $('#holdNotice');
  const tick = () => {
    secs--; const m = Math.floor(secs / 60), s = secs % 60; timerEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
    notice.style.setProperty('--progress', `${secs / 600 * 100}%`);
    if (secs === 300 || secs === 60) toast({ icon: 'timer', tone: 'yellow', title: `${m} minute${m > 1 ? 's' : ''} left`, body: 'Finish payment before your seat hold expires.', timeout: 5000 });
    if (secs <= 60) notice.classList.add('danger');
    if (secs <= 0) { clearInterval(iv); openModal('expiredModal'); }
  };
  const iv = setInterval(tick, 1000);

  /* ---------- contact validation ---------- */
  const email = $('#email'), mobile = $('#mobile');
  email.value = SM.user.email; mobile.value = SM.user.mobile;
  const setMsg = (input, ok, msg) => { const h = input.parentElement.querySelector('.msg'); input.setAttribute('aria-invalid', ok ? 'false' : 'true'); input.classList.toggle('ok', ok && !!msg); h.className = `helper msg ${ok ? (msg ? 'ok' : '') : 'error'}`; h.innerHTML = msg ? `${icon(ok ? 'check' : 'error', 'xs')}${msg}` : h.dataset.default; };
  const validEmail = () => { const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()); setMsg(email, ok, ok ? '' : 'Enter a valid email address, like name@example.com.'); return ok; };
  const validMobile = () => { const digits = mobile.value.replace(/\D/g, ''); const ok = /^09\d{9}$/.test(digits); setMsg(mobile, ok, ok ? 'Looks good.' : 'Enter an 11-digit number that starts with 09.'); return ok; };
  email.addEventListener('blur', validEmail); mobile.addEventListener('blur', validMobile);
  mobile.addEventListener('input', () => { const d = mobile.value.replace(/\D/g, '').slice(0, 11); mobile.value = d.replace(/(\d{4})(\d{0,3})(\d{0,4})/, (m, a, b, c) => [a, b, c].filter(Boolean).join(' ')); });

  /* ---------- payment methods ---------- */
  $$('input[name="method"]').forEach(r => r.addEventListener('change', () => { state.method = r.value; $('#cardFields').hidden = r.value !== 'Card'; renderTotals(); }));
  $('#cardNumber').addEventListener('input', (e) => { const d = e.target.value.replace(/\D/g, '').slice(0, 16); e.target.value = d.replace(/(\d{4})(?=\d)/g, '$1 '); });
  $('#cardExp').addEventListener('input', (e) => { const d = e.target.value.replace(/\D/g, '').slice(0, 4); e.target.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; });

  /* ---------- reward + promo ---------- */
  const regular = booking.tickets.find(t => t.type === 'Regular');
  if (!regular) { $('#rewardRow').hidden = true; }
  $('#applyReward').addEventListener('click', () => {
    const row = $('#rewardRow');
    if (state.reward) { state.reward = 0; row.classList.remove('applied'); $('#applyReward').textContent = 'Apply'; $('#rewardText').innerHTML = `<b>Use a reward: Free regular ticket</b><small>Voucher RWD-T7K4P2 · covers one regular ticket (${SM.peso(booking.price)})</small>`; }
    else { state.reward = regular.price; row.classList.add('applied'); $('#applyReward').textContent = 'Remove'; $('#rewardText').innerHTML = `<b>Reward applied: Free regular ticket</b><small>One regular ticket is covered by voucher RWD-T7K4P2.</small>`; toast({ icon: 'redeem', title: 'Reward applied', body: `${SM.peso(regular.price)} taken off your total.`, timeout: 3500 }); }
    renderTotals();
  });
  $('#applyPromo').addEventListener('click', () => {
    const code = $('#promo').value.trim().toUpperCase(); const msg = $('#promoMsg');
    if (!code) { msg.className = 'helper msg error'; msg.innerHTML = `${icon('error', 'xs')}Enter a promo code first.`; return; }
    if (['SMTUESDAY', 'SM40', 'MOVIENIGHT'].includes(code)) { state.promo = 40 * qty; state.promoCode = code; msg.className = 'helper msg ok'; msg.innerHTML = `${icon('check', 'xs')}${code} applied: ₱40 off per ticket.`; $('#promo').classList.add('ok'); renderTotals(); }
    else { state.promo = 0; state.promoCode = null; msg.className = 'helper msg error'; msg.innerHTML = `${icon('error', 'xs')}“${code}” isn’t a valid code. Try SMTUESDAY.`; $('#promo').setAttribute('aria-invalid', 'true'); renderTotals(); }
  });

  /* ---------- pay ---------- */
  $('#payBtn').addEventListener('click', () => {
    const okE = validEmail(), okM = validMobile(), okT = $('#terms').checked;
    if (!okT) { $('#termsMsg').hidden = false; }
    if (!okE || !okM || !okT) { toast({ icon: 'error', tone: 'red', title: 'Check the highlighted fields', body: !okT ? 'You need to agree to the terms of sale.' : 'Fix your contact details to continue.', timeout: 4500 }); (!okE ? email : !okM ? mobile : $('#terms')).focus(); return; }
    if (state.method === 'Card' && $('#cardNumber').value.replace(/\D/g, '').length < 16) { toast({ icon: 'credit_card', tone: 'red', title: 'Enter your full card number', timeout: 4000 }); $('#cardNumber').focus(); return; }
    const btn = $('#payBtn'); btn.disabled = true; btn.innerHTML = `${icon('progress_activity')}Processing…`; btn.querySelector('.ms').style.animation = 'spin 1s linear infinite';
    clearInterval(iv);
    const ref = 'CMC' + String(2283746763 + Math.floor((Date.now() / 1000) % 100000));
    setTimeout(() => {
      store.set('lastBooking', { ...booking, ref, total: state.total, paidWith: state.method, email: email.value.trim(), reward: state.reward, promo: state.promo, promoCode: state.promoCode, date: dateObj.full, dateShort: `${dateObj.day} October 2026`, status: 'upcoming', invoice: 'INV-2026-1020-' + String(3000 + Math.floor(Math.random() * 999)), vat: Math.round(state.total * 0.12 / 1.12) });
      location.href = `tickets.html?confirmed=${ref}`;
    }, 1400);
  });
  $('#terms').addEventListener('change', () => { $('#termsMsg').hidden = $('#terms').checked; });

  renderTotals();
})();
