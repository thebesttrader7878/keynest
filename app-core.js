// KeyNest core: store, helpers, router, event delegation.
(function () {
  'use strict';
  const KEY = 'keynest_v2', SKEY = 'keynest_session_v2';
  const clone = o => JSON.parse(JSON.stringify(o));
  const blank = () => ({ props: [], units: [], tenants: [], payments: [], expenses: [], charges: [], leases: [], vendors: clone(KN_SEED.vendors), tickets: [], leads: [], threads: [], announcements: [], inspections: [], docs: [], settings: clone(KN_SEED.settings), readNotes: [], setup: false });
  const K = window.KN = { routes: {}, acts: {}, forms: {}, changes: {}, after: [] };
  K.load = () => { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.units) return Object.assign(blank(), s); } catch (e) {} return blank(); };
  K.db = K.load();
  K.save = () => { try { localStorage.setItem(KEY, JSON.stringify(K.db)); return true; } catch (e) { K.toast('Storage is full. Try smaller photos.'); return false; } };
  K.loadDemo = () => { K.db = Object.assign(blank(), clone(KN_SEED)); K.db.setup = true; K.applyLateFees(); if (K.stays) K.stays.ensure(); K.save(); };
  K.startFresh = () => { K.db = blank(); K.save(); };
  K.sess = () => { try { return JSON.parse(localStorage.getItem(SKEY)) || {}; } catch (e) { return {}; } };
  K.setSess = p => localStorage.setItem(SKEY, JSON.stringify(Object.assign(K.sess(), p)));
  const $ = K.$ = (s, r = document) => r.querySelector(s); K.$$ = (s, r = document) => [...r.querySelectorAll(s)];
  K.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  K.money = n => (n < 0 ? '-$' : '$') + Math.abs(Math.round(n)).toLocaleString();
  K.uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  K.today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  K.iso = d => { const x = new Date(d); return new Date(x.getTime() - x.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
  K.todayIso = () => K.iso(K.today());
  K.days = s => Math.round((new Date(s + 'T00:00:00') - K.today()) / 864e5);
  K.addDays = (s, n) => { const d = new Date(s + 'T00:00:00'); d.setDate(d.getDate() + n); return K.iso(d); };
  K.fmt = s => s ? new Date(s.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  K.mon = s => new Date(s.slice(0, 7) + '-01T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  K.prop = id => K.db.props.find(p => p.id === id) || {};
  K.unit = id => K.db.units.find(u => u.id === id) || {};
  K.tenant = id => K.db.tenants.find(t => t.id === id);
  K.vendor = id => K.db.vendors.find(v => v.id === id);
  K.bed = b => +b ? b + ' bed' : 'Studio';
  K.tip = t => `<button type="button" class="tip" aria-label="What does this mean?" data-tip="${K.esc(t)}">?</button>`;
  K.empty = (icon, title, text, actions = '') => `<div class="empty"><div class="ic">${icon}</div><h2>${title}</h2><p class="mut">${text}</p><div class="row">${actions}</div></div>`;
  K.toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2600); };
  K.unitState = u => { if (u.status === 'vacant') return 'vacant'; const t = K.tenant(u.tid); return t && K.days(t.end) <= 60 ? 'ending' : 'leased'; };
  // Money model: a payment row is one month's bill for one tenant.
  K.billTotal = p => p.rent + (p.extra || 0) + (p.lateFee || 0);
  K.paidAmt = p => (p.txns || []).reduce((a, t) => a + t.amt, 0);
  K.balance = p => K.billTotal(p) - K.paidAmt(p);
  K.payStatus = p => { const bal = K.balance(p), paid = K.paidAmt(p), past = K.days(K.addDays(p.due, K.db.settings.grace)) < 0; if (bal <= 0) return p.lateFee ? 'paid late' : 'paid'; if (paid > 0) return past ? 'partial late' : 'partial'; return past ? 'late' : 'due'; };
  K.statusPill = s => ({ paid: '<span class="pill green">Paid</span>', 'paid late': '<span class="pill amber">Paid late</span>', partial: '<span class="pill blue">Part paid</span>', 'partial late': '<span class="pill red">Part paid, late</span>', late: '<span class="pill red">Late</span>', due: '<span class="pill">Due</span>' }[s]);
  K.lateFeeFor = p => K.db.settings.lateType === 'percent' ? Math.round(p.rent * K.db.settings.lateAmount / 100) : +K.db.settings.lateAmount;
  K.applyLateFees = () => { let c = 0; K.db.payments.forEach(p => { if (!p.lateFee && K.balance(p) > 0 && K.days(K.addDays(p.due, K.db.settings.grace)) < 0) { p.lateFee = K.lateFeeFor(p); p.autoFee = true; c++; } }); return c; };
  K.ensureBills = () => { // create this month's bill for each active tenant
    const due = K.todayIso().slice(0, 8) + String(K.db.settings.dueDay).padStart(2, '0');
    K.db.tenants.forEach(t => { if (K.days(t.end) < -31) return; if (!K.db.payments.some(p => p.tid === t.id && p.due.slice(0, 7) === due.slice(0, 7))) { const u = K.unit(t.uid); K.db.payments.push({ id: K.uid('pay'), tid: t.id, uid: u.id, pid: u.pid, due, rent: u.rent, extra: K.db.charges.filter(c => c.uid === u.id).reduce((a, c) => a + c.amount, 0), lateFee: 0, txns: [] }); } });
  };
  K.scope = () => K.sess().pid || 'all';
  K.inScope = pid => K.scope() === 'all' || pid === K.scope();
  K.resize = (file, max = 900) => new Promise((res, rej) => { const r = new FileReader(); r.onerror = rej; r.onload = () => { const im = new Image(); im.onerror = rej; im.onload = () => { const s = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', .7)); }; im.src = r.result; }; r.readAsDataURL(file); });
  K.download = (name, text, type = 'text/csv') => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); };
  K.csv = rows => rows.map(r => r.map(c => { const s = String(c == null ? '' : c); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(',')).join('\n');
  K.bars = (data, opt = {}) => { // data: [{label, a, b}] simple grouped bar chart in SVG
    const W = 640, H = opt.h || 220, pad = 34, mx = Math.max(1, ...data.map(d => Math.max(d.a || 0, d.b || 0))), bw = (W - pad) / data.length;
    return `<svg class="chart" viewBox="0 0 ${W} ${H + 30}" role="img" aria-label="${K.esc(opt.label || 'Chart')}">${[0, .5, 1].map(f => `<line x1="${pad}" x2="${W}" y1="${H - f * (H - 10)}" y2="${H - f * (H - 10)}" stroke="#e5e7eb"/><text x="0" y="${H - f * (H - 10) + 4}" font-size="11" fill="#64748b">${f ? '$' + Math.round(mx * f / 1000) + 'k' : '0'}</text>`).join('')}${data.map((d, i) => { const x = pad + i * bw, h1 = (d.a || 0) / mx * (H - 10), h2 = (d.b || 0) / mx * (H - 10), w = Math.max(4, bw / 2 - 4); return `<rect x="${x + 2}" y="${H - h1}" width="${w}" height="${h1}" rx="3" fill="#0f766e"><title>${K.esc(d.label)}: ${K.money(d.a || 0)}</title></rect>${d.b != null ? `<rect x="${x + 2 + w + 2}" y="${H - h2}" width="${w}" height="${h2}" rx="3" fill="#f59e0b"><title>${K.money(d.b)}</title></rect>` : ''}<text x="${x + bw / 2}" y="${H + 18}" font-size="11" text-anchor="middle" fill="#64748b">${K.esc(d.label)}</text>`; }).join('')}</svg>`;
  };
  K.donut = (parts) => { const tot = parts.reduce((a, p) => a + p.v, 0) || 1; let acc = 0; const C = 2 * Math.PI * 42; return `<svg viewBox="0 0 120 120" class="donut" role="img" aria-label="Breakdown">${parts.map(p => { const len = p.v / tot * C, s = `<circle cx="60" cy="60" r="42" fill="none" stroke="${p.c}" stroke-width="18" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-acc}" transform="rotate(-90 60 60)"/>`; acc += len; return s; }).join('')}<text x="60" y="66" text-anchor="middle" font-size="20" font-weight="800">${Math.round(parts[0].v / tot * 100)}%</text></svg>`; };

  // ---------- router ----------
  K.go = h => { if (location.hash === h) K.render(); else location.hash = h; };
  K.render = () => {
    const h = location.hash.replace(/^#/, '') || '/', [path, qs] = h.split('?');
    const q = Object.fromEntries(new URLSearchParams(qs || '')), parts = path.split('/').filter(Boolean);
    document.body.classList.remove('menu');
    const fn = K.routes[parts[0] || ''] || K.routes._404;
    document.body.dataset.route = parts[0] || 'home';
    K.nav(parts[0] || '');
    $('#app').innerHTML = fn(parts.slice(1), q);
    if (!K._keepScroll) window.scrollTo(0, 0); K._keepScroll = false;
    K.after.splice(0).forEach(f => { try { f(); } catch (e) { console.error(e); } });
    const t = K.routeTitle; if (t) document.title = t; K.routeTitle = null;
  };
  K.rerender = () => { K._keepScroll = true; K.render(); };
  K.nav = r => {
    const s = K.sess();
    const renter = s.mode === 'renter';
    const links = renter ? [['stays', 'Furnished stays'], ['saved', 'Saved'], ['rentals', 'Long-term rentals']] : [['', 'Home'], ['stays', 'Furnished stays'], ['rentals', 'Find a rental'], ['tenant', s.tenant ? 'My home' : 'Tenant login'], ['dash', s.landlord ? 'Dashboard' : 'Landlord login']];
    const tog = `<button class="modetog" data-act="switchmode" data-testid="modetoggle">${renter ? '🏠 Switch to hosting' : '🧳 Switch to renting'}</button>`;
    const prof = s.landlord ? `<div class="profile"><button class="avatar" data-act="profmenu" aria-label="Profile menu">${K.esc((K.db.settings.owner || 'D')[0])}</button><div class="pmenu"><div class="fine">Signed in as owner@keynest.demo</div><div class="fine">Mode: <b>${renter ? 'Renter' : 'Landlord'}</b></div><button class="btn sm full" data-act="switchmode">${renter ? 'Switch to Landlord mode' : 'Switch to Renter mode'}</button>${renter ? '<a href="#/saved">Saved stays</a>' : '<a href="#/dash/stays">My furnished listings</a>'}<a href="#/dash" data-act="llogout">Log out</a></div></div>` : '';
    $('#nav').innerHTML = links.map(([k, t]) => `<a href="#/${k}" class="${r === k ? 'on' : ''}">${t}</a>`).join('') + tog + prof + (s.landlord ? '' : `<a href="#/signup" class="btn sm navcta">Start free trial</a>`);
    document.body.dataset.mode = renter ? 'renter' : 'host'; const mt = $('#mtog'); if (mt) mt.innerHTML = tog;
  };
  K.routes._404 = () => K.empty('🧭', 'Page not found', 'That link does not go anywhere.', '<a class="btn" href="#/">Go home</a>');
  window.addEventListener('hashchange', () => K.render());

  // ---------- delegation ----------
  document.addEventListener('click', e => {
    const tip = e.target.closest('.tip');
    K.$$('.tip.open').forEach(x => x !== tip && x.classList.remove('open'));
    if (tip) { e.preventDefault(); tip.classList.toggle('open'); return; }
    const el = e.target.closest('[data-act]');
    if (el && K.acts[el.dataset.act]) { if (el.tagName === 'A' && el.getAttribute('href') === '#') e.preventDefault(); K.acts[el.dataset.act](el, e); }
    const row = e.target.closest('[data-href]'); if (row && !e.target.closest('a,button,select,input')) K.go(row.dataset.href);
  });
  document.addEventListener('change', e => { const el = e.target.closest('[data-change]'); if (el && K.changes[el.dataset.change]) K.changes[el.dataset.change](el, e); });
  document.addEventListener('input', e => { const el = e.target.closest('[data-input]'); if (el && K.changes[el.dataset.input]) K.changes[el.dataset.input](el, e); });
  document.addEventListener('submit', e => { const f = e.target, n = f.dataset.form; if (!n || !K.forms[n]) return; e.preventDefault(); K.forms[n](Object.fromEntries(new FormData(f)), f, e); });
  K.acts.demo = () => { K.loadDemo(); K.toast('Demo data loaded'); K.rerender(); };
  K.acts.profmenu = el => el.parentNode.classList.toggle('open');
  K.acts.switchmode = () => { const s = K.sess(), to = s.mode === 'renter' ? 'host' : 'renter'; K.setSess({ mode: to }); K.toast(to === 'renter' ? 'Renter mode. Happy hunting!' : 'Landlord mode. Welcome back.'); K.go(to === 'renter' ? '#/stays' : (s.landlord ? '#/dash/home' : '#/dash')); K.nav((location.hash.split('/')[1] || '')); };
  K.acts.menu = () => document.body.classList.toggle('menu');
  K.acts.print = () => window.print();
  K.boot = () => {
    if (K.stays) K.stays.ensure();
    if (K.db.setup) { K.ensureBills(); const c = K.applyLateFees(); if (c) K.save(); }
    $('#reset').addEventListener('click', () => { if (confirm('Reset the demo? This loads fresh sample data and erases your changes.')) { K.loadDemo(); localStorage.removeItem(SKEY); K.stays && K.stays.ensure(); K.toast('Demo data reset'); K.go('#/'); } });
    K.render();
  };
})();
