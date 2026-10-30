// KeyNest Furnished Stays: 30+ night furnished month-to-month marketplace (renter side + owner side).
(function () {
  const K = KN, e = K.esc, MIN = 30, FKEY = 'keynest_favs_v3';
  const S = K.stays = {};
  const svg = (kind, h) => { const c1 = `hsl(${h},35%,92%)`, c2 = `hsl(${h},40%,45%)`, c3 = `hsl(${(h + 40) % 360},55%,60%)`;
    const art = {
      living: `<rect x="0" y="300" width="640" height="120" fill="#c8b59a"/><rect x="380" y="50" width="200" height="160" fill="#bfe3f2"/><line x1="480" y1="50" x2="480" y2="210" stroke="#fff" stroke-width="6"/><rect x="70" y="200" width="280" height="90" rx="18" fill="${c2}"/><rect x="60" y="180" width="300" height="50" rx="20" fill="${c2}" opacity=".85"/><rect x="90" y="210" width="60" height="40" rx="8" fill="${c3}"/><rect x="380" y="270" width="150" height="16" rx="6" fill="#7a5c3e"/><circle cx="560" cy="250" r="26" fill="#3f7d4e"/><rect x="552" y="250" width="16" height="50" fill="#8a5a3b"/><rect x="120" y="70" width="140" height="90" fill="${c3}" opacity=".6"/>`,
      bed: `<rect x="0" y="310" width="640" height="110" fill="#b9a487"/><rect x="140" y="150" width="360" height="70" rx="12" fill="#7a5c3e"/><rect x="120" y="210" width="400" height="90" rx="14" fill="#fff"/><rect x="120" y="240" width="400" height="60" rx="12" fill="${c2}"/><rect x="170" y="190" width="100" height="40" rx="12" fill="#f8f8f8"/><rect x="370" y="190" width="100" height="40" rx="12" fill="#f8f8f8"/><rect x="40" y="230" width="60" height="70" fill="#8a6a4a"/><circle cx="70" cy="215" r="16" fill="${c3}"/><rect x="560" y="60" width="50" height="120" fill="#bfe3f2"/>`,
      kitchen: `<rect x="0" y="320" width="640" height="100" fill="#d9d4cc"/><rect x="40" y="200" width="560" height="120" fill="${c2}"/><rect x="40" y="190" width="560" height="14" fill="#efefef"/><rect x="60" y="60" width="200" height="80" fill="${c2}" opacity=".8"/><rect x="380" y="60" width="200" height="80" fill="${c2}" opacity=".8"/><rect x="290" y="50" width="60" height="110" fill="#bfe3f2"/><circle cx="160" cy="180" r="10" fill="#555"/><rect x="430" y="160" width="40" height="30" fill="${c3}"/><g fill="#fff" opacity=".6"><rect x="80" y="230" width="100" height="70"/><rect x="200" y="230" width="100" height="70"/><rect x="340" y="230" width="100" height="70"/><rect x="460" y="230" width="100" height="70"/></g>`,
      desk: `<rect x="0" y="310" width="640" height="110" fill="#c2ad90"/><rect x="200" y="60" width="240" height="150" fill="#bfe3f2"/><rect x="150" y="230" width="340" height="16" fill="#7a5c3e"/><rect x="170" y="246" width="12" height="70" fill="#7a5c3e"/><rect x="458" y="246" width="12" height="70" fill="#7a5c3e"/><rect x="270" y="170" width="110" height="64" rx="6" fill="#333"/><rect x="278" y="177" width="94" height="50" fill="${c3}"/><rect x="290" y="260" width="70" height="70" rx="10" fill="${c2}"/><circle cx="90" cy="230" r="34" fill="#3f7d4e"/><rect x="80" y="240" width="20" height="70" fill="#8a5a3b"/>`
    }[kind];
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420"><rect width="640" height="420" fill="${c1}"/>${art}</svg>`); };
  S.photos = h => ['living', 'bed', 'kitchen', 'desk'].map(k => svg(k, h));
  const AM = ['Wifi', 'Workspace', 'Full kitchen', 'In-unit laundry', 'Parking', 'Smart TV', 'Linens and towels', 'Central air', 'Gym', 'Balcony'];
  const T = () => K.todayIso(), A = (n) => K.addDays(T(), n);
  S.seed = () => [
    ['crossroads-art-loft', 'Crossroads Art Loft', 'Crossroads', 39.0912, -94.5822, 2450, 1, 1, 0, 120, 'Exposed brick, tall windows, and a desk made for remote work. Walk to First Fridays galleries and coffee.', [0, 1, 2, 3, 4, 5, 6], 'Sunny Nest Rentals', '#0f766e'],
    ['plaza-garden-flat', 'Plaza Garden Flat', 'Country Club Plaza', 39.0397, -94.5935, 2850, 2, 2, 1, 200, 'Quiet two bedroom near the Plaza fountains and trails. Great for traveling nurses near Saint Luke\'s.', [0, 2, 3, 4, 5, 7], 'Fountain City Homes', '#7c3aed'],
    ['westport-studio', 'Westport Cozy Studio', 'Westport', 39.0533, -94.5913, 1650, 0, 1, 1, 0, 'Simple, comfy studio with a queen bed and fast wifi. Pets welcome with a small fee.', [0, 1, 2, 5, 6], 'Sunny Nest Rentals', '#0f766e'],
    ['river-market-loft', 'River Market Loft', 'River Market', 39.1092, -94.5830, 2650, 1, 1, 0, 150, 'Top floor loft steps from the streetcar and the City Market. Includes a reserved parking spot.', [0, 1, 2, 3, 4, 6, 9], 'Riverside Keys', '#c2410c'],
    ['brookside-bungalow', 'Brookside Bungalow', 'Brookside', 39.0118, -94.5928, 3150, 3, 2, 1, 250, 'Whole house with a fenced yard, three bedrooms, and a full kitchen. Ideal for families relocating.', [0, 2, 3, 4, 5, 7, 8], 'Fountain City Homes', '#7c3aed'],
    ['midtown-corner-1br', 'Midtown Corner 1BR', 'Midtown', 39.0616, -94.5866, 1950, 1, 1, 1, 100, 'Bright corner unit with a balcony, near Hyde Park and the main bus line.', [0, 1, 2, 3, 6, 9], 'Riverside Keys', '#c2410c'],
    ['waldo-duplex-suite', 'Waldo Duplex Suite', 'Waldo', 38.9886, -94.5935, 1850, 2, 1, 1, 0, 'Half of a cute duplex near the Trolley Trail. Washer and dryer, driveway parking.', [0, 2, 3, 4, 5], 'Sunny Nest Rentals', '#0f766e'],
    ['crown-center-suite', 'Crown Center Suite', 'Crown Center', 39.0827, -94.5815, 2250, 1, 1, 0, 120, 'Modern one bedroom near Union Station and Children\'s Mercy. On-site gym.', [0, 1, 2, 3, 7, 8], 'Riverside Keys', '#c2410c']
  ].map(([slug, title, hood, lat, lon, rate, beds, baths, pets, petFee, desc, am, brand, color], i) => ({
    id: 'st' + (i + 1), slug, title, hood, lat, lon, rate, beds, baths, pets: !!pets, petFee, deposit: Math.round(rate * .5 / 50) * 50, cleaning: 150, desc,
    amenities: am.map(x => AM[x]), brand, color, photos: S.photos(i * 45), uid: 'fsu' + (i + 1),
    rules: ['No smoking inside', 'Quiet hours 10 PM to 7 AM', pets ? 'Pets OK, ' + (petFee ? '$' + petFee + ' one-time fee' : 'no fee') : 'No pets please', 'No parties or events'],
    blocked: i % 3 === 0 ? [[A(-20), A(25)]] : i % 3 === 1 ? [[A(60), A(120)]] : [], availFrom: A(i % 3 === 0 ? 26 : 2), published: true
  }));
  S.ensure = () => {
    const db = K.db; let ch = false;
    if (!db.stays) { db.stays = S.seed(); db.stayReqs = []; ch = true; }
    db.stayReqs = db.stayReqs || [];
    if (db.setup) {
      if (!db.props.find(p => p.id === 'pfs')) { db.props.push({ id: 'pfs', name: 'Furnished stays', addr: 'Kansas City, MO (demo)', hood: 'Various', img: db.stays[0].photos[0], type: 'Furnished, 30+ nights' }); ch = true; }
      db.stays.forEach(s => { if (!db.units.find(u => u.id === s.uid)) { const cur = s.blocked.find(([a, b]) => a <= T() && b >= T()); let tid = null;
          if (cur) { tid = 'fst' + s.id; if (!db.tenants.find(t => t.id === tid)) db.tenants.push({ id: tid, uid: s.uid, name: 'Demo Guest ' + s.id.slice(2), email: 'guest' + s.id.slice(2) + '@example.com', phone: '', start: cur[0], end: cur[1], furnished: true }); }
          db.units.push({ id: s.uid, pid: 'pfs', label: s.title, beds: s.beds, baths: s.baths, rent: s.rate, deposit: s.deposit, status: cur ? 'leased' : 'vacant', tid, photos: [], amenities: s.amenities, furnished: true }); ch = true; } });
    }
    if (ch) K.save();
  };
  S.get = slug => (K.db.stays || []).find(s => s.slug === slug || s.id === slug);
  S.nights = (a, b) => (a && b) ? Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 864e5) : 0;
  S.overlap = (s, a, b) => s.blocked.some(([x, y]) => a < y && b > x);
  S.check = (s, a, b) => { const n = S.nights(a, b);
    if (!a || !b) return 'Pick a move-in and move-out date.';
    if (n <= 0) return 'Move-out has to be after move-in.';
    if (n < MIN) return `Stays must be at least ${MIN} nights. You picked ${n} night${n === 1 ? '' : 's'}. Try a move-out on or after ${K.fmt(K.addDays(a, MIN))}.`;
    if (a < s.availFrom) return `This place is open from ${K.fmt(s.availFrom)}.`;
    if (S.overlap(s, a, b)) return 'Some of those dates are already booked. Check the calendar.';
    return ''; };
  S.cost = (s, n, pet) => { const months = n / 30, rent = Math.round(s.rate * months); return { rent, deposit: s.deposit, cleaning: s.cleaning, pet: pet && s.pets ? s.petFee : 0, total: rent + s.deposit + s.cleaning + (pet && s.pets ? s.petFee : 0) }; };
  S.favs = () => { try { return JSON.parse(localStorage.getItem(FKEY)) || []; } catch (x) { return []; } };
  K.acts.fav = el => { const f = S.favs(), id = el.dataset.id, i = f.indexOf(id); i < 0 ? f.push(id) : f.splice(i, 1); localStorage.setItem(FKEY, JSON.stringify(f)); K.toast(i < 0 ? 'Saved to favorites' : 'Removed from favorites'); K.rerender(); };
  const note = `<div class="kcnote">📌 <b>30-night minimum.</b> Every stay here is 30 nights or more. Kansas City, MO treats stays of 30+ consecutive days as not short-term rentals, so these are month-to-month furnished homes.</div>`;
  const heart = s => { const on = S.favs().includes(s.id); return `<button class="heart ${on ? 'on' : ''}" data-act="fav" data-id="${s.id}" aria-label="${on ? 'Remove from' : 'Save to'} favorites">${on ? '♥' : '♡'}</button>`; };
  const card = s => `<div class="card listing stay" data-testid="staycard"><div class="pwrap"><a href="#/stays/${s.slug}"><img src="${s.photos[0]}" alt="${e(s.title)} living room"></a>${heart(s)}</div><a class="b" href="#/stays/${s.slug}"><div class="price">${K.money(s.rate)}<span class="mut">/month</span></div><b>${e(s.title)}</b><div class="mut">${K.bed(s.beds)} · ${s.baths} bath · ${e(s.hood)}</div><div class="chips"><span class="pill green">Furnished</span>${s.pets ? '<span class="pill blue">Pet friendly</span>' : ''}<span class="pill">30+ nights</span></div></a></div>`;

  // ---------- RENTER: browse ----------
  K.routes.stays = (parts, q) => {
    S.ensure();
    if (parts[0]) return S.detail(S.get(parts[0]), q);
    K.routeTitle = 'Furnished monthly stays in Kansas City | KeyNest';
    const hoods = [...new Set(K.db.stays.map(s => s.hood))].sort();
    let L = K.db.stays.filter(s => s.published);
    if (q.loc) L = L.filter(s => (s.hood + ' ' + s.title).toLowerCase().includes(q.loc.toLowerCase()));
    if (q.max) L = L.filter(s => s.rate <= +q.max);
    if (q.beds) L = L.filter(s => s.beds >= +q.beds);
    if (q.pets) L = L.filter(s => s.pets);
    if (q.am) q.am.split(',').forEach(a => L = L.filter(s => s.amenities.includes(a)));
    if (q.in && q.out && S.nights(q.in, q.out) >= MIN) L = L.filter(s => q.in >= s.availFrom && !S.overlap(s, q.in, q.out));
    const view = q.view || 'list', ams = (q.am || '').split(',').filter(Boolean);
    const qs = o => '#/stays?' + new URLSearchParams(Object.fromEntries(Object.entries(Object.assign({}, q, o)).filter(([, v]) => v))).toString();
    const short = q.in && q.out && S.nights(q.in, q.out) < MIN;
    if (view === 'map') K.after.push(() => S.map(L));
    return `<section class="wrap stays"><div class="shero"><h1>Furnished homes for a month or more</h1><p class="mut">Move in with just a suitcase. Monthly rent, real kitchens, fast wifi. Kansas City only, for now.</p></div>${note}
      <form class="filters sfilters" data-form="stayfilter">
        <input name="loc" placeholder="Neighborhood (try Westport)" value="${e(q.loc || '')}" list="hoods" aria-label="Location"><datalist id="hoods">${hoods.map(h => `<option value="${e(h)}">`).join('')}</datalist>
        <label class="dl">Move in<input type="date" name="in" value="${e(q.in || '')}"></label><label class="dl">Move out<input type="date" name="out" value="${e(q.out || '')}"></label>
        <select name="max" aria-label="Max monthly price"><option value="">Any price</option>${[1800, 2200, 2600, 3000, 3500].map(v => `<option value="${v}" ${q.max == v ? 'selected' : ''}>Up to ${K.money(v)}/mo</option>`).join('')}</select>
        <select name="beds" aria-label="Bedrooms"><option value="">Any beds</option>${[1, 2, 3].map(v => `<option value="${v}" ${q.beds == v ? 'selected' : ''}>${v}+ bed</option>`).join('')}</select>
        <label class="chk"><input type="checkbox" name="pets" value="1" ${q.pets ? 'checked' : ''}> 🐾 Pet friendly</label>
        <button class="btn">Search</button></form>
      <div class="chips amchips">${['Workspace', 'In-unit laundry', 'Parking', 'Gym', 'Balcony'].map(a => { const on = ams.includes(a); return `<a class="pill ${on ? 'green' : ''}" href="${qs({ am: (on ? ams.filter(x => x !== a) : ams.concat(a)).join(',') })}">${on ? '✓ ' : ''}${a}</a>`; }).join('')}</div>
      ${short ? `<div class="alert"><span>⚠️ Those dates are ${S.nights(q.in, q.out)} nights. Stays here need ${MIN}+ nights, so we are showing all places.</span></div>` : ''}
      <div class="phead"><p class="mut"><b>${L.length}</b> furnished place${L.length === 1 ? '' : 's'}</p><div class="seg"><a href="${qs({ view: 'list' })}" class="${view === 'list' ? 'on' : ''}">☰ List</a><a href="${qs({ view: 'map' })}" class="${view === 'map' ? 'on' : ''}" data-testid="mapview">🗺 Map</a></div></div>
      ${view === 'map' ? `<div id="smap" class="map smap">${S.staticMap(L)}</div>` : ''}
      ${L.length ? `<div class="grid">${L.map(card).join('')}</div>` : K.empty('🔍', 'No matches', 'Try fewer filters or other dates.', '<a class="btn" href="#/stays">Clear filters</a>')}</section>`;
  };
  K.forms.stayfilter = d => K.go('#/stays?' + new URLSearchParams(Object.fromEntries(Object.entries(d).filter(([, v]) => v))).toString());
  // Static fallback map (shows if Leaflet or tiles are unavailable). Leaflet replaces it when it loads.
  S.staticMap = L => { const la = [38.98, 39.115], lo = [-94.60, -94.575]; return `<div class="fallmap">${L.map(s => `<a class="pin" style="left:${(s.lon - lo[0]) / (lo[1] - lo[0]) * 86 + 6}%;top:${(la[1] - s.lat) / (la[1] - la[0]) * 82 + 6}%" href="#/stays/${s.slug}">${K.money(s.rate)}</a>`).join('')}<span class="fine fmnote">Simple map view</span></div>`; };
  S.map = L => { if (!window.L || !document.getElementById('smap')) return; const el = document.getElementById('smap'); el.innerHTML = '';
    const m = window.L.map(el, { scrollWheelZoom: false }).setView([39.05, -94.59], 12);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(m);
    const pts = L.map(s => { window.L.marker([s.lat, s.lon], { icon: window.L.divIcon({ className: 'pricepin', html: `<span>${K.money(s.rate)}</span>`, iconSize: [70, 28] }) }).addTo(m).bindPopup(`<b>${e(s.title)}</b><br>${K.money(s.rate)}/mo · ${e(s.hood)}<br><a href="#/stays/${s.slug}">See this place</a>`); return [s.lat, s.lon]; });
    setTimeout(() => { m.invalidateSize(); m.setView([39.055, -94.588], 12); }, 60); };

  // ---------- RENTER/OWNER: detail + branded landing page ----------
  S.cal = s => { const out = []; const t = K.today(); for (let k = 0; k < 3; k++) { const d0 = new Date(t.getFullYear(), t.getMonth() + k, 1), dim = new Date(d0.getFullYear(), d0.getMonth() + 1, 0).getDate(); let cells = '<i></i>'.repeat(d0.getDay());
      for (let d = 1; d <= dim; d++) { const iso = K.iso(new Date(d0.getFullYear(), d0.getMonth(), d)), past = iso < T(), bk = iso < s.availFrom || s.blocked.some(([a, b]) => iso >= a && iso < b); cells += `<span class="${past ? 'past' : bk ? 'bk' : 'ok'}">${d}</span>`; }
      out.push(`<div class="mcal"><b>${d0.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</b><div class="dgrid">${'SMTWTFS'.split('').map(x => `<em>${x}</em>`).join('')}${cells}</div></div>`); }
    return `<div class="cals">${out.join('')}</div><p class="legend"><i class="sw ok"></i>Open <i class="sw bk"></i>Booked</p>`; };
  S.detail = (s, q) => {
    if (!s) return K.empty('🧭', 'Listing not found', 'This stay may have been removed.', '<a class="btn" href="#/stays">See all stays</a>');
    K.routeTitle = `${s.title} | Furnished monthly stay in ${s.hood}, KC`;
    const mi = q.in || (s.availFrom > T() ? s.availFrom : A(3)), mo = q.out || K.addDays(mi, 60), owner = K.sess().landlord && K.sess().mode !== 'renter';
    return `<section class="wrap sdetail" style="--brand:${e(s.color)}"><div class="brandbar"><span class="bmark">${e(s.brand[0])}</span><b>${e(s.brand)}</b><span class="mut">· Furnished stays in Kansas City</span>${owner ? `<a class="btn sm ghost" href="#/dash/stays/edit/${s.id}">Edit listing</a>` : ''}</div>
      <p class="fine"><a href="#/stays">← All furnished stays</a></p><div class="phead"><h1>${e(s.title)}</h1><div class="row">${heart(s)}<button class="btn sm ghost" data-act="sharestay" data-slug="${s.slug}">🔗 Share</button></div></div>
      <p class="mut">${e(s.hood)}, Kansas City · ${K.bed(s.beds)} · ${s.baths} bath · Furnished${s.pets ? ' · Pet friendly' : ''}</p>
      <div class="sgal"><img class="main" src="${s.photos[0]}" alt="Main photo" data-testid="mainphoto">${s.photos.slice(1, 5).map((p, i) => `<img src="${p}" alt="Photo ${i + 2}" data-act="galswap">`).join('')}</div>
      <div class="dcols"><div class="grow">
        <h2>About this place</h2><p>${e(s.desc)}</p>
        <h2>What is included</h2><ul class="amlist">${s.amenities.map(a => `<li>✓ ${e(a)}</li>`).join('')}</ul>
        <h2>Availability</h2>${S.cal(s)}
        <h2>House rules</h2><ul>${s.rules.map(r => `<li>${e(r)}</li>`).join('')}</ul>
        ${note}
        <h2>Ask a question</h2><form data-form="stayask" data-id="${s.id}" class="card"><div class="b"><label>Your name</label><input name="name" required><label>Email</label><input name="email" type="email" required><label>Message</label><textarea name="msg" required placeholder="Hi! Is parking included? I start a job nearby in March."></textarea><button class="btn">Send question</button></div></form>
      </div><aside class="bookbox card" id="book"><div class="b"><div class="price">${K.money(s.rate)}<span class="mut">/month</span></div><p class="fine">Deposit ${K.money(s.deposit)} · Cleaning ${K.money(s.cleaning)}${s.pets ? ' · Pet fee ' + K.money(s.petFee) : ''}</p>
        <form data-form="staybook" data-id="${s.id}"><div class="two"><label>Move in<input type="date" name="in" value="${mi}" data-input="staycalc" required></label><label>Move out<input type="date" name="out" value="${mo}" data-input="staycalc" required></label></div>
        <div id="bmsg">${S.quote(s, mi, mo)}</div>
        <label>Your name</label><input name="name" required><label>Email</label><input name="email" type="email" required>${s.pets ? '<label class="chk"><input type="checkbox" name="pet" value="1"> Bringing a pet</label>' : ''}
        <button class="btn big" style="background:var(--brand)" data-testid="reqbook">Request to book</button><p class="fine center">You will not be charged. The owner replies within 24 hours.</p></form></div></aside></div></section>
      <div class="stickybook"><div><b>${K.money(s.rate)}</b>/mo<div class="fine">30+ nights</div></div><a class="btn" href="#book" style="background:var(--brand,#0f766e)">Request to book</a></div>`;
  };
  S.quote = (s, a, b) => { const err = S.check(s, a, b), n = S.nights(a, b); if (err) return `<div class="berr" role="alert" data-testid="bookerr">⛔ ${e(err)}</div>`; const c = S.cost(s, n); return `<div class="bq"><div>${n} nights (about ${(n / 30).toFixed(1)} months)<span>${K.money(c.rent)}</span></div><div>Refundable deposit<span>${K.money(c.deposit)}</span></div><div>Cleaning<span>${K.money(c.cleaning)}</span></div><div class="tot">Due over the stay<span>${K.money(c.total)}</span></div></div>`; };
  K.changes.staycalc = el => { const f = el.form, s = S.get(f.dataset.id); document.getElementById('bmsg').innerHTML = S.quote(s, f.in.value, f.out.value); };
  K.acts.galswap = el => { const m = el.parentNode.querySelector('.main'), t = m.src; m.src = el.src; el.src = t; };
  K.acts.sharestay = el => { const u = location.href.split('#')[0] + '#/stays/' + el.dataset.slug; (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => K.toast('Link copied'), () => prompt('Copy this link', u)); };
  const addLead = (s, l) => { K.db.leads.push(Object.assign({ id: K.uid('l'), uid: s.uid, status: 'new', created: T() }, l)); };
  K.forms.stayask = (d, f) => { const s = S.get(f.dataset.id); addLead(s, { type: 'stay', name: d.name, email: d.email, msg: d.msg, stay: s.id }); K.save(); f.reset(); K.toast('Question sent. The owner usually replies within a day.'); };
  K.forms.staybook = (d, f) => { const s = S.get(f.dataset.id), err = S.check(s, d.in, d.out);
    if (err) { document.getElementById('bmsg').innerHTML = S.quote(s, d.in, d.out); return K.toast('Stays need 30+ nights'); }
    const n = S.nights(d.in, d.out), id = K.uid('sr');
    K.db.stayReqs.push({ id, stay: s.id, name: d.name, email: d.email, checkIn: d.in, checkOut: d.out, nights: n, pet: !!d.pet, status: 'pending', created: T(), total: S.cost(s, n, d.pet).total });
    addLead(s, { type: 'booking', name: d.name, email: d.email, checkIn: d.in, checkOut: d.out, nights: n, req: id, msg: `Request to book ${n} nights.` });
    K.save(); K.go('#/stays/' + s.slug); setTimeout(() => K.toast('Request sent! You will hear back within 24 hours.'), 50); };

  // ---------- RENTER: favorites ----------
  K.routes.saved = () => { S.ensure(); const f = S.favs(), L = K.db.stays.filter(s => f.includes(s.id));
    return `<section class="wrap"><h1>Saved stays</h1>${L.length ? `<div class="grid">${L.map(card).join('')}</div>` : K.empty('♡', 'Nothing saved yet', 'Tap the heart on any place to save it here.', '<a class="btn" href="#/stays">Browse stays</a>')}</section>`; };

  // ---------- OWNER: dashboard pages ----------
  const D = K.dash;
  D.pages.stays = ([sub, id]) => { S.ensure();
    if (sub === 'edit' || sub === 'new') return S.editor(sub === 'new' ? null : K.db.stays.find(s => s.id === id));
    const R = K.db.stayReqs, pend = R.filter(r => r.status === 'pending');
    const tab = sub === 'requests' ? 'requests' : 'listings';
    const tabs = `<div class="seg mb"><a href="#/dash/stays" class="${tab === 'listings' ? 'on' : ''}">My listings</a><a href="#/dash/stays/requests" class="${tab === 'requests' ? 'on' : ''}">Requests${pend.length ? ` <span class="count">${pend.length}</span>` : ''}</a></div>`;
    const booked = K.db.stays.filter(s => K.unit(s.uid).status === 'leased').length;
    const head = `<div class="phead"><h1>Furnished stays ${K.tip('Furnished homes rented by the month. 30 nights minimum, so they are not short-term rentals in KCMO.')}</h1><a class="btn" href="#/dash/stays/new">+ New listing</a></div>
      <div class="kpis"><div class="kpi"><div class="lbl">Listings</div><div class="v">${K.db.stays.length}</div></div><div class="kpi"><div class="lbl">Booked now</div><div class="v">${booked}</div></div><div class="kpi"><div class="lbl">New requests</div><div class="v">${pend.length}</div></div><div class="kpi"><div class="lbl">Questions</div><div class="v">${K.db.leads.filter(l => l.type === 'stay' && l.status === 'new').length}</div></div></div>${tabs}`;
    if (tab === 'requests') return head + (R.length ? `<div class="card">${R.slice().reverse().map(r => { const s = K.db.stays.find(x => x.id === r.stay); return `<div class="lead" data-testid="reqrow"><div class="grow"><span class="pill ${r.status === 'approved' ? 'green' : r.status === 'declined' ? 'red' : 'amber'}">${r.status === 'pending' ? 'Waiting on you' : r.status}</span> <b>${e(r.name)}</b><div class="mut">${e(s.title)} · ${K.fmt(r.checkIn)} to ${K.fmt(r.checkOut)} · ${r.nights} nights · ${K.money(r.total)}</div><div class="fine"><a href="mailto:${e(r.email)}">${e(r.email)}</a>${r.pet ? ' · bringing a pet' : ''}</div></div>${r.status === 'pending' ? `<div class="row"><button class="btn sm" data-act="reqok" data-id="${r.id}">Approve</button><button class="btn sm ghost" data-act="reqno" data-id="${r.id}">Decline</button></div>` : ''}</div>`; }).join('')}</div>` : K.empty('📬', 'No requests yet', 'Share your listing link to get your first booking.', ''));
    return head + `<div class="grid">${K.db.stays.map(s => `<div class="card"><img src="${s.photos[0]}" alt="" class="thumbimg"><div class="b"><b>${e(s.title)}</b><div class="mut">${K.money(s.rate)}/mo · ${e(s.hood)} · ${K.unit(s.uid).status === 'leased' ? '<span class="pill green">Booked</span>' : '<span class="pill">Open</span>'}${s.published ? '' : ' <span class="pill red">Hidden</span>'}</div><div class="fine slug">/stays/${e(s.slug)}</div><div class="row mt"><a class="btn sm" href="#/dash/stays/edit/${s.id}">Edit</a><a class="btn sm ghost" href="#/stays/${s.slug}">View page</a><button class="btn sm ghost" data-act="sharestay" data-slug="${s.slug}">Copy link</button></div></div></div>`).join('')}</div>`;
  };
  S.editor = s => { const n = !s; s = s || { id: '', title: '', slug: '', hood: 'Westport', rate: 2000, deposit: 1000, cleaning: 150, beds: 1, baths: 1, pets: false, petFee: 0, desc: '', amenities: ['Wifi', 'Full kitchen'], rules: ['No smoking inside', 'Quiet hours 10 PM to 7 AM'], brand: K.db.settings.business || 'My Rentals', color: '#0f766e', availFrom: T(), blocked: [], published: true, photos: S.photos(200) };
    return `<p><a href="#/dash/stays">← My listings</a></p><h1>${n ? 'New furnished listing' : 'Edit ' + e(s.title)}</h1><p class="mut">Fill this in like a text message. You can change anything later.</p>
      <form data-form="staysave" data-id="${s.id}" class="card"><div class="b">
      <h3>1. The basics</h3><label>Listing name</label><input name="title" required value="${e(s.title)}" placeholder="Sunny Westport 1BR">
      <label>Your link ${K.tip('This is the web address you share. Letters, numbers, and dashes only.')}</label><div class="slugrow"><span class="fine">…/#/stays/</span><input name="slug" value="${e(s.slug)}" placeholder="sunny-westport-1br" pattern="[a-z0-9-]*"></div>
      <label>Neighborhood</label><input name="hood" value="${e(s.hood)}"><div class="two"><label>Bedrooms (0 = studio)<input type="number" name="beds" min="0" value="${s.beds}"></label><label>Bathrooms<input type="number" name="baths" min="1" value="${s.baths}"></label></div>
      <label>Description</label><textarea name="desc">${e(s.desc)}</textarea>
      <h3>2. Price ${K.tip('Monthly rent. Renters see a total before they request.')}</h3><div class="two"><label>Monthly rate ($)<input type="number" name="rate" min="1" required value="${s.rate}"></label><label>Deposit ($)<input type="number" name="deposit" min="0" value="${s.deposit}"></label></div><div class="two"><label>Cleaning fee ($)<input type="number" name="cleaning" min="0" value="${s.cleaning}"></label><label>Pet fee ($)<input type="number" name="petFee" min="0" value="${s.petFee}"></label></div>
      <label class="chk"><input type="checkbox" name="pets" value="1" ${s.pets ? 'checked' : ''}> Pets allowed</label>
      <h3>3. What is included</h3><div class="amgrid">${AM.map(a => `<label class="chk"><input type="checkbox" name="am_${a}" value="1" ${s.amenities.includes(a) ? 'checked' : ''}> ${a}</label>`).join('')}</div>
      <h3>4. Availability</h3><label>Open for move-in from</label><input type="date" name="availFrom" value="${s.availFrom}"><p class="fine">Minimum stay is always 30 nights. This keeps you outside KCMO short-term rental rules.</p>
      <label>Block dates (already booked) ${K.tip('One range per line, like 2026-12-01 to 2027-01-15')}</label><textarea name="blocked" placeholder="2026-12-01 to 2027-01-15">${s.blocked.map(b => b.join(' to ')).join('\n')}</textarea>
      <h3>5. House rules</h3><textarea name="rules">${e(s.rules.join('\n'))}</textarea><p class="fine">One rule per line.</p>
      <h3>6. Your brand and photos</h3><div class="two"><label>Brand name<input name="brand" value="${e(s.brand)}"></label><label>Brand color<input type="color" name="color" value="${e(s.color)}"></label></div>
      <label>Add photos (optional)</label><input type="file" name="ph" accept="image/*" multiple data-change="stayphotos"><div class="thumbs" id="phprev">${s.photos.map(p => `<img src="${p}" alt="">`).join('')}</div>
      <label class="chk"><input type="checkbox" name="published" value="1" ${s.published ? 'checked' : ''}> Show on the marketplace</label>
      <button class="btn big" data-testid="savelisting">Save listing</button></div></form>`; };
  let newPhotos = null;
  K.changes.stayphotos = async el => { newPhotos = []; for (const f of [...el.files].slice(0, 6)) newPhotos.push(await K.resize(f, 900)); document.getElementById('phprev').innerHTML = newPhotos.map(p => `<img src="${p}" alt="">`).join(''); };
  K.forms.staysave = (d, f) => { let s = K.db.stays.find(x => x.id === f.dataset.id);
    const slug = (d.slug || d.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (K.db.stays.some(x => x.slug === slug && x !== s)) return K.toast('That link is taken. Try another.');
    if (!s) { const i = K.db.stays.length + 1; s = { id: K.uid('st'), uid: K.uid('fsu'), lat: 39.05 + (Math.random() - .5) * .06, lon: -94.59 + (Math.random() - .5) * .02, photos: S.photos(i * 37) }; K.db.stays.push(s); }
    Object.assign(s, { title: d.title, slug, hood: d.hood, beds: +d.beds, baths: +d.baths, desc: d.desc, rate: +d.rate, deposit: +d.deposit, cleaning: +d.cleaning, petFee: +d.petFee, pets: !!d.pets, amenities: AM.filter(a => d['am_' + a]), availFrom: d.availFrom || T(), rules: d.rules.split('\n').map(x => x.trim()).filter(Boolean), brand: d.brand, color: d.color, published: !!d.published,
      blocked: d.blocked.split('\n').map(l => l.match(/(\d{4}-\d\d-\d\d)\D+(\d{4}-\d\d-\d\d)/)).filter(Boolean).map(m => [m[1], m[2]]) });
    if (newPhotos && newPhotos.length) { s.photos = newPhotos; newPhotos = null; }
    const u = K.unit(s.uid); if (u.id) Object.assign(u, { label: s.title, rent: s.rate, deposit: s.deposit, beds: s.beds, baths: s.baths });
    K.save(); S.ensure(); K.toast('Saved. Your page is updated.'); K.go('#/stays/' + slug); };
  K.acts.reqok = el => { const r = K.db.stayReqs.find(x => x.id === el.dataset.id), s = K.db.stays.find(x => x.id === r.stay), u = K.unit(s.uid);
    r.status = 'approved'; s.blocked.push([r.checkIn, r.checkOut]);
    const tid = K.uid('t'); K.db.tenants.push({ id: tid, uid: u.id, name: r.name, email: r.email, phone: '', start: r.checkIn, end: r.checkOut, furnished: true });
    if (r.checkIn <= A(7)) Object.assign(u, { status: 'leased', tid, avail: null });
    else { u.upcoming = tid; }
    const l = K.db.leads.find(x => x.req === r.id); if (l) l.status = 'approved';
    K.save(); K.toast('Approved. Added to Tenants and the calendar.'); K.rerender(); };
  K.acts.reqno = el => { const r = K.db.stayReqs.find(x => x.id === el.dataset.id); r.status = 'declined'; const l = K.db.leads.find(x => x.req === r.id); if (l) l.status = 'closed'; K.save(); K.rerender(); };
})();
