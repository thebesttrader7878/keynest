// Rentals (#/rentals): real public small multifamily listings + KeyNest demo listings
(function () {
  const K = KN, e = K.esc;
  const ST = { AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming' };
  K.STATES = ST;
  const L = (window.KN_LISTINGS || []).map((l, i) => Object.assign({ i, img: `img/b-${{ Duplex: 'duplex', Triplex: 'triplex', Fourplex: 'fourplex' }[l.type] || 'unit'}-${i % 6}.svg` }, l));
  let map = null;
  K.routes.rentals = (parts, q) => {
    if (parts[0] === 'unit') return unitDetail(parts[1]);
    K.routeTitle = 'Duplex, triplex, and fourplex rentals in all 50 states | KeyNest';
    const view = q.view || 'list', st = q.st || '', s = (q.s || '').toLowerCase(), sort = q.sort || 'rent-asc', type = q.type || '';
    let list = L.filter(l => (!st || l.state === st) && (!type || l.type === type) && (!s || (l.city + ' ' + ST[l.state] + ' ' + l.state + ' ' + l.title).toLowerCase().includes(s)));
    list.sort((a, b) => sort === 'rent-desc' ? b.rent - a.rent : a.rent - b.rent);
    const own = K.db.units.filter(u => u.status === 'vacant');
    const states = [...new Set(L.map(l => l.state))].sort();
    K.after.push(() => { if (view === 'map') drawMap(list); });
    const qs = o => '#/rentals?' + new URLSearchParams(Object.fromEntries(Object.entries(Object.assign({ view, st, s: q.s || '', sort, type }, o)).filter(([, v]) => v))).toString();
    return `<section class="rhero"><h1>Small multifamily rentals across America</h1><p>Duplexes, triplexes, fourplexes, and small apartment buildings in all 50 states. Search by city or state.</p></section>
      ${own.length ? `<section class="own"><h2>Available now from KeyNest landlords <span class="pill green">Kansas City</span></h2><div class="hscroll">${own.map(ownCard).join('')}</div></section>` : ''}
      <form class="filters" data-form="rsearch"><input name="s" value="${e(q.s || '')}" placeholder="City or state, like Omaha or Texas" aria-label="Search city or state">
        <select name="st" aria-label="State"><option value="">All states</option>${states.map(x => `<option value="${x}" ${x === st ? 'selected' : ''}>${ST[x]}</option>`).join('')}</select>
        <select name="type" aria-label="Type"><option value="">All types</option>${['Duplex', 'Triplex', 'Fourplex', 'Small multifamily unit'].map(x => `<option ${x === type ? 'selected' : ''}>${x}</option>`).join('')}</select>
        <select name="sort" aria-label="Sort"><option value="rent-asc" ${sort === 'rent-asc' ? 'selected' : ''}>Rent: low to high</option><option value="rent-desc" ${sort === 'rent-desc' ? 'selected' : ''}>Rent: high to low</option></select>
        <input type="hidden" name="view" value="${view}"><button class="btn">Search</button></form>
      <div class="bar"><span class="mut">${list.length} listing${list.length === 1 ? '' : 's'}${st ? ' in ' + ST[st] : ''}</span><div class="seg"><a class="${view === 'list' ? 'on' : ''}" href="${qs({ view: 'list' })}">List</a><a class="${view === 'map' ? 'on' : ''}" href="${qs({ view: 'map' })}">Map</a></div></div>
      <p class="srcnote">Listing data from Craigslist, checked Oct 29, 2026. Verify availability with the source. Photos are illustrations, not the actual property. KeyNest is not affiliated with these listings.</p>
      ${view === 'map' ? `<div id="map" class="map" aria-label="Map of listings"></div>` : ''}
      ${list.length ? `<div class="grid">${list.map(card).join('')}</div>` : K.empty('🔎', 'No listings match', 'Try a nearby city, or clear the filters.', '<a class="btn ghost" href="#/rentals">Clear filters</a>')}`;
  };
  K.forms.rsearch = d => K.go('#/rentals?' + new URLSearchParams(Object.fromEntries(Object.entries(d).filter(([, v]) => v))).toString());
  function card(l) {
    const facts = [l.beds != null ? K.bed(l.beds) : '', l.baths ? l.baths + ' bath' : '', l.sqft ? l.sqft.toLocaleString() + ' sq ft' : ''].filter(Boolean).join(' · ');
    return `<article class="card listing" id="L${l.i}"><img src="${l.img}" alt="Illustration of a ${e(l.type.toLowerCase())}" loading="lazy" width="640" height="400"><div class="b">
      <div class="price">${K.money(l.rent)}<span class="mut">/mo</span></div><h3>${e(l.title)}</h3>
      <div class="mut">${e(l.street ? l.street + ', ' : '')}${e(l.city)}, ${l.state}</div>${facts ? `<div class="mut">${facts}</div>` : ''}
      <div class="chips"><span class="pill blue">${e(l.type)}</span><span class="pill">${ST[l.state]}</span></div>
      <a class="btn ghost full" href="${e(l.url)}" target="_blank" rel="noopener nofollow">View original listing ↗</a><div class="fine">Source: ${e(l.source)}</div></div></article>`;
  }
  function ownCard(u) {
    const p = K.prop(u.pid);
    return `<a class="card listing mini" href="#/rentals/unit/${u.id}"><img src="${e(u.photos[0])}" alt="${e(p.name)}" loading="lazy"><div class="b"><div class="price">${K.money(u.rent)}<span class="mut">/mo</span></div><b>${e(p.name)} ${e(u.label)}</b><div class="mut">${K.bed(u.beds)} · ${u.baths} bath · ${e(p.hood)}</div><span class="pill green">${K.days(u.avail) <= 0 ? 'Available now' : 'From ' + K.fmt(u.avail)}</span></div></a>`;
  }
  function drawMap(list) {
    if (!window.L) { K.$('#map').innerHTML = '<p class="center mut" style="padding:40px">Map could not load.</p>'; return; }
    if (map) { map.remove(); map = null; }
    map = window.L.map('map', { scrollWheelZoom: false, tap: true }).setView([39.5, -98.35], 4);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    const pts = [];
    list.filter(l => l.lat && l.lon).forEach(l => { pts.push([l.lat, l.lon]); window.L.circleMarker([l.lat, l.lon], { radius: 8, color: '#0f766e', fillColor: '#14b8a6', fillOpacity: .9, weight: 2 }).addTo(map).bindPopup(`<b>${K.money(l.rent)}/mo</b><br>${e(l.title)}<br>${e(l.city)}, ${l.state}<br><a href="${e(l.url)}" target="_blank" rel="noopener nofollow">View original listing</a>`); });
    const p48 = pts.filter(p => p[0] < 50 && p[0] > 24 && p[1] > -126); const fit = p48.length > 1 && p48.length < pts.length && pts.length > 10 ? p48 : pts; if (fit.length > 1) map.fitBounds(fit, { padding: [30, 30], maxZoom: 11 }); else if (pts.length) map.setView(pts[0], 11);
  }
  function unitDetail(id) {
    const u = K.unit(id); if (!u.id) return K.empty('🤷', 'Listing not found', 'It may have been rented.', '<a class="btn" href="#/rentals">See rentals</a>');
    const p = K.prop(u.pid), slots = [];
    for (let i = 1; i <= 5; i++) ['10:00 AM', '1:00 PM', '5:30 PM'].forEach(t => slots.push(K.addDays(K.todayIso(), i) + ' ' + t));
    K.routeTitle = `${K.bed(u.beds)} for rent in ${p.hood}, Kansas City | KeyNest`;
    return `<p><a href="#/rentals">← All rentals</a></p><div class="detail"><div>
      <div class="gallery"><img class="main" id="gMain" src="${e(u.photos[0])}" alt="Main photo"><div class="thumbs">${u.photos.map((s, i) => `<img src="${e(s)}" class="${i ? '' : 'on'}" alt="Photo ${i + 1}" data-act="gal" data-g="${e(s)}">`).join('')}</div></div>
      <h1>${e(p.name)}, Unit ${e(u.label)}</h1><div class="mut">${e(p.addr)} · ${e(p.hood)}, Kansas City, MO</div>
      <div class="price big">${K.money(u.rent)}/mo <span class="pill green">${K.days(u.avail) <= 0 ? 'Available now' : 'Available ' + K.fmt(u.avail)}</span></div>
      <p>${K.bed(u.beds)} · ${u.baths} bath · ${u.sqft} sq ft · Deposit ${K.money(u.deposit || u.rent)}</p><p>${e(u.desc)}</p><div class="chips">${(u.amenities || []).map(a => `<span class="pill">${e(a)}</span>`).join('')}</div>
      <div class="video"><div><div class="play">▶</div><b>Video tour coming soon</b><div class="fine" style="color:#cbd5e1">Landlords can add a walkthrough video here</div></div></div><p class="fine">Demo listing with illustrated photos.</p>
    </div><div class="card sticky"><div class="b">
      <div class="tabs"><button class="on" data-act="ltab" data-tab="showing">Book a showing</button><button data-act="ltab" data-tab="inquiry">Ask</button><button data-act="ltab" data-tab="apply">Apply</button></div>
      <form data-form="lead" id="leadForm" data-uid="${u.id}"><input type="hidden" name="type" value="showing">
        <label>Your name</label><input name="name" required autocomplete="name"><div class="two"><div><label>Email</label><input name="email" type="email" required></div><div><label>Phone</label><input name="phone" type="tel"></div></div>
        <div data-for="showing"><label>Pick a time</label><div class="slots">${slots.map(s => { const [d, ...t] = s.split(' '); return `<button type="button" data-act="slot" data-slot="${s}">${new Date(d + 'T00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}<br>${t.join(' ')}</button>`; }).join('')}</div><input type="hidden" name="slot"></div>
        <div data-for="inquiry" hidden><label>Your question</label><textarea name="msg" rows="3" placeholder="Is parking included?"></textarea></div>
        <div data-for="apply" hidden><div class="two"><div><label>Yearly income</label><input name="income" type="number" min="0"></div><div><label>Move-in date</label><input name="moveIn" type="date"></div></div><label>Employer</label><input name="employer"><label>Current address</label><input name="current"><p class="fine">Preview: no screening or fees. Your info goes to the landlord's inbox.</p></div>
        <button class="btn big">Send to landlord</button></form></div></div></div>`;
  }
  K.acts.gal = el => { K.$('#gMain').src = el.dataset.g; K.$$('.thumbs img').forEach(i => i.classList.toggle('on', i === el)); };
  K.acts.ltab = el => { const f = K.$('#leadForm [name=type]'); if (!f) return; K.$$('.tabs button').forEach(b => b.classList.toggle('on', b === el)); f.value = el.dataset.tab; K.$$('#leadForm [data-for]').forEach(d => d.hidden = d.dataset.for !== el.dataset.tab); };
  K.acts.slot = el => { K.$$('.slots button').forEach(b => b.classList.toggle('on', b === el)); K.$('#leadForm [name=slot]').value = el.dataset.slot; };
  K.forms.lead = (d, f) => {
    if (d.type === 'showing' && !d.slot) return K.toast('Pick a showing time first');
    if (d.type === 'inquiry' && !d.msg.trim()) return K.toast('Type your question first');
    const l = { id: K.uid('l'), type: d.type === 'apply' ? 'application' : d.type, uid: f.dataset.uid, name: d.name, email: d.email, phone: d.phone, status: 'new', created: K.todayIso() };
    if (l.type === 'showing') l.slot = d.slot; if (l.type === 'inquiry') l.msg = d.msg;
    if (l.type === 'application') Object.assign(l, { income: +d.income || 0, employer: d.employer, moveIn: d.moveIn, current: d.current, screen: { id: false, income: false, refs: false, bg: false, credit: false } });
    K.db.leads.push(l); K.save();
    f.innerHTML = K.empty('✅', 'Sent!', l.type === 'showing' ? 'You asked for ' + e(d.slot) + '. The landlord will confirm.' : 'The landlord will get back to you soon.');
    K.toast('Sent to the landlord');
  };
})();
