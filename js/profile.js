/* Profile: overview, Cinema Points, personal info, settings (dark mode), activity, rewards, payment methods,
   overlays: edit profile, change password, redeem/redeemed, how points work, sign out */
(function () {
  const { $, $$, icon, store, openModal, closeModal, toast, applyTheme, theme, qrSVG } = SMUI;
  const u = SM.user;
  const state = { points: store.get('points', u.points), redeemed: store.get('redeemed', []) };

  /* ---------- left column ---------- */
  $('#pName').textContent = u.name; $('#pMail').textContent = u.email; $('#pSince').textContent = `Member since ${u.memberSince}`;
  $('#pTier').innerHTML = `${icon('star', 'xs')}${u.tier} member`;

  /* ---------- next movie ---------- */
  const next = SM.bookings.find(b => b.status === 'upcoming'); const nm = SM.movieById(next.movieId); const nc = SM.cinemaById(next.cinemaId);
  $('#nextMovie').innerHTML = `<img src="${nm.poster}" alt="${nm.title} poster"><div><div class="row" style="gap:8px"><span class="eyebrow blue">Your next movie</span><span class="tag blue">Today</span></div><h3 class="mt-1">${nm.title}</h3><div class="text-2 mt-1">${next.date} at ${next.time} (${next.format}), ${nc.name}, ${next.hall}</div><div class="seats">${next.seats.map(s => `<span class="tag outline">${s}</span>`).join('')}</div></div><div class="acts"><a class="btn btn-primary" href="tickets.html?open=${next.ref}">${icon('qr_code_2')}Show entry code</a><a class="btn btn-secondary" href="tickets.html">View receipt</a></div>`;

  /* ---------- points ---------- */
  function renderPoints() {
    const toNext = Math.max(0, u.tierMax - state.points);
    $('#ptsBig').textContent = `${state.points.toLocaleString()} pts`;
    $('#ptsToNext').textContent = toNext ? `${toNext.toLocaleString()} pts to ${u.nextTier}` : `${u.nextTier} tier reached`;
    $('#ptsBar').style.setProperty('--value', `${Math.min(100, Math.round(state.points / u.tierMax * 100))}%`);
    $('#rewardRows').innerHTML = SM.rewards.map(r => {
      const done = state.redeemed.includes(r.id); const enough = state.points >= r.cost;
      return `<div class="reward"><span><b>${r.name}</b><small>${r.cost.toLocaleString()} pts${done ? ' · redeemed' : ''}</small></span>${done ? `<span class="tag green">${icon('check', 'xs')}Ready</span>` : enough ? `<button class="link underline" data-redeem="${r.id}">Redeem</button>` : `<span class="need">Need ${(r.cost - state.points).toLocaleString()} more</span>`}</div>`;
    }).join('');
    $$('[data-redeem]').forEach(b => b.addEventListener('click', () => openRedeem(b.dataset.redeem)));
    const mini = $('#profileMenu .pts'); if (mini) mini.textContent = `${state.points.toLocaleString()} pts`;
  }
  $('#activity').innerHTML = SM.pointsActivity.map(a => `<div class="activity"><span class="ic ${a.kind}">${icon(a.kind === 'earn' ? 'add' : 'remove', 'sm')}</span><span><b>${a.title}</b><small>${a.where}</small></span><span class="pts ${a.pts > 0 ? 'plus' : 'minus'}">${a.pts > 0 ? '+' : '−'}${Math.abs(a.pts)} pts</span></div>`).join('');
  let currentReward = null;
  function openRedeem(id) {
    const r = SM.rewards.find(x => x.id === id); currentReward = r;
    if (state.points < r.cost) { toast({ icon: 'info', tone: 'yellow', title: 'Not enough points', body: `You need ${(r.cost - state.points).toLocaleString()} more points for ${r.name}.`, timeout: 4000 }); return; }
    $('#rdTitle').textContent = `Redeem ${r.name}?`; $('#rdSub').textContent = `${r.cost.toLocaleString()} pts will come out of your Cinema Points.`;
    $('#rdMath').innerHTML = `<div class="r"><span>Your points</span><b>${state.points.toLocaleString()} pts</b></div><div class="r"><span>Reward cost</span><span class="minus">−${r.cost.toLocaleString()} pts</span></div><div class="r total"><span>Balance after</span><span>${(state.points - r.cost).toLocaleString()} pts</span></div>`;
    $('#rdNote').textContent = r.note; $('#rdConfirm').textContent = `Redeem for ${r.cost.toLocaleString()} pts`;
    openModal('redeemModal');
  }
  $('#rdConfirm').addEventListener('click', () => {
    const r = currentReward; state.points -= r.cost; state.redeemed.push(r.id); store.set('points', state.points); store.set('redeemed', state.redeemed);
    SM.pointsActivity.unshift({ kind: 'redeem', title: `Redeemed: ${r.name}`, where: 'Online · Oct 20, 2026', pts: -r.cost });
    closeModal('redeemModal'); renderPoints();
    $('#rdDoneNote').textContent = r.redeemedNote; $('#rdQr').innerHTML = qrSVG(r.voucher); $('#rdCode').textContent = r.voucher; $('#rdLeft').textContent = `${state.points.toLocaleString()} pts`;
    openModal('redeemedModal');
  });
  $('#resetDemo').addEventListener('click', () => { state.points = u.points; state.redeemed = []; store.set('points', state.points); store.set('redeemed', []); renderPoints(); toast({ icon: 'restart_alt', tone: 'blue', title: 'Demo data reset', timeout: 3000 }); });

  /* ---------- personal info + edit ---------- */
  const info = store.get('profile', { name: u.name, email: u.email, mobile: u.mobile, birthday: u.birthday, cinema: u.preferredCinemaId });
  function renderInfo() {
    $('#infoKv').innerHTML = `<div><dt>Full name</dt><dd>${info.name}</dd></div><div><dt>Email</dt><dd>${info.email} <span class="tag green" style="height:22px;font-size:12px">${icon('check', 'xs')}Verified</span></dd></div><div><dt>Mobile number</dt><dd>${info.mobile}</dd></div><div><dt>Birthday</dt><dd>${info.birthday}</dd></div><div><dt>Preferred cinema</dt><dd>${SM.cinemaById(info.cinema).name}</dd></div>`;
    $('#pName').textContent = info.name;
  }
  const epMobile = $('#epMobile');
  $('#editProfileModal').addEventListener('sm:open', () => { $('#epName').value = info.name; $('#epEmail').value = info.email; epMobile.value = info.mobile; $('#epBirthday').value = info.birthday; $('#epCinema').value = info.cinema; setMobileMsg(null); });
  $('#epCinema').innerHTML = SM.cinemas.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  function setMobileMsg(ok) {
    const h = $('#epMobileMsg');
    if (ok === null) { h.className = 'helper'; h.textContent = 'Format: 09XX XXX XXXX'; epMobile.removeAttribute('aria-invalid'); epMobile.classList.remove('ok'); return; }
    h.className = `helper ${ok ? 'ok' : 'error'}`; h.innerHTML = ok ? `${icon('check', 'xs')}Looks good.` : `${icon('error', 'xs')}Enter an 11-digit number that starts with 09.`;
    epMobile.setAttribute('aria-invalid', !ok); epMobile.classList.toggle('ok', ok);
  }
  epMobile.addEventListener('input', () => { const d = epMobile.value.replace(/\D/g, '').slice(0, 11); epMobile.value = d.replace(/(\d{4})(\d{0,3})(\d{0,4})/, (m, a, b, c) => [a, b, c].filter(Boolean).join(' ')); setMobileMsg(/^09\d{9}$/.test(d)); });
  $('#epSave').addEventListener('click', () => {
    const d = epMobile.value.replace(/\D/g, ''); const ok = /^09\d{9}$/.test(d); setMobileMsg(ok);
    if (!ok || !$('#epName').value.trim()) { if (!ok) epMobile.focus(); return; }
    info.name = $('#epName').value.trim(); info.mobile = epMobile.value; info.birthday = $('#epBirthday').value; info.cinema = $('#epCinema').value;
    store.set('profile', info); store.set('cinema', info.cinema); renderInfo(); closeModal('editProfileModal');
    toast({ icon: 'check', title: 'Profile updated', body: `Your mobile number is now ${info.mobile}.`, actions: [{ label: 'Dismiss' }] });
  });

  /* ---------- change password ---------- */
  const pw = { cur: $('#pwCur'), nw: $('#pwNew'), cf: $('#pwConf') };
  function checkPw() {
    const v = pw.nw.value, c = pw.cf.value;
    const rules = [[v.length >= 8, 'At least 8 characters'], [/\d/.test(v), 'Includes a number'], [/[A-Z]/.test(v), 'Includes a capital letter'], [!!v && v === c, 'Both new passwords match']];
    $('#pwRules').innerHTML = rules.map(([ok, t]) => `<li class="${ok ? 'ok' : (t.startsWith('Both') && c && !ok ? 'bad' : '')}">${icon(ok ? 'check' : (t.startsWith('Both') && c && !ok ? 'close' : 'radio_button_unchecked'), 'xs')}${t}</li>`).join('');
    const mismatch = c && v !== c; pw.cf.setAttribute('aria-invalid', mismatch); $('#pwConfMsg').hidden = !mismatch;
    return rules.every(r => r[0]) && pw.cur.value.length > 0;
  }
  [pw.nw, pw.cf, pw.cur].forEach(i => i.addEventListener('input', checkPw));
  $$('[data-eye]').forEach(b => b.addEventListener('click', () => { const i = $(b.dataset.eye); i.type = i.type === 'password' ? 'text' : 'password'; b.querySelector('.ms').textContent = i.type === 'password' ? 'visibility' : 'visibility_off'; }));
  $('#pwSave').addEventListener('click', () => { if (!checkPw()) { toast({ icon: 'error', tone: 'red', title: 'Check the password rules', timeout: 3500 }); return; } closeModal('passwordModal'); [pw.cur, pw.nw, pw.cf].forEach(i => i.value = ''); checkPw(); toast({ icon: 'lock', title: 'Password updated', body: 'Use your new password the next time you sign in.' }); });
  $('#passwordModal').addEventListener('sm:open', checkPw);

  /* ---------- settings ---------- */
  const dark = $('#toggleDark'); dark.setAttribute('aria-checked', theme() === 'dark'); dark.parentElement.querySelector('.state').textContent = theme() === 'dark' ? 'On' : 'Off';
  dark.addEventListener('sm:toggle', (e) => { applyTheme(e.detail ? 'dark' : 'light'); toast({ icon: e.detail ? 'dark_mode' : 'light_mode', tone: 'blue', title: e.detail ? 'Dark mode on' : 'Dark mode off', body: 'Applies to every page and is remembered on this device.', timeout: 3000 }); });
  $('#togglePromo').addEventListener('sm:toggle', (e) => toast({ icon: 'mail', tone: 'blue', title: e.detail ? 'Promo emails on' : 'Promo emails off', timeout: 2500 }));
  $('#toggleRemind').addEventListener('sm:toggle', (e) => toast({ icon: 'notifications', tone: 'blue', title: e.detail ? 'Showtime reminders on' : 'Showtime reminders off', timeout: 2500 }));

  /* ---------- payment methods, IDs ---------- */
  $('#payMethods').innerHTML = u.paymentMethods.map(p => `<div class="setting-row"><span class="row" style="gap:12px"><span class="logo-tile ${p.type.toLowerCase()}" style="margin:0">${p.type === 'Card' ? icon('credit_card', 'sm') : p.label}</span><span><span class="t">${p.label}</span><br><span class="d">${p.detail}</span></span></span>${p.isDefault ? '<span class="tag">Default</span>' : '<button class="link sm">Make default</button>'}</div>`).join('');
  $('#addId').addEventListener('click', () => toast({ icon: 'badge', tone: 'blue', title: 'ID upload', body: 'Discount ID verification is simulated in this prototype.', timeout: 4000 }));

  /* ---------- sign out ---------- */
  $('#confirmSignOut').addEventListener('click', () => { closeModal('signOutModal'); toast({ icon: 'logout', tone: 'blue', title: 'Signed out', body: 'See you at the movies.', timeout: 3000 }); setTimeout(() => location.href = 'index.html', 900); });

  /* ---------- side menu scroll-spy ---------- */
  $$('.side-menu a[href^="#"]').forEach(a => a.addEventListener('click', () => { $$('.side-menu .menu-item').forEach(m => m.classList.remove('active')); a.classList.add('active'); }));

  renderPoints(); renderInfo();
  if (location.hash === '#settings' || location.hash === '#points') setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
})();
