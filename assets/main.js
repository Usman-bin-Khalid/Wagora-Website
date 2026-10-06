(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const $ = (id) => document.getElementById(id);
  const qs = (s, c = document) => c.querySelector(s);
  const qsa = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  /* ---------- Theme ---------- */
  const THEME_KEY = 'wagora-theme';
  const themeToggle = $('themeToggle');
  const themeMeta = $('themeColor');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const saved = () => { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } };
  const applyTheme = (theme, animate) => {
    if (animate) {
      root.classList.add('theme-anim');
      clearTimeout(applyTheme.t);
      applyTheme.t = setTimeout(() => root.classList.remove('theme-anim'), 400);
    }
    root.setAttribute('data-theme', theme);
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#0E1322' : '#FFF9F3');
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  };
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);
  if (themeToggle) themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* private mode: still switches */ }
  });
  systemDark.addEventListener('change', (e) => { if (!saved()) applyTheme(e.matches ? 'dark' : 'light', true); });

  /* ---------- Nav, progress, back to top ---------- */
  const nav = $('nav');
  const bar = $('progress');
  const onScroll = () => {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
    if (bar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = $('navToggle');
  const links = $('navLinks');
  if (toggle && links) {
    const setMenu = (open) => {
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', () => setMenu(!links.classList.contains('is-open')));
    links.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  }
  const toTop = $('toTop');
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
  const year = $('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Reveal on scroll ---------- */
  const items = qsa('.reveal');
  if (hasIO) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
        el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 70}ms`;
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Header link follows the section on screen ---------- */
  const navAnchors = qsa('.nav__links a[href^="#"]:not(.btn)');
  const sections = navAnchors.map((a) => qs(a.getAttribute('href'))).filter(Boolean);
  if (hasIO && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Hero phone follows the pointer a little ---------- */
  const tilt = qs('[data-tilt]');
  if (tilt && !reduced && window.matchMedia('(hover: hover)').matches) {
    const hero = tilt.closest('.hero');
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = `rotate(${3 + x * 4}deg) translate(${x * 10}px, ${y * 8}px)`;
    });
    hero.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
  }

  /* ---------- Feature explorer ---------- */
  const ex = $('ex');
  if (ex) {
    const data = [
      { tone: 'blue', title: "Today's care, at a glance.", body: 'Food, medication, walk and water in one row. Tap to log, watch the care score climb and keep a gentle streak going.', list: ['Care score and streaks that celebrate small wins', "Reminders that work even when you're offline", 'Switch between dogs in one tap'] },
      { tone: 'mint', title: 'Health records that travel with you.', body: 'Vaccinations, medication, vet visits, allergies and documents, all in one calm place and always up to date.', list: ['Preventive care shows what is up to date', 'Medication and allergy details ready for any vet', 'Share a clean vet report in seconds'] },
      { tone: 'lav', title: 'See how your dog is really doing.', body: 'Weight, activity, sleep and mood trends over 7 days, 30 days and beyond, with a gentle insight when something changes.', list: ['Simple charts, no medical jargon', 'A little insight when a pattern shifts', 'Spot changes before they become worries'] },
      { tone: 'peach', title: 'Every important paper, in one place.', body: 'Scan a vet document and WAGORA reads it for you. Folders for medical, vaccinations, insurance, microchip and travel.', list: ['Smart scanning turns paper into searchable records', 'Search everything by name', 'Rename, delete or share any document'] },
      { tone: 'blue', title: 'Train together, grow together.', body: 'Step-by-step programs for puppy basics, leash walking, recall, calm at home and more, with streaks to keep you going.', list: ['Short daily practices of about 5 minutes', 'Programs from puppy basics to calm-at-home plans', 'A 12-day streak feels great'] },
      { tone: 'lav', title: "Understand your dog's behaviour.", body: 'Mood, activity, sleep and behaviour events side by side, so "restless this week" is a pattern you can see, not a hunch.', list: ['Week-by-week mood and activity', 'Behaviour events like barking, digging or restlessness', 'A weekly insight in plain words'] },
    ];
    const tabs = qsa('.ex__tab', ex);
    const phones = qsa('[data-ex-phone]', ex);
    const stage = $('exStage');
    const copy = qs('.ex__copy', ex);
    let cur = 0;
    let timer;
    const show = (i) => {
      cur = i;
      const d = data[i];
      tabs.forEach((t, n) => {
        t.setAttribute('aria-selected', String(n === i));
        if (n === i) { t.style.animation = 'none'; void t.offsetWidth; t.style.animation = ''; }
      });
      phones.forEach((p, n) => p.classList.toggle('is-on', n === i));
      stage.dataset.tone = d.tone;
      $('exTitle').textContent = d.title;
      $('exBody').textContent = d.body;
      $('exList').innerHTML = d.list.map((l) => `<li>${l}</li>`).join('');
      copy.classList.remove('is-swap'); void copy.offsetWidth; copy.classList.add('is-swap');
      if (window.matchMedia('(max-width: 1080px)').matches && tabs[i].scrollIntoView) {
        const t = tabs[i].parentElement; t.scrollTo({ left: tabs[i].offsetLeft - 20, behavior: reduced ? 'auto' : 'smooth' });
      }
    };
    const start = () => { stop(); timer = setInterval(() => show((cur + 1) % data.length), 6000); };
    const stop = () => clearInterval(timer);
    tabs.forEach((t, n) => {
      t.addEventListener('click', () => { stop(); ex.classList.add('is-paused'); show(n); });
      t.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const next = (n + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : data.length - 1)) % data.length;
        tabs[next].focus(); tabs[next].click();
      });
    });
    show(0);
    if (!reduced && hasIO) {
      new IntersectionObserver(([en]) => { if (en.isIntersecting && !ex.classList.contains('is-paused')) start(); else stop(); }, { threshold: 0.35 }).observe(ex);
    } else ex.classList.add('is-paused');
  }

  /* ---------- Interactive "today's care" ---------- */
  const care = qsa('[data-care]');
  if (care.length) {
    const arc = $('careArc'); const pct = $('carePct'); const msg = $('careMsg');
    const words = ['A calm start. Log your first one.', 'Lovely. One down!', 'Halfway there. Max approves.', 'Nearly perfect. One to go!', "All done. That's a happy dog."];
    const update = () => {
      const n = care.filter((b) => b.getAttribute('aria-pressed') === 'true').length;
      const v = Math.round((n / care.length) * 100);
      arc.setAttribute('stroke-dasharray', `${v} ${100 - v}`);
      pct.textContent = `${v}%`;
      msg.textContent = words[n];
    };
    care.forEach((b) => b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      b.querySelector('small').textContent = on ? 'Done' : 'Tap to log';
      update();
    }));
  }

  /* ---------- Count-up numbers ---------- */
  const counters = qsa('[data-count]');
  if (!reduced && hasIO) {
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target; const end = Number(el.dataset.count); const t0 = performance.now();
        const tick = (now) => {
          const t = Math.min((now - t0) / 1100, 1);
          el.textContent = String(Math.round(end * (1 - Math.pow(1 - t, 3))));
          if (t < 1) requestAnimationFrame(tick);
        };
        if (end > 0) { el.textContent = '0'; requestAnimationFrame(tick); }
        countObs.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => countObs.observe(el));
  }

  /* ---------- Chat demo ---------- */
  const chat = $('chat');
  if (chat) {
    const steps = qsa('[data-step]', chat);
    const play = () => {
      steps.forEach((s) => s.classList.remove('is-on'));
      const on = (n) => steps[n].classList.add('is-on');
      if (reduced) { on(0); on(2); return; }
      on(0);
      setTimeout(() => on(1), 900);
      setTimeout(() => { steps[1].classList.remove('is-on'); on(2); }, 2600);
    };
    if (hasIO) {
      const o = new IntersectionObserver(([en]) => { if (en.isIntersecting) { play(); o.disconnect(); } }, { threshold: 0.35 });
      o.observe(chat);
    } else steps.forEach((s, n) => { if (n !== 1) s.classList.add('is-on'); });
  }

  /* ---------- Sharing demo ---------- */
  const share = $('share');
  if (share) {
    const sum = qs('#shareSum span');
    let dur = '1 week';
    const update = () => {
      const on = qsa('[data-share]', share).filter((i) => i.checked).map((i) => i.dataset.share.toLowerCase());
      sum.textContent = on.length
        ? `Sam can see ${on.join(', ')} for ${dur === 'until you remove them' ? 'as long as you allow' : dur}. Nothing else.`
        : 'Sam cannot see anything yet. Switch something on to share it.';
    };
    share.addEventListener('change', update);
    qsa('[data-dur]', share).forEach((b) => b.addEventListener('click', () => {
      qsa('[data-dur]', share).forEach((x) => x.setAttribute('aria-checked', String(x === b)));
      dur = b.dataset.dur; update();
    }));
    update();
  }

  /* ---------- Pricing toggle ---------- */
  const seg = $('seg');
  if (seg) {
    const plans = {
      weekly: { price: '$1.99', per: 'per week', note: 'Billed weekly. Cancel any time.' },
      monthly: { price: '$4.99', per: 'per month', note: 'Billed monthly. Cancel any time.' },
      yearly: { price: '$34.99', per: 'per year', note: '<b>≈ $2.92 a month</b> · 7-day free trial for new subscribers' },
    };
    qsa('[data-plan]', seg).forEach((b) => b.addEventListener('click', () => {
      qsa('[data-plan]', seg).forEach((x) => x.setAttribute('aria-checked', String(x === b)));
      const p = plans[b.dataset.plan];
      $('planPrice').textContent = p.price; $('planPer').textContent = p.per; $('planNote').innerHTML = p.note;
    }));
  }

  /* ---------- Gallery: drag to scroll ---------- */
  const track = $('gallery-track');
  if (track) {
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; track.style.cursor = 'grabbing'; track.style.scrollSnapType = 'none'; });
    window.addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 3) moved = true; track.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', () => { if (!down) return; down = false; track.style.cursor = ''; track.style.scrollSnapType = ''; });
    track.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') track.scrollBy({ left: 260, behavior: 'smooth' }); if (e.key === 'ArrowLeft') track.scrollBy({ left: -260, behavior: 'smooth' }); });
  }

  /* ==========================================================
     Support centre: search + categories
     ========================================================== */
  const kb = $('kb');
  if (kb) {
    const q = $('kbSearch');
    const searchBox = qs('.search');
    const groups = qsa('.kb__group', kb);
    const cats = qsa('[data-cat]', kb);
    let cat = 'all';
    const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}\s]/gu, ' ');
    const filter = () => {
      const terms = norm(q.value).split(/\s+/).filter(Boolean);
      searchBox.classList.toggle('has-q', terms.length > 0);
      let total = 0;
      groups.forEach((g) => {
        let shown = 0;
        qsa('details', g).forEach((d) => {
          const hay = norm(d.textContent + ' ' + (d.dataset.tags || ''));
          const ok = terms.every((t) => hay.includes(t));
          d.hidden = !ok; if (ok) shown++;
        });
        const show = shown > 0 && (cat === 'all' || g.dataset.group === cat || terms.length > 0);
        g.hidden = !show; if (show) total += shown;
      });
      kb.classList.toggle('no-results', total === 0);
      if (terms.length && total) qsa('.kb__group:not([hidden]) details', kb).slice(0, 1).forEach((d) => { d.open = true; });
    };
    const setCat = (c, scroll) => {
      cat = c;
      cats.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === c)));
      q.value = ''; filter();
      if (scroll && c !== 'all') { const g = qs(`[data-group="${c}"]`, kb); if (g) g.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }
    };
    q.addEventListener('input', filter);
    $('kbClear').addEventListener('click', () => { q.value = ''; filter(); q.focus(); });
    cats.forEach((b) => b.addEventListener('click', () => setCat(b.dataset.cat, true)));
    qsa('[data-hot]').forEach((b) => b.addEventListener('click', () => { cat = 'all'; cats.forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.cat === 'all'))); q.value = b.dataset.hot; filter(); qs('.kb__group:not([hidden])', kb)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }));
    const fromHash = () => { const h = location.hash.slice(1); if (h && qs(`[data-group="${h}"]`, kb)) setCat(h, true); };
    window.addEventListener('hashchange', fromHash);
    filter(); fromHash();
  }

  /* ==========================================================
     Contact form
     The site has no server of its own, so by default the message is
     handed to the visitor's email app, addressed to support. If a
     SUPPORT_ENDPOINT is set it is POSTed as JSON instead.
     ========================================================== */
  const SUPPORT_EMAIL = 'wagora.support@gmail.com';
  const PRIVACY_EMAIL = 'wagora.support@gmail.com';
  const SUPPORT_ENDPOINT = '';
  const form = $('contactForm');
  if (form) {
    const openedAt = Date.now();
    const field = (id) => $(id);
    const message = field('cf-message');
    const count = field('cf-count');
    const status = field('cf-status');
    const done = field('cf-done');
    const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const kinds = { question: 'General question', feature: 'Feature idea', problem: 'Problem with the app', billing: 'Plus & billing', privacy: 'Privacy & data request', safety: 'Safety or lost-dog help', partnership: 'Partnership / press', other: 'Other' };

    const setError = (name, text) => {
      const el = field(`cf-${name}-error`);
      if (el) el.textContent = text || '';
      const input = field(`cf-${name}`);
      input?.closest('.cfield')?.classList.toggle('is-invalid', Boolean(text));
      if (input) { input.setAttribute('aria-invalid', text ? 'true' : 'false'); if (el) input.setAttribute('aria-describedby', el.id); }
    };
    const validate = () => {
      const errors = {};
      if (!field('cf-name').value.trim()) errors.name = 'Please tell us your name.';
      if (!EMAIL.test(field('cf-email').value.trim())) errors.email = 'Please enter a valid email.';
      if (message.value.trim().length < 10) errors.message = 'Please write at least 10 characters.';
      if (!field('cf-consent').checked) errors.consent = 'Please agree so we can reply to you.';
      ['name', 'email', 'message', 'consent'].forEach((k) => setError(k, errors[k]));
      return errors;
    };
    // Preselect the topic from the link, e.g. /support?topic=privacy#contact
    const topic = new URLSearchParams(location.search).get('topic');
    if (topic && kinds[topic]) field('cf-kind').value = topic;

    message.addEventListener('input', () => { count.textContent = `${message.value.length} / 4000`; });
    form.addEventListener('input', (e) => { const n = e.target.id?.replace('cf-', ''); if (n && field(`cf-${n}-error`)?.textContent) setError(n, ''); });

    const buildMail = () => {
      const kind = field('cf-kind').value;
      const subject = field('cf-subject').value.trim() || kinds[kind];
      const body = `${message.value.trim()}\n\n--\nName: ${field('cf-name').value.trim()}\nEmail: ${field('cf-email').value.trim()}\nTopic: ${kinds[kind]}\nSent from wagora website`;
      const to = kind === 'privacy' ? PRIVACY_EMAIL : SUPPORT_EMAIL;
      return { to, subject: `[WAGORA] ${subject}`, body };
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.hidden = true;
      const errors = validate();
      const first = Object.keys(errors)[0];
      if (first) { field(`cf-${first}`)?.focus(); return; }

      const mail = buildMail();
      if (SUPPORT_ENDPOINT) {
        form.classList.add('is-sending');
        form.querySelector('.cform__label').textContent = 'Sending…';
        try {
          const res = await fetch(SUPPORT_ENDPOINT, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source: 'website', kind: field('cf-kind').value, name: field('cf-name').value.trim(), email: field('cf-email').value.trim(), subject: field('cf-subject').value.trim() || null, message: message.value.trim(), consent: true, hp: field('cf-website').value, elapsedMs: Date.now() - openedAt }),
          });
          const json = await res.json().catch(() => null);
          if (res.ok && json?.success) { $('cf-ref').textContent = json.data.ref; $('cf-done-text').textContent = "We've received your message and will reply within 2 business days."; form.hidden = true; done.hidden = false; done.focus(); return; }
          status.textContent = res.status === 429 ? 'You have sent a few messages already. Please try again in an hour.' : json?.error?.message || 'Something went wrong. Please try again.';
        } catch { status.innerHTML = `We could not reach WAGORA right now. Please email <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.`; }
        status.hidden = false;
        form.classList.remove('is-sending');
        form.querySelector('.cform__label').textContent = 'Send message';
        return;
      }

      // Hand over to the visitor's email app (nothing is sent from this page).
      if (field('cf-website').value) return; // honeypot
      const href = `mailto:${mail.to}?subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(mail.body)}`;
      field('cf-ref').parentElement.hidden = true;
      $('cf-done-text').innerHTML = `Your email app should open with your message ready to send to <strong>${mail.to}</strong>. If nothing opened, copy it below and email us directly.`;
      done.dataset.mail = `To: ${mail.to}\nSubject: ${mail.subject}\n\n${mail.body}`;
      form.hidden = true; done.hidden = false; done.focus();
      window.location.href = href;
    });

    const copy = $('cf-copy');
    if (copy) copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(done.dataset.mail || ''); copy.textContent = 'Copied'; }
      catch { copy.textContent = `Email ${SUPPORT_EMAIL}`; }
      setTimeout(() => { copy.textContent = 'Copy my message'; }, 2200);
    });
    field('cf-again').addEventListener('click', () => { form.reset(); count.textContent = '0 / 4000'; done.hidden = true; form.hidden = false; field('cf-name').focus(); });
  }

  /* ---------- Legal: highlight the section on screen ---------- */
  const toc = qsa('.toc a');
  if (hasIO && toc.length) {
    const heads = toc.map((a) => qs(a.getAttribute('href'))).filter(Boolean);
    const o = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) toc.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${en.target.id}`)); }), { rootMargin: '-20% 0px -70% 0px' });
    heads.forEach((h) => o.observe(h));
  }
})();
