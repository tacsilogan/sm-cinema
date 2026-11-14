/* Home page: hero carousel, quick book, movie grids with filters, experience teaser, promos */
(function () {
  const { $, $$, icon, ratingChip, currentCinema, qs } = SMUI;

  /* ---------- Hero carousel ---------- */
  const hero = $('#hero');
  let slide = 0, timer;
  const slides = SM.heroSlides;
  function renderHero() {
    $('.slides', hero).innerHTML = slides.map((s, i) => `<div class="slide ${i === 0 ? 'active' : ''}"><img src="${s.image}" alt="" loading="${i === 0 ? 'eager' : 'lazy'}"></div>`).join('');
    $('.thumbs', hero).innerHTML = slides.map((s, i) => `<button class="thumb" data-i="${i}" aria-label="Show slide ${i + 1}: ${s.title}" ${i === 0 ? 'aria-current="true"' : ''}><img src="${s.image}" alt=""></button>`).join('');
    $('.dots', hero).innerHTML = slides.map((s, i) => `<button data-i="${i}" aria-label="Slide ${i + 1}" ${i === 0 ? 'aria-current="true"' : ''}></button>`).join('');
    paintSlide(0);
  }
  function paintSlide(i) {
    const s = slides[i]; const m = SM.movieById(s.movieId);
    $('.eyebrow', hero).textContent = s.eyebrow;
    $('h1', hero).textContent = s.title;
    $('.sub', hero).textContent = s.subtitle;
    $('.chips', hero).innerHTML = m ? [m.rating, SM.runtimeLabel(m.runtime), m.genre, ...m.formats].map(x => `<span>${x}</span>`).join('') : '';
    $('.cta-main', hero).textContent = s.cta;
    $('.cta-main', hero).href = `movie.html?id=${s.movieId}`;
    $('.cta-alt', hero).innerHTML = `${icon('play_circle')}${s.ctaSecondary}`;
    $$('.slide', hero).forEach((el, k) => el.classList.toggle('active', k === i));
    $$('.thumb', hero).forEach((el, k) => k === i ? el.setAttribute('aria-current', 'true') : el.removeAttribute('aria-current'));
    $$('.dots button', hero).forEach((el, k) => k === i ? el.setAttribute('aria-current', 'true') : el.removeAttribute('aria-current'));
    slide = i;
  }
  const go = (d) => paintSlide((slide + d + slides.length) % slides.length);
  const restart = () => { clearInterval(timer); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => go(1), 7000); };
  hero.addEventListener('click', (e) => { const t = e.target.closest('[data-i]'); if (t) { paintSlide(+t.dataset.i); restart(); } });
  $('.arrow.prev', hero).addEventListener('click', () => { go(-1); restart(); });
  $('.arrow.next', hero).addEventListener('click', () => { go(1); restart(); });
  hero.addEventListener('mouseenter', () => clearInterval(timer));
  hero.addEventListener('mouseleave', restart);
  hero.addEventListener('focusin', () => clearInterval(timer));
  renderHero(); restart();

  /* ---------- Quick book ---------- */
  const qbMovie = $('#qbMovie'), qbCinema = $('#qbCinema'), qbDate = $('#qbDate'), qbTime = $('#qbTime');
  qbMovie.innerHTML = SM.movies.filter(m => m.status === 'now-showing').map(m => `<option value="${m.id}">${m.title}</option>`).join('');
  qbCinema.innerHTML = SM.cinemas.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  qbDate.innerHTML = SM.dates.filter(d => !d.disabled).map(d => `<option value="${d.iso}">${d.full}</option>`).join('');
  function fillTimes() {
    const st = SM.showtimesFor(qbCinema.value, qbMovie.value);
    const times = st.flatMap(s => s.times.filter(t => t.state !== 'sold').map(t => `${t.t} · ${s.format}`));
    qbTime.innerHTML = times.length ? `<option value="">Any time</option>` + times.map(t => `<option>${t}</option>`).join('') : `<option value="">Not showing here</option>`;
    qbTime.disabled = !times.length;
  }
  qbCinema.value = currentCinema().id; fillTimes();
  [qbMovie, qbCinema].forEach(s => s.addEventListener('change', fillTimes));
  $('#qbGo').addEventListener('click', () => { location.href = `movie.html?id=${qbMovie.value}&cinema=${qbCinema.value}&date=${qbDate.value}${qbTime.value ? '&time=' + encodeURIComponent(qbTime.value.split(' · ')[0]) : ''}`; });

  /* ---------- Movie grids ---------- */
  let filter = 'All';
  const q = (qs('q') || '').toLowerCase();
  function card(m) {
    const soon = m.status === 'coming-soon';
    const art = m.poster ? `<img src="${m.poster}" alt="${m.title} poster" loading="lazy">` : `<div class="big">${m.title}</div><div class="when">Opens ${m.opensShort}</div>`;
    const fmts = m.formats.filter(f => f !== '2D').slice(0, 2);
    return `<a class="poster-card ${soon ? 'soon' : ''}" href="movie.html?id=${m.id}">
      <div class="art">${art}${fmts.length ? `<div class="fmt">${fmts.map(f => `<span>${f}</span>`).join('')}</div>` : ''}
        <div class="overlay"><span class="btn btn-primary btn-sm">${soon ? 'Notify me' : 'Get tickets'}</span><span class="btn btn-ghost btn-sm">Details</span></div>
      </div>
      <div class="title clamp-2">${m.title}</div>
      <div class="meta">${ratingChip(m.rating)}<span>${SM.runtimeLabel(m.runtime)}</span><span class="sep">·</span><span>${m.genre}</span></div>
    </a>`;
  }
  function renderGrid() {
    const match = (m) => (filter === 'All' || m.formats.includes(filter)) && (!q || m.title.toLowerCase().includes(q));
    const now = SM.movies.filter(m => m.status === 'now-showing' && match(m));
    const soon = SM.movies.filter(m => m.status === 'coming-soon' && match(m));
    $('#gridNow').innerHTML = now.length ? now.map(card).join('') : `<div class="empty" style="grid-column:1/-1">${icon('movie_filter')}<h3>No ${filter} showings at ${currentCinema().name} today</h3><p>Try another format or <a href="cinemas.html">pick a different cinema</a>.</p></div>`;
    $('#gridSoon').innerHTML = soon.length ? soon.map(card).join('') : `<div class="empty" style="grid-column:1/-1">${icon('upcoming')}<h3>Nothing announced yet</h3></div>`;
    $('#countNow').textContent = now.length; $('#countSoon').textContent = soon.length;
  }
  $$('#formatFilters .chip').forEach(ch => ch.addEventListener('click', () => { $$('#formatFilters .chip').forEach(c => c.setAttribute('aria-pressed', c === ch)); filter = ch.dataset.f; renderGrid(); }));
  document.addEventListener('sm:cinema', renderGrid);
  renderGrid();
  if (q) { $('#searchBanner').hidden = false; $('#searchTerm').textContent = qs('q'); }
  $('#clearSearch')?.addEventListener('click', () => location.href = 'index.html');

  /* ---------- Experience teaser + promos ---------- */
  $('#xpTeaser').innerHTML = SM.experiences.map(x => `<a class="xp-mini" href="experience.html#${x.id}"><span class="ic" style="background:${x.gradient}">${icon(x.icon)}</span><span><b>${x.name}</b><small>${x.badge}</small></span>${icon('chevron_right', 'go')}</a>`).join('');
  $('#promos').innerHTML = SM.promos.map((p, i) => `<div class="promo ${i === 2 ? 'points' : ''}"><span class="tag ${i === 2 ? '' : 'blue'}">${p.tag}</span><b>${p.title}</b><p>${p.body}</p></div>`).join('');
})();
