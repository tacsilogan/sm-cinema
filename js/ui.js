/* SM Cinema redesign — shared UI: header, tab bar, footer, dropdowns, modals, toasts, tabs, theme.
   Vanilla JS only. Each page calls SMUI.init({ active: 'movies' | 'cinemas' | 'experience' | 'tickets' | 'profile' | null }). */
window.SMUI = (function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const icon = (name, cls = '') => `<span class="ms ${cls}" aria-hidden="true">${name}</span>`;

  /* ---------- persisted state ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('sm.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('sm.' + k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
  };
  const currentCinema = () => SM.cinemaById(store.get('cinema', SM.user.preferredCinemaId)) || SM.cinemas[0];

  /* ---------- theme ---------- */
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    store.set('theme', theme);
    document.dispatchEvent(new CustomEvent('sm:theme', { detail: theme }));
  }
  const theme = () => document.documentElement.dataset.theme || 'light';

  /* ---------- header / footer templates ---------- */
  const NAV = [
    { key: 'movies', label: 'Movies', href: 'index.html', icon: 'home' },
    { key: 'cinemas', label: 'Cinemas', href: 'cinemas.html', icon: 'location_on' },
    { key: 'experience', label: 'Experience', href: 'experience.html', icon: 'star' },
    { key: 'tickets', label: 'My Tickets', href: 'tickets.html', icon: 'confirmation_number' },
  ];
  const brand = (cls = '') => `<a class="brand ${cls}" href="index.html" aria-label="SM Cinema home"><span class="sm">SM</span><span class="cinema">Cinema</span></a>`;

  function headerHTML(opts) {
    const unread = SM.notifications.filter(n => n.unread).length;
    const pts = store.get('points', null); if (pts !== null) { SM.user.points = pts; SM.user.pointsToNext = Math.max(0, SM.user.tierMax - pts); }
    return `
    <div class="container bar">
      ${brand()}
      <nav class="nav" aria-label="Main">
        ${NAV.map(n => `<a href="${n.href}" ${opts.active === n.key ? 'aria-current="page"' : ''}>${n.label}</a>`).join('')}
      </nav>
      <div class="util">
        <div class="search" id="siteSearch">
          <button class="icon-btn" aria-label="Search movies and cinemas" aria-expanded="false" id="searchBtn">${icon('search')}</button>
          <input type="search" id="searchInput" placeholder="Search movies, cinemas" aria-label="Search" tabindex="-1">
          <button class="search-close" id="searchClose" aria-label="Close search" tabindex="-1">${icon('close', 'sm')}</button>
        </div>
        <div class="dropdown" id="notifDD">
          <button class="icon-btn" aria-label="Notifications, ${unread} unread" aria-haspopup="true" aria-expanded="false" aria-controls="notifMenu">${icon('notifications')}${unread ? `<span class="count">${unread}</span>` : ''}</button>
          <div class="menu notif-panel" id="notifMenu">
            <div class="menu-head"><h4>Notifications</h4><button class="link sm" id="markRead">Mark all as read</button></div>
            ${SM.notifications.map(n => `<a class="notif ${n.unread ? '' : 'read'}" href="${n.link}"><span class="dot"></span><span><span class="t">${n.title}</span><span class="b">${n.body}</span><span class="when">${n.time}</span></span></a>`).join('')}
          </div>
        </div>
        <div class="dropdown" id="profileDD">
          <button class="avatar-btn" aria-label="Account menu" aria-haspopup="true" aria-expanded="false" aria-controls="profileMenu"><span class="avatar">${SM.user.initials}</span>${icon('expand_more', 'caret')}</button>
          <div class="menu" id="profileMenu">
            <div class="menu-head"><span class="avatar lg blue">${SM.user.initials}</span><div><div class="name">${SM.user.name}</div><div class="mail">${SM.user.email}</div></div></div>
            <div class="points-mini">
              <div class="row"><span class="eyebrow">Cinema Points</span><span class="tag blue">${icon('star', 'xs')}${SM.user.tier}</span></div>
              <div class="pts">${SM.user.points.toLocaleString()} pts</div>
              <div class="progress on-light mt-2"><span style="--value:${Math.round(SM.user.points / SM.user.tierMax * 100)}%"></span></div>
              <div class="helper mt-1">${SM.user.pointsToNext} pts to ${SM.user.nextTier}</div>
            </div>
            <a class="menu-item" href="profile.html">${icon('person')}My profile</a>
            <a class="menu-item" href="tickets.html">${icon('confirmation_number')}My Tickets</a>
            <a class="menu-item" href="profile.html#settings">${icon('settings')}Settings</a>
            <hr>
            <button class="menu-item danger" id="menuSignOut">${icon('logout')}Sign out</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  const tabbarHTML = (opts) => `<nav class="tabbar" aria-label="Main (mobile)">
      ${NAV.map(n => `<a href="${n.href}" ${opts.active === n.key ? 'aria-current="page"' : ''}>${icon(n.icon, opts.active === n.key ? 'fill' : '')}${n.label === 'My Tickets' ? 'Tickets' : n.label}</a>`).join('')}
      <a href="profile.html" ${opts.active === 'profile' ? 'aria-current="page"' : ''}>${icon('account_circle', opts.active === 'profile' ? 'fill' : '')}Profile</a>
    </nav>`;

  const footerHTML = () => `
    <div class="container">
      <div class="top">
        <div>
          ${brand('dark')}
          <p class="blurb">The biggest movies, the most comfortable seats and the snacks you love, at 79 branches nationwide.</p>
          <div class="apps"><a class="app" href="#">${icon('smartphone')}<span>Get the app<b>iOS and Android</b></span></a></div>
          <div class="social"><a href="#" aria-label="Facebook">${icon('thumb_up', 'sm')}</a><a href="#" aria-label="Instagram">${icon('photo_camera', 'sm')}</a><a href="#" aria-label="TikTok">${icon('music_note', 'sm')}</a><a href="#" aria-label="YouTube">${icon('play_arrow', 'sm')}</a></div>
        </div>
        <div><h4>Movies</h4><ul><li><a href="index.html">Now showing</a></li><li><a href="index.html#coming-soon">Coming soon</a></li><li><a href="experience.html">IMAX and formats</a></li><li><a href="#">MTRCB ratings guide</a></li></ul></div>
        <div><h4>Cinemas</h4><ul><li><a href="cinemas.html">Find a cinema</a></li><li><a href="experience.html#directors-club">Director's Club</a></li><li><a href="experience.html#event">Event Screen</a></li><li><a href="#">Snack Time</a></li></ul></div>
        <div><h4>Account</h4><ul><li><a href="profile.html">My profile</a></li><li><a href="tickets.html">My Tickets</a></li><li><a href="profile.html#points">Cinema Points</a></li><li><a href="profile.html#settings">Settings</a></li></ul></div>
        <div><h4>Help</h4><ul><li><a href="#">FAQs</a></li><li><a href="#">Refund policy</a></li><li><a href="#">Contact us</a></li><li><a href="#">Privacy</a></li></ul></div>
      </div>
      <div class="bottom"><span>© 2026 SM Cinema. SM Lifestyle Entertainment Inc.</span><span>SM Cinema redesign concept · IT 114 UX/UI Midterm · Sample data only</span></div>
    </div>`;

  /* ---------- cinema picker (lives in page content, as in the Figma home page) ---------- */
  function cinemaMenuHTML(id) {
    const c = currentCinema();
    return `<div class="menu cinemas-menu left" id="${id}" role="menu">
      <div class="menu-head"><div><div class="name">Choose a cinema</div><div class="mail">Showtimes and prices follow the branch you pick.</div></div></div>
      ${SM.cinemas.map(x => `<button class="menu-item cinema-row ${x.id === c.id ? 'active' : ''}" role="menuitemradio" aria-checked="${x.id === c.id}" data-cinema="${x.id}">${icon('location_on')}<span><b>${x.name}</b><span class="sub">${x.address} · ${x.distanceKm} km</span></span>${x.id === c.id ? icon('check', 'check') : ''}</button>`).join('')}
      <hr><a class="menu-item" href="cinemas.html">${icon('map')}See all cinemas and showtimes</a>
    </div>`;
  }
  let pickerCount = 0;
  function renderCinemaPicker(host) {
    const id = `cinemaMenu${++pickerCount}`;
    host.classList.add('dropdown');
    host.innerHTML = `<button class="cinema-select" aria-haspopup="true" aria-expanded="false" aria-controls="${id}" title="Change cinema">${icon('location_on')}<span data-cinema-label>${currentCinema().name}</span>${icon('expand_more', 'caret')}</button>${cinemaMenuHTML(id)}`;
    wireDropdowns(host);
  }
  function syncCinema() {
    const c = currentCinema();
    $$('[data-cinema-label]').forEach(el => el.textContent = c.name);
    $$('[data-cinema]').forEach(x => { const on = x.dataset.cinema === c.id; x.classList.toggle('active', on); x.setAttribute('aria-checked', on); x.querySelector('.check')?.remove(); if (on) x.insertAdjacentHTML('beforeend', icon('check', 'check')); });
  }

  /* ---------- dropdown behaviour ---------- */
  function closeAllMenus(except) {
    $$('.menu.open').forEach(m => { if (m !== except) { m.classList.remove('open'); const b = $(`[aria-controls="${m.id}"]`); if (b) b.setAttribute('aria-expanded', 'false'); } });
  }
  function wireDropdowns(root) {
    $$('[aria-controls]', root).forEach(btn => {
      const menu = document.getElementById(btn.getAttribute('aria-controls'));
      if (!menu || !menu.classList.contains('menu')) return;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = menu.classList.contains('open');
        closeAllMenus();
        if (!open) { menu.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
      });
    });
    document.addEventListener('click', (e) => { if (!e.target.closest('.menu')) closeAllMenus(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeAllMenus(); closeTopModal(); } });
  }

  function wireHeader(opts) {
    const header = $('#site-header');
    wireDropdowns(header);
    // search expand
    const search = $('#siteSearch'), sBtn = $('#searchBtn'), sInput = $('#searchInput'), sClose = $('#searchClose');
    const closeSearch = (refocus) => { search.classList.remove('open'); sBtn.setAttribute('aria-expanded', 'false'); sInput.value = ''; sInput.tabIndex = -1; sClose.tabIndex = -1; if (refocus) sBtn.focus(); };
    sBtn.addEventListener('click', (e) => { e.stopPropagation(); const open = search.classList.toggle('open'); sBtn.setAttribute('aria-expanded', open); sInput.tabIndex = open ? 0 : -1; sClose.tabIndex = open ? 0 : -1; if (open) sInput.focus(); });
    sClose.addEventListener('click', (e) => { e.stopPropagation(); closeSearch(true); });
    sInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSearch(true);
      if (e.key === 'Enter' && sInput.value.trim()) { const q = sInput.value.trim().toLowerCase(); const m = SM.movies.find(x => x.title.toLowerCase().includes(q)); const c = SM.cinemas.find(x => x.name.toLowerCase().includes(q)); location.href = m ? `movie.html?id=${m.id}` : c ? `cinemas.html?cinema=${c.id}` : `index.html?q=${encodeURIComponent(q)}`; }
    });
    document.addEventListener('click', (e) => { if (!e.target.closest('#siteSearch') && !sInput.value) closeSearch(false); });
    // notifications
    $('#markRead')?.addEventListener('click', () => { SM.notifications.forEach(n => n.unread = false); $$('.notif', header).forEach(n => n.classList.add('read')); $('#notifDD .count')?.remove(); });
    // sign out
    $('#menuSignOut')?.addEventListener('click', () => { closeAllMenus(); openModal('signOutModal') || toast({ icon: 'logout', tone: 'blue', title: 'Signed out', body: 'See you at the movies.' }); });
    // scroll shadow
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ---------- modals ---------- */
  const modalStack = [];
  let lastFocus = null;
  function openModal(id) {
    const m = typeof id === 'string' ? document.getElementById(id) : id;
    if (!m) return false;
    lastFocus = document.activeElement;
    m.classList.add('open'); m.removeAttribute('hidden'); m.setAttribute('aria-hidden', 'false');
    modalStack.push(m);
    document.body.style.overflow = 'hidden';
    const f = m.querySelector('[autofocus], .btn-primary, .close, button, input');
    if (f) setTimeout(() => f.focus(), 30);
    m.dispatchEvent(new CustomEvent('sm:open'));
    return true;
  }
  function closeModal(id) {
    const m = typeof id === 'string' ? document.getElementById(id) : (id || modalStack[modalStack.length - 1]);
    if (!m) return;
    m.classList.remove('open'); m.setAttribute('aria-hidden', 'true');
    const i = modalStack.indexOf(m); if (i > -1) modalStack.splice(i, 1);
    if (!modalStack.length) document.body.style.overflow = '';
    m.dispatchEvent(new CustomEvent('sm:close'));
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  const closeTopModal = () => { if (modalStack.length) closeModal(modalStack[modalStack.length - 1]); };
  function wireModals() {
    $$('.modal').forEach(m => {
      m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-hidden', 'true');
      m.addEventListener('click', (e) => { if (e.target === m) closeModal(m); });
      $$('[data-close]', m).forEach(b => b.addEventListener('click', () => closeModal(m)));
    });
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-open]'); if (!t) return;
      e.preventDefault(); openModal(t.dataset.open);
    });
  }

  /* ---------- toasts ---------- */
  function toast({ icon: ic = 'check', tone = 'green', title, body = '', extra = '', actions = [], timeout = 6000 }) {
    let host = $('.toasts'); if (!host) { host = document.createElement('div'); host.className = 'toasts'; host.setAttribute('aria-live', 'polite'); document.body.appendChild(host); }
    const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status');
    el.innerHTML = `<span class="ic icon-circle ${tone}">${icon(ic, 'sm')}</span><div><div class="t">${title}</div>${body ? `<div class="b">${body}</div>` : ''}${extra ? `<div class="extra">${extra}</div>` : ''}${actions.length ? `<div class="acts">${actions.map((a, i) => `<button class="btn btn-sm ${a.primary ? 'btn-primary' : 'btn-tertiary'}" data-i="${i}">${a.label}</button>`).join('')}</div>` : ''}</div><button class="x" aria-label="Dismiss">${icon('close', 'sm')}</button>`;
    const remove = () => { el.classList.add('leaving'); setTimeout(() => el.remove(), 300); };
    el.querySelector('.x').addEventListener('click', remove);
    actions.forEach((a, i) => el.querySelector(`[data-i="${i}"]`).addEventListener('click', () => { if (a.href) location.href = a.href; else if (a.onClick) a.onClick(); remove(); }));
    host.appendChild(el);
    if (timeout) setTimeout(remove, timeout);
    return el;
  }

  /* ---------- tabs ---------- */
  function wireTabs(root = document) {
    $$('[data-tabs]', root).forEach(tabs => {
      const btns = $$('[role="tab"]', tabs);
      const activate = (btn) => {
        btns.forEach(b => { const on = b === btn; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; const p = document.getElementById(b.getAttribute('aria-controls')); if (p) p.hidden = !on; });
        tabs.dispatchEvent(new CustomEvent('sm:tab', { detail: btn.getAttribute('aria-controls') }));
      };
      btns.forEach((b, i) => {
        b.addEventListener('click', () => activate(b));
        b.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') btns[(i + 1) % btns.length].focus(); if (e.key === 'ArrowLeft') btns[(i - 1 + btns.length) % btns.length].focus(); });
      });
      const first = btns.find(b => b.getAttribute('aria-selected') === 'true') || btns[0];
      if (first) activate(first);
    });
  }

  /* ---------- toggles ---------- */
  function wireToggles(root = document) {
    $$('.toggle', root).forEach(t => {
      t.setAttribute('role', 'switch');
      t.addEventListener('click', () => { const on = t.getAttribute('aria-checked') !== 'true'; t.setAttribute('aria-checked', on); const st = t.parentElement.querySelector('.state'); if (st) st.textContent = on ? 'On' : 'Off'; t.dispatchEvent(new CustomEvent('sm:toggle', { detail: on, bubbles: true })); });
    });
  }

  /* ---------- misc helpers ---------- */
  const qs = (k) => new URLSearchParams(location.search).get(k);
  const ratingChip = (r) => `<span class="rating" data-r="${r}">${r}</span>`;
  function qrSVG(seed = 'SM') {
    // deterministic pseudo-QR pattern (decorative)
    let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const n = 25, cells = [];
    const rnd = () => { h ^= h << 13; h >>>= 0; h ^= h >> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; };
    const finder = (x, y) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      let on;
      if (finder(x, y)) { const fx = x < 7 ? x : x - (n - 7), fy = y < 7 ? y : y - (n - 7); on = fx === 0 || fy === 0 || fx === 6 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4); }
      else on = rnd() > 0.52;
      if (on) cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
    }
    return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" fill="#0E1222" role="img" aria-label="QR code">${cells.join('')}</svg>`;
  }

  /* ---------- init ---------- */
  function init(opts = {}) {
    const h = $('#site-header'); if (h) { h.classList.add('site-header'); h.innerHTML = headerHTML(opts); h.insertAdjacentHTML('afterend', tabbarHTML(opts)); wireHeader(opts); }
    const f = $('#site-footer'); if (f) { f.classList.add('site-footer'); f.innerHTML = footerHTML(); }
    $$('[data-cinema-picker]').forEach(renderCinemaPicker);
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cinema]'); if (!b || !b.closest('.menu')) return;
      store.set('cinema', b.dataset.cinema);
      const c = currentCinema(); syncCinema(); closeAllMenus();
      toast({ icon: 'location_on', tone: 'blue', title: `Showing ${c.name}`, body: 'Showtimes and prices now follow this branch.', timeout: 3000 });
      document.dispatchEvent(new CustomEvent('sm:cinema', { detail: c }));
    });
    wireModals(); wireTabs(); wireToggles();
    document.dispatchEvent(new CustomEvent('sm:ready'));
  }

  return { init, openModal, closeModal, closeTopModal, toast, wireTabs, wireToggles, store, currentCinema, syncCinema, renderCinemaPicker, applyTheme, theme, qs, icon, ratingChip, qrSVG, $, $$ };
})();
