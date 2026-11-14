/* Experience page: format cards, Event Screen inquiry, comparison table */
(function () {
  const { $, $$, icon, openModal, closeModal, toast } = SMUI;
  const glow = { imax: '#2F63E3', 'directors-club': '#FFC629', screenx: '#C2459A', regular: '#4F7FE8' };
  const xpParam = { imax: 'IMAX', 'directors-club': "Director's Club", screenx: 'ScreenX', regular: 'All' };
  $('#xpGrid').innerHTML = SM.experiences.map(x => `<article class="xp-card" id="${x.id}">
      <div class="banner" style="background: radial-gradient(circle at 78% 28%, ${glow[x.id]} 0%, transparent 58%), radial-gradient(circle at 10% 90%, rgba(255,255,255,.12) 0%, transparent 40%), var(--blue-900)"><span class="tag white badge">${x.badge}</span>${icon(x.icon)}</div>
      <div class="body">
        <h3>${x.name}</h3>
        <p class="text-2">${x.tagline}</p>
        <ul class="bullets mt-2">${x.bullets.map(b => `<li>${icon('check')}<span>${b}</span></li>`).join('')}</ul>
        <div class="foot"><span class="row" style="gap:6px">${icon('location_on', 'sm')}${x.near}</span><a class="btn btn-primary btn-sm" href="cinemas.html?xp=${encodeURIComponent(xpParam[x.id])}">${x.cta}</a></div>
      </div>
    </article>`).join('');

  const cmp = SM.experienceCompare;
  $('#compare').innerHTML = `<thead><tr><th></th>${cmp.columns.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${cmp.rows.map(r => `<tr><td>${r.label}</td>${r.cells.map(([m, t]) => `<td>${m === '+' ? `<span class="yes">${icon('check')}<span>${t}</span></span>` : m === '-' ? `<span class="no">${icon('remove')}<span>${t}</span></span>` : t}</td>`).join('')}</tr>`).join('')}</tbody>`;

  /* Event Screen inquiry */
  const form = $('#inquiryForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    $$('[required]', form).forEach(f => { const bad = !f.value.trim(); f.setAttribute('aria-invalid', bad); if (bad) ok = false; });
    if (!ok) { toast({ icon: 'error', tone: 'red', title: 'Fill in the highlighted fields', timeout: 3500 }); return; }
    closeModal('inquiryModal'); form.reset();
    toast({ icon: 'mark_email_read', title: 'Inquiry sent', body: 'Our events team will email you within one working day.', timeout: 6000 });
  });
})();
