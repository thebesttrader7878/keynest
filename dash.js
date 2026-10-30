// Landlord dashboard shell + home, wizard, units, tenants, leads, repairs, settings
(function () {
  const K = KN, e = K.esc, D = K.dash = { pages: {} };
  const groups = [
    ['Everyday', [['home', '🏠', 'Home'], ['rent', '💵', 'Rent'], ['repairs', '🔧', 'Repairs'], ['messages', '💬', 'Messages'], ['calendar', '📅', 'Calendar'], ['alerts', '🔔', 'Reminders']]],
    ['Units and people', [['units', '🏢', 'Units'], ['tenants', '👥', 'Tenants'], ['leads', '📬', 'Leads'], ['stays', '🛋', 'Furnished stays'], ['leases', '📝', 'Leases'], ['inspections', '🔍', 'Inspections']]],
    ['Money', [['expenses', '🧾', 'Expenses'], ['reports', '📊', 'Reports'], ['tools', '🧮', 'Calculators']]],
    ['More', [['market', '📣', 'Advertise'], ['vendors', '🧰', 'Vendors'], ['docs', '🗂', 'Documents'], ['settings', '⚙️', 'Settings']]]
  ];
  D.all = groups.flatMap(g => g[1]);
  D.scoped = arr => arr.filter(x => K.inScope(x.pid || K.unit(x.uid).pid));
  D.units = () => K.db.units.filter(u => K.inScope(u.pid));
  D.tenants = () => K.db.tenants.filter(t => K.inScope(K.unit(t.uid).pid));
  D.notes = () => {
    const n = [], db = K.db;
    D.tenants().forEach(t => { const d = K.days(t.end), ls = db.leases.find(l => l.tid === t.id && l.status === 'renewal'); if (d >= 0 && d <= 60 && !ls) n.push({ id: 'le' + t.id, kind: 'lease', text: `${t.name}'s lease ends in ${d} days. Sending a renewal offer now helps avoid an empty unit.`, href: '#/dash/leases', btn: 'Offer renewal' }); });
    D.scoped(db.payments).filter(p => ['late', 'partial late'].includes(K.payStatus(p))).forEach(p => { const t = K.tenant(p.tid); n.push({ id: 'rl' + p.id, kind: 'rent', text: `${t ? t.name : 'A tenant'} still owes ${K.money(K.balance(p))} for ${K.mon(p.due)}. A friendly reminder usually does it.`, href: '#/dash/rent', btn: 'See rent' }); });
    D.scoped(db.tickets).filter(t => t.status === 'new').forEach(t => n.push({ id: 'tk' + t.id, kind: 'repair', text: `New repair: "${t.title}" at ${K.prop(K.unit(t.uid).pid).name} ${K.unit(t.uid).label}. Pick someone to fix it.`, href: '#/dash/repairs', btn: 'Assign' }));
    D.scoped(db.leads).filter(l => l.status === 'new').forEach(l => n.push({ id: 'ld' + l.id, kind: 'lead', text: `${l.name} sent a new ${l.type === 'inquiry' ? 'question' : l.type}. Fast replies win renters.`, href: '#/dash/leads', btn: 'Reply' }));
    db.inspections.filter(i => i.status === 'scheduled' && K.days(i.date) <= 14 && K.inScope(K.unit(i.uid).pid)).forEach(i => n.push({ id: 'in' + i.id, kind: 'inspect', text: `${i.type} inspection for ${K.prop(K.unit(i.uid).pid).name} ${K.unit(i.uid).label} on ${K.fmt(i.date)}.`, href: '#/dash/inspections/' + i.id, btn: 'Open checklist' }));
    db.threads.filter(t => t.unread && K.tenant(t.tid)).forEach(t => n.push({ id: 'ms' + t.id + t.msgs.length, kind: 'msg', text: `New message from ${K.tenant(t.tid).name}.`, href: '#/dash/messages/' + t.id, btn: 'Read' }));
    return n;
  };
  K.routes.dash = (parts) => {
    const s = K.sess();
    if (!s.landlord) return `<div class="signup card"><div class="b"><h1>Landlord login</h1><div class="demo">Demo login: <b>owner@keynest.demo</b> / <b>demo</b></div>
      <form data-form="llogin"><label>Email</label><input name="email" type="email" required value="owner@keynest.demo"><label>Password</label><input name="pw" type="password" required value="demo"><button class="btn big">Log in</button></form><p class="fine center">New here? <a href="#/signup">Start a free trial</a></p></div></div>`;
    if (!K.db.setup) return D.wizard();
    const page = parts[0] || 'home', fn = D.pages[page] || D.pages.home;
    K.routeTitle = 'KeyNest dashboard';
    const nNotes = D.notes().filter(n => !K.db.readNotes.includes(n.id)).length;
    const sw = `<label class="switch"><span class="sr">Property</span><select data-change="scope" aria-label="Choose property"><option value="all">All properties (${K.db.props.length})</option>${K.db.props.map(p => `<option value="${p.id}" ${K.scope() === p.id ? 'selected' : ''}>${e(p.name)}</option>`).join('')}</select></label>`;
    return `<div class="dash"><aside class="side">${sw}${groups.map(([g, items]) => `<div class="sgroup"><div class="sg">${g}</div>${items.map(([k, i, t]) => `<a href="#/dash/${k}" class="${k === page ? 'on' : ''}"><span>${i}</span>${t}${k === 'alerts' && nNotes ? `<span class="count">${nNotes}</span>` : ''}</a>`).join('')}</div>`).join('')}<a href="#/dash" data-act="llogout" class="out">↩ Log out</a></aside>
      <section class="dmain"><div class="mswitch">${sw}</div>${fn(parts.slice(1))}</section></div>
      <nav class="tabbar">${[['home', '🏠', 'Home'], ['rent', '💵', 'Rent'], ['repairs', '🔧', 'Repairs'], ['messages', '💬', 'Messages'], ['more', '☰', 'More']].map(([k, i, t]) => `<a href="#/dash/${k}" class="${k === page || (k === 'more' && !['home', 'rent', 'repairs', 'messages'].includes(page)) ? 'on' : ''}"><span>${i}</span>${t}${k === 'more' && nNotes ? '<i></i>' : ''}</a>`).join('')}</nav>`;
  };
  D.pages.more = () => `<h1>Everything</h1>${groups.map(([g, items]) => `<h3 class="sg2">${g}</h3><div class="moregrid">${items.map(([k, i, t]) => `<a href="#/dash/${k}"><span>${i}</span>${t}</a>`).join('')}</div>`).join('')}<button class="btn ghost big" data-act="llogout">Log out</button>`;
  K.changes.scope = el => { K.setSess({ pid: el.value }); K.rerender(); };
  K.forms.llogin = d => { if (d.email.trim().toLowerCase() !== 'owner@keynest.demo' || d.pw !== 'demo') return K.toast('Use the demo login shown above'); if (!K.db.setup && !K.db.props.length) K.loadDemo(); K.setSess({ landlord: true, pid: 'all', mode: 'host' }); K.stays && K.stays.ensure(); K.rerender(); };
  K.acts.llogout = () => { K.setSess({ landlord: false }); setTimeout(() => K.go('#/dash'), 0); };

  // ---------- HOME ----------
  D.monthStats = () => { const m = K.todayIso().slice(0, 7), cur = D.scoped(K.db.payments).filter(p => p.due.slice(0, 7) === m); return { due: cur.reduce((a, p) => a + K.billTotal(p), 0), paid: cur.reduce((a, p) => a + K.paidAmt(p), 0), late: cur.filter(p => ['late', 'partial late'].includes(K.payStatus(p))), owed: cur.reduce((a, p) => a + Math.max(0, K.balance(p)), 0) }; };
  D.homeBody = (preview) => {
    const units = D.units(), vac = units.filter(u => u.status === 'vacant').length, ms = D.monthStats(), tk = D.scoped(K.db.tickets), open = tk.filter(t => t.status !== 'done').length, notes = D.notes();
    const todo = [];
    if (!K.db.props.length) todo.push(['Add your first property', '#/dash/settings']);
    if (vac) todo.push([`Advertise your ${vac} empty unit${vac > 1 ? 's' : ''}`, '#/dash/market']);
    if (ms.late.length) todo.push([`Remind ${ms.late.length} tenant${ms.late.length > 1 ? 's' : ''} about late rent`, '#/dash/rent']);
    const nl = D.scoped(K.db.leads).filter(l => l.status === 'new').length; if (nl) todo.push([`Reply to ${nl} new lead${nl > 1 ? 's' : ''}`, '#/dash/leads']);
    const na = tk.filter(t => t.status === 'new').length; if (na) todo.push([`Pick a vendor for ${na} new repair${na > 1 ? 's' : ''}`, '#/dash/repairs']);
    const ren = notes.filter(n => n.kind === 'lease').length; if (ren) todo.push([`Send ${ren} lease renewal offer${ren > 1 ? 's' : ''}`, '#/dash/leases']);
    const g = new Date().getHours();
    return `<h1 class="hi">${g < 12 ? 'Good morning' : g < 17 ? 'Good afternoon' : 'Good evening'}${K.sess().owner ? ', ' + e(K.sess().owner.split(' ')[0]) : ''} 👋</h1>
      ${notes.slice(0, preview ? 1 : 2).map(n => `<div class="alert gentle"><span>${n.kind === 'rent' ? '💵' : n.kind === 'lease' ? '📅' : '🔔'} ${e(n.text)}</span><a class="btn sm ghost" href="${n.href}">${n.btn}</a></div>`).join('')}${!preview && notes.length > 2 ? `<a class="more-notes" href="#/dash/alerts">See all ${notes.length} reminders →</a>` : ''}
      <div class="bigcards">
        <a class="big-card" href="#/dash/units"><div class="lbl">Empty units ${K.tip('Units with nobody living there. They earn $0 until rented, so filling them comes first.')}</div><div class="v">${vac}</div><div class="mut">of ${units.length} units</div></a>
        <a class="big-card" href="#/dash/rent"><div class="lbl">Rent this month ${K.tip('Rent and extra charges paid so far this month, out of everything that is due. "Late" means the grace period is over and it is not fully paid.')}</div><div class="v">${K.money(ms.paid)}</div><div class="mut">of ${K.money(ms.due)}${ms.late.length ? ` · <b class="bad">${ms.late.length} late</b>` : ' · nobody late 🎉'}</div><div class="prog"><i style="width:${ms.due ? Math.min(100, ms.paid / ms.due * 100) : 0}%"></i></div></a>
        <a class="big-card" href="#/dash/repairs"><div class="lbl">Open repairs ${K.tip('Repairs that are not finished yet. New ones still need someone assigned.')}</div><div class="v">${open}</div><div class="mut">${na} need a vendor</div></a>
      </div>
      <div class="card"><div class="b"><h2 class="h2s">What to do next</h2>${todo.length ? `<ul class="todo">${todo.map(([t, h]) => `<li><a href="${h}"><span class="ck"></span>${e(t)}<span class="arr">→</span></a></li>`).join('')}</ul>` : '<p>You are all caught up. Nice work. ☕</p>'}</div></div>`;
  };
  D.pages.home = () => D.homeBody(false);

  // ---------- WIZARD ----------
  let wz = { step: 1, pid: null };
  D.wizard = () => {
    const steps = ['Property', 'Units', 'Tenants'], p = K.db.props.find(x => x.id === wz.pid), us = K.db.units.filter(u => u.pid === wz.pid);
    const bar = `<ol class="steps">${steps.map((s, i) => `<li class="${i + 1 < wz.step ? 'done' : i + 1 === wz.step ? 'on' : ''}"><span>${i + 1 < wz.step ? '✓' : i + 1}</span>${s}</li>`).join('')}</ol>`;
    let body = '';
    if (wz.step === 1 || !p) body = `<h2>Let's add your first property</h2><p class="mut">Just the basics. You can change anything later.</p><form data-form="wz1">
      <label>Give it a nickname</label><input name="name" required placeholder="e.g. Oak Street Duplex">
      <label>Street address</label><input name="addr" required placeholder="123 Main St">
      <label>Neighborhood</label><select name="hood">${['Westport', 'Brookside', 'Midtown', 'River Market', 'Waldo', 'Crossroads', 'Plaza', 'Northland', 'Other'].map(h => `<option>${h}</option>`).join('')}</select>
      <label>What kind of building?</label><div class="choice">${['Duplex', 'Triplex', 'Fourplex', 'Small apartment'].map((t, i) => `<label><input type="radio" name="type" value="${t}" ${i ? '' : 'checked'}><span>${t}</span></label>`).join('')}</div>
      <button class="btn big">Next: add units →</button></form>`;
    else if (wz.step === 2) body = `<h2>Add the units at ${e(p.name)}</h2><p class="mut">A duplex has 2 units. Add them one at a time.</p>
      ${us.length ? `<div class="chips">${us.map(u => `<span class="pill green">Unit ${e(u.label)} · ${K.bed(u.beds)} · ${K.money(u.rent)}</span>`).join('')}</div>` : ''}
      <form data-form="wz2"><div class="two"><div><label>Unit name or number</label><input name="label" required placeholder="${us.length ? 'B' : 'A'}"></div><div><label>Monthly rent ($)</label><input name="rent" type="number" required min="0" inputmode="numeric" placeholder="1100"></div></div>
      <div class="two"><div><label>Bedrooms</label><select name="beds">${[0, 1, 2, 3, 4].map(b => `<option value="${b}" ${b === 2 ? 'selected' : ''}>${K.bed(b)}</option>`).join('')}</select></div><div><label>Bathrooms</label><select name="baths"><option>1</option><option>1.5</option><option>2</option></select></div></div>
      <button class="btn ghost big" type="submit">+ Add this unit</button></form>
      <button class="btn big" data-act="wznext" ${us.length ? '' : 'disabled'}>Next: tenants →</button>`;
    else body = `<h2>Who lives there now?</h2><p class="mut">Add the tenant and lease dates for each rented unit. Leave a unit empty and we will help you list it.</p>
      ${us.map(u => { const t = K.tenant(u.tid); return `<div class="card inset"><div class="b"><b>Unit ${e(u.label)}</b> ${t ? `<span class="pill green">${e(t.name)} · lease ends ${K.fmt(t.end)}</span>` : `<form data-form="wz3" data-uid="${u.id}"><div class="two"><div><label>Tenant name</label><input name="name" required></div><div><label>Phone or email</label><input name="contact"></div></div><div class="two"><div><label>Lease start</label><input name="start" type="date" required></div><div><label>Lease end</label><input name="end" type="date" required></div></div><button class="btn ghost big">Save tenant</button></form>`}</div></div>`; }).join('')}
      <button class="btn big" data-act="wzdone">Finish setup 🎉</button>`;
    return `<div class="wizard"><div class="card"><div class="b">${bar}${body}</div></div><div class="skip"><p class="mut">Just exploring?</p><button class="btn ghost big" data-act="wzdemo">Skip and load demo data</button></div></div>`;
  };
  D.startWizard = () => { K.db.setup = false; wz = { step: 1, pid: null }; K.save(); K.go('#/dash'); };
  K.acts.wizard = D.startWizard;
  K.acts.wzdemo = () => { K.loadDemo(); K.toast('Demo data loaded'); K.go('#/dash/home'); };
  K.acts.wznext = () => { wz.step = 3; K.rerender(); };
  K.acts.wzdone = () => { K.db.setup = true; K.ensureBills(); K.applyLateFees(); K.save(); wz = { step: 1, pid: null }; K.toast('All set! This is your home screen.'); K.go('#/dash/home'); };
  K.forms.wz1 = d => { const n = K.db.props.length; const img = 'img/b-' + ({ Duplex: 'duplex', Triplex: 'triplex', Fourplex: 'fourplex' }[d.type] || 'unit') + '-' + (n % 6) + '.svg'; const p = { id: K.uid('p'), name: d.name, addr: d.addr, hood: d.hood, type: d.type, img }; K.db.props.push(p); wz = { step: 2, pid: p.id }; K.save(); K.rerender(); };
  K.forms.wz2 = d => { const p = K.prop(wz.pid), k = (K.db.props.indexOf(p) % 5) + 1; K.db.units.push({ id: K.uid('u'), pid: p.id, label: d.label, beds: +d.beds, baths: +d.baths, sqft: 0, rent: +d.rent, deposit: +d.rent, status: 'vacant', avail: K.todayIso(), photos: [p.img, `img/p${k}-i1.svg`, `img/p${k}-i2.svg`, `img/p${k}-i3.svg`], desc: `${K.bed(+d.beds)} home in ${p.hood}, Kansas City.`, amenities: [], tid: null }); K.save(); K.toast('Unit added'); K.rerender(); };
  K.forms.wz3 = (d, f) => { const u = K.unit(f.dataset.uid), id = K.uid('t'), c = d.contact || ''; K.db.tenants.push({ id, uid: u.id, name: d.name, email: c.includes('@') ? c : '', phone: c.includes('@') ? '' : c, start: d.start, end: d.end }); K.db.leases.push({ id: K.uid('ls'), tid: id, uid: u.id, start: d.start, end: d.end, rent: u.rent, deposit: u.deposit, status: 'active', signedLandlord: null, signedTenant: null, clauses: [], uploaded: true }); Object.assign(u, { status: 'leased', tid: id, avail: null }); K.save(); K.toast('Tenant saved'); K.rerender(); };

  // ---------- UNITS ----------
  D.pages.units = () => {
    const units = D.units(); if (!units.length) return K.empty('🏢', 'No units yet', 'Add a property and its units to see who lives where.', '<button class="btn" data-act="wizard">Add a property</button>');
    const st = units.map(K.unitState), c = k => st.filter(x => x === k).length, occ = Math.round((c('leased') + c('ending')) / units.length * 100);
    return `<div class="phead"><h1>Units</h1><button class="btn ghost" data-act="wizard">+ Add property</button></div>
      ${c('ending') ? `<div class="alert gentle"><span>📅 ${c('ending')} lease${c('ending') > 1 ? 's end' : ' ends'} within 60 days. Now is a good time to talk renewals.</span><a class="btn sm ghost" href="#/dash/leases">Renewals</a></div>` : ''}
      <div class="kpis"><div class="kpi"><div class="lbl">Rented ${K.tip('Someone lives here and the lease has more than 60 days left.')}</div><div class="v">${c('leased')}</div></div><div class="kpi"><div class="lbl">Ending soon ${K.tip('Lease ends in 60 days or less.')}</div><div class="v">${c('ending')}</div></div><div class="kpi"><div class="lbl">Empty ${K.tip('No tenant. Earning $0.')}</div><div class="v">${c('vacant')}</div></div><div class="kpi"><div class="lbl">How full ${K.tip('Rented units divided by all units. Pros call this "occupancy rate".')}</div><div class="v">${occ}%</div></div></div>
      <p class="legend"><i class="sw leased"></i>Rented <i class="sw ending"></i>Ending soon <i class="sw vacant"></i>Empty</p>
      ${K.db.props.filter(p => K.inScope(p.id)).map(p => `<div class="card mb"><div class="b"><div class="phead"><h3>${e(p.name)} <span class="mut">${e(p.hood)} · ${e(p.type || '')}</span></h3></div><div class="unitmap">${K.db.units.filter(u => u.pid === p.id).map(u => { const s = K.unitState(u), t = K.tenant(u.tid); return `<a class="u ${s}" href="${t ? '#/dash/tenants/' + t.id : '#/dash/market'}">${e(u.label)}<small>${s === 'vacant' ? 'Empty' : e(t.name.split(' ')[0])}</small><small>${K.money(u.rent)}</small>${s === 'ending' ? `<small>Ends in ${K.days(t.end)}d</small>` : ''}</a>`; }).join('')}</div></div></div>`).join('')}`;
  };

  // ---------- TENANTS ----------
  D.pages.tenants = ([id]) => {
    const ts = D.tenants(); if (!ts.length) return K.empty('👥', 'No tenants yet', 'Add tenants and lease dates so KeyNest can remind you before leases end.', '<button class="btn" data-act="wizard">Add tenants</button>');
    if (id) {
      const t = K.tenant(id); if (!t) return D.pages.tenants([]);
      const u = K.unit(t.uid), pays = K.db.payments.filter(p => p.tid === id).slice().sort((a, b) => b.due.localeCompare(a.due)), ls = K.db.leases.filter(l => l.tid === id), th = K.db.threads.find(x => x.tid === id);
      return `<p><a href="#/dash/tenants">← All tenants</a></p><div class="phead"><h1>${e(t.name)}</h1><div class="row"><a class="btn ghost" href="#/dash/messages/${th ? th.id : 'new-' + id}">Message</a><a class="btn ghost" href="#/dash/rent?t=${id}">Record payment</a></div></div><p class="mut">${e(K.prop(u.pid).name)}, Unit ${e(u.label)} · ${K.money(u.rent)}/mo</p>
        <div class="kpis"><div class="kpi"><div class="lbl">Lease start</div><div class="v sm">${K.fmt(t.start)}</div></div><div class="kpi"><div class="lbl">Lease end ${K.tip('We remind you 60 days before this date.')}</div><div class="v sm">${K.fmt(t.end)}</div></div><div class="kpi"><div class="lbl">Email</div><div class="v sm">${t.email ? `<a href="mailto:${e(t.email)}">${e(t.email)}</a>` : 'Not added'}</div></div><div class="kpi"><div class="lbl">Phone</div><div class="v sm">${t.phone ? `<a href="tel:${e(t.phone)}">${e(t.phone)}</a>` : 'Not added'}</div></div></div>
        <h3>Lease files</h3><div class="card"><div class="b">${ls.map(l => `<div class="file">📄 Lease ${K.fmt(l.start)} to ${K.fmt(l.end)} <span class="pill ${l.status === 'active' ? 'green' : 'amber'}">${l.status}</span> <a href="#/dash/leases/${l.id}">Open</a></div>`).join('') || '<p class="mut">No lease on file.</p>'}${K.db.docs.filter(d => d.tid === id).map(d => `<div class="file">📎 ${e(d.name)}</div>`).join('')}</div></div>
        <h3>Payment history</h3><div class="tbl"><table><thead><tr><th>Month</th><th>Billed</th><th>Paid</th><th>Status</th><th></th></tr></thead><tbody>${pays.map(p => `<tr><td>${K.mon(p.due)}</td><td>${K.money(K.billTotal(p))}</td><td>${K.money(K.paidAmt(p))}</td><td>${K.statusPill(K.payStatus(p))}</td><td>${K.paidAmt(p) ? `<a href="#/dash/receipt/${p.id}">Receipt</a>` : ''}</td></tr>`).join('') || '<tr><td colspan="5">No payments yet</td></tr>'}</tbody></table></div>`;
    }
    return `<h1>Tenants</h1><div class="tbl"><table><thead><tr><th>Name</th><th>Home</th><th>Lease ends</th><th>This month</th></tr></thead><tbody>${ts.map(t => { const u = K.unit(t.uid), d = K.days(t.end), cur = K.db.payments.find(p => p.tid === t.id && p.due.slice(0, 7) === K.todayIso().slice(0, 7)); return `<tr data-href="#/dash/tenants/${t.id}" class="rowlink"><td><a href="#/dash/tenants/${t.id}">${e(t.name)}</a></td><td>${e(K.prop(u.pid).name)} ${e(u.label)}</td><td>${K.fmt(t.end)} ${d <= 60 ? '<span class="pill amber">Soon</span>' : ''}</td><td>${cur ? K.statusPill(K.payStatus(cur)) : '-'}</td></tr>`; }).join('')}</tbody></table></div>`;
  };

  // ---------- LEADS + SCREENING ----------
  const scrItems = [['id', 'Photo ID matches the name'], ['income', 'Income is about 3x the rent'], ['refs', 'Called past landlord references'], ['bg', 'Background check (demo, not run)'], ['credit', 'Credit check (demo, not run)']];
  D.pages.leads = () => {
    const ls = D.scoped(K.db.leads); if (!ls.length) return `<h1>Leads</h1>` + K.empty('📬', 'No leads yet', 'When renters ask a question, book a showing, or apply, it lands here.', '<a class="btn" href="#/dash/market">Advertise a unit</a>');
    const tl = { stay: ['Stay question', 'blue'], booking: ['Stay request', 'green'], inquiry: ['Question', 'blue'], showing: ['Showing', 'amber'], application: ['Application', 'green'] };
    return `<h1>Leads ${K.tip('People interested in renting from you. The first landlord to reply usually wins the renter.')}</h1><div class="card">${ls.slice().reverse().map(l => { const u = K.unit(l.uid), sc = l.screen; return `<div class="lead"><div class="grow"><span class="pill ${tl[l.type][1]}">${tl[l.type][0]}</span> <b>${e(l.name)}</b><div class="mut">${e(K.prop(u.pid).name || '')} ${e(u.label || '')} · <a href="mailto:${e(l.email)}">${e(l.email)}</a> ${e(l.phone || '')}</div>
      ${l.slot ? `<div>🗓 ${e(l.slot)}</div>` : ''}${l.checkIn ? `<div>🛋 ${K.fmt(l.checkIn)} to ${K.fmt(l.checkOut)} (${l.nights} nights) <a href="#/dash/stays/requests">Manage</a></div>` : ''}${l.msg ? `<div class="quote">“${e(l.msg)}”</div>` : ''}
      ${l.type === 'application' ? `<div>Income ${l.income ? K.money(l.income) + '/yr' : 'not given'}${l.income && u.rent ? ` (${(l.income / 12 / u.rent).toFixed(1)}x rent ${K.tip('Monthly income divided by rent. Many landlords look for about 3x.')})` : ''} · ${e(l.employer || 'Employer not given')} · Move-in ${K.fmt(l.moveIn) || 'flexible'}</div>
        <details class="screen"><summary>Screening checklist (${scItems(sc)}/5) ${K.tip('A to-do list to keep screening fair and consistent. This preview does not run real checks. Apply the same rules to everyone and follow fair housing laws.')}</summary>${scrItems.map(([k, t]) => `<label class="chk"><input type="checkbox" data-change="screen" data-lead="${l.id}" data-k="${k}" ${sc && sc[k] ? 'checked' : ''}> ${t}</label>`).join('')}</details>` : ''}
      <div class="fine">Received ${K.fmt(l.created)}</div></div>
      <select aria-label="Lead status" data-change="leadstatus" data-lead="${l.id}">${[['new', 'New'], ['contacted', 'Replied'], ['scheduled', 'Showing set'], ['approved', 'Approved'], ['closed', 'Closed']].map(([s, t]) => `<option value="${s}" ${l.status === s ? 'selected' : ''}>${t}</option>`).join('')}</select></div>`; }).join('')}</div>`;
  };
  const scItems = sc => sc ? Object.values(sc).filter(Boolean).length : 0;
  K.changes.leadstatus = el => { K.db.leads.find(l => l.id === el.dataset.lead).status = el.value; K.save(); K.toast('Lead updated'); };
  K.changes.screen = el => { const l = K.db.leads.find(x => x.id === el.dataset.lead); l.screen = l.screen || {}; l.screen[el.dataset.k] = el.checked; K.save(); K.rerender(); };

  // ---------- REPAIRS ----------
  D.pages.repairs = () => {
    const cols = [['new', 'New'], ['progress', 'Being fixed'], ['done', 'Fixed']], pc = { High: ['red', 'Urgent'], Medium: ['amber', 'Soon'], Low: ['green', 'Can wait'] }, tk = D.scoped(K.db.tickets);
    if (!tk.length) return `<h1>Repairs</h1>` + K.empty('🔧', 'No repair requests', 'Tenants send repairs from their login, with photos. You can also add one yourself.', '<a class="btn" href="#/tenant">See the tenant view</a>');
    return `<h1>Repairs ${K.tip('Drag a card, or use the buttons, to move it along. Tenants see the status change.')}</h1><div class="kanban">${cols.map(([k, t], ci) => `<div class="col" data-col="${k}"><h3>${t} <span class="mut">${tk.filter(x => x.status === k).length}</span></h3>${tk.filter(x => x.status === k).map(x => { const u = K.unit(x.uid); return `<div class="tk" draggable="true" data-tk="${x.id}"><span class="pill ${pc[x.priority][0]}">${pc[x.priority][1]}</span><b class="blk">${e(x.title)}</b><div class="mut">${e(K.prop(u.pid).name)} ${e(u.label)} · ${K.fmt(x.created)}</div>${x.desc ? `<div class="sm">${e(x.desc)}</div>` : ''}${x.photos.map(p => `<img src="${p}" alt="Repair photo">`).join('')}
      <select aria-label="Assign vendor" data-change="assign" data-tk="${x.id}"><option value="">Pick a vendor…</option>${K.db.vendors.map(h => `<option value="${h.id}" ${x.hid === h.id ? 'selected' : ''}>${e(h.name)} (${e(h.trade)})</option>`).join('')}</select>
      <div class="mv">${ci > 0 ? `<button class="btn ghost sm" data-act="move" data-tk="${x.id}" data-to="${cols[ci - 1][0]}">← ${cols[ci - 1][1]}</button>` : ''}${ci < 2 ? `<button class="btn sm" data-act="move" data-tk="${x.id}" data-to="${cols[ci + 1][0]}">${cols[ci + 1][1]} →</button>` : ''}</div></div>`; }).join('')}</div>`).join('')}</div>`;
  };
  const moveTk = (id, to) => { const k = K.db.tickets.find(x => x.id === id); if (!k) return; k.status = to; K.save(); K.toast(to === 'done' ? 'Marked fixed' : 'Repair moved'); K.rerender(); };
  K.acts.move = el => moveTk(el.dataset.tk, el.dataset.to);
  K.changes.assign = el => { const k = K.db.tickets.find(x => x.id === el.dataset.tk); k.hid = el.value || null; if (k.hid && k.status === 'new') k.status = 'progress'; K.save(); K.toast(k.hid ? 'Vendor assigned' : 'Unassigned'); K.rerender(); };
  document.addEventListener('dragstart', ev => { const k = ev.target.closest && ev.target.closest('[data-tk].tk'); if (k) ev.dataTransfer.setData('text/plain', k.dataset.tk); });
  document.addEventListener('dragover', ev => { const c = ev.target.closest && ev.target.closest('[data-col]'); if (c) { ev.preventDefault(); c.classList.add('over'); } });
  document.addEventListener('dragleave', ev => { const c = ev.target.closest && ev.target.closest('[data-col]'); if (c) c.classList.remove('over'); });
  document.addEventListener('drop', ev => { const c = ev.target.closest && ev.target.closest('[data-col]'); if (!c) return; ev.preventDefault(); moveTk(ev.dataTransfer.getData('text/plain'), c.dataset.col); });

  // ---------- SETTINGS ----------
  D.pages.settings = () => { const s = K.db.settings;
    return `<h1>Settings</h1><form data-form="settings" class="card"><div class="b">
      <h3>Late fees ${K.tip('A fee added automatically when rent is not fully paid after the grace period. Check Missouri and Kansas City rules and your lease before charging.')}</h3>
      <div class="two"><div><label>Rent is due on day</label><input name="dueDay" type="number" min="1" max="28" value="${s.dueDay}"></div><div><label>Grace period (days) ${K.tip('Extra days after the due date before rent counts as late.')}</label><input name="grace" type="number" min="0" max="15" value="${s.grace}"></div></div>
      <div class="two"><div><label>Late fee type</label><select name="lateType"><option value="flat" ${s.lateType === 'flat' ? 'selected' : ''}>Flat amount ($)</option><option value="percent" ${s.lateType === 'percent' ? 'selected' : ''}>Percent of rent (%)</option></select></div><div><label>Late fee amount</label><input name="lateAmount" type="number" min="0" value="${s.lateAmount}"></div></div>
      <h3>Payment methods tenants can use ${K.tip('Placeholders. Real online payments are planned for a later version.')}</h3>
      ${[['bank', 'Bank transfer (ACH)'], ['card', 'Debit or credit card'], ['check', 'Check'], ['cash', 'Cash']].map(([k, t]) => `<label class="chk"><input type="checkbox" name="m_${k}" ${s.methods[k] ? 'checked' : ''}> ${t}</label>`).join('')}
      <h3>Your info (shows on receipts)</h3><div class="two"><div><label>Your name</label><input name="owner" value="${e(s.owner)}"></div><div><label>Business name</label><input name="business" value="${e(s.business)}"></div></div>
      <button class="btn big">Save settings</button></div></form>
      <div class="card mb"><div class="b"><h3>Properties</h3>${K.db.props.map(p => `<div class="file">🏠 ${e(p.name)} <span class="mut">${e(p.addr)}</span></div>`).join('')}<button class="btn ghost big" data-act="wizard">+ Add another property</button></div></div>`; };
  K.forms.settings = d => { const s = K.db.settings; Object.assign(s, { dueDay: +d.dueDay || 1, grace: +d.grace || 0, lateType: d.lateType, lateAmount: +d.lateAmount || 0, owner: d.owner, business: d.business, methods: { bank: !!d.m_bank, card: !!d.m_card, check: !!d.m_check, cash: !!d.m_cash } }); const c = K.applyLateFees(); K.save(); K.toast('Settings saved' + (c ? `. ${c} late fee${c > 1 ? 's' : ''} added` : '')); };
})();
