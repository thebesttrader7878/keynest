// Landing page (#/) and signup (#/signup)
(function () {
  const K = KN, e = K.esc;
  function mockHome() { // real dashboard Home UI, rendered from demo seed numbers
    const saved = K.db; K.db = Object.assign({}, saved, JSON.parse(JSON.stringify(KN_SEED)), { setup: true }); K.ensureBills(); K.applyLateFees();
    let html = ''; try { html = K.dash.homeBody(true); } finally { K.db = saved; }
    return html;
  }
  const faqs = [
    ['Is KeyNest made for big property companies?', 'No. It is built for people who own a duplex up to about 20 units, often for the first time. Every screen uses plain English, and every number has a (?) that explains it.'],
    ['Do I need to be good with computers?', 'If you can use email and a phone, you can use KeyNest. A guided setup walks you through adding your property, units, and tenants. Most owners finish in about 10 minutes.'],
    ['Can tenants pay rent online?', 'Online rent payments are on the roadmap. In this preview, the tenant pay button is a demo and no money moves. You can still record checks, cash, and bank transfers and print receipts.'],
    ['Does KeyNest screen tenants?', 'Not yet. The preview includes a screening checklist to keep you organized. Real background and credit checks will come through a licensed screening partner.'],
    ['What about taxes?', 'KeyNest sorts your income and costs into categories similar to IRS Schedule E and exports a CSV for you or your tax preparer. It is not tax advice.'],
    ['Can I cancel anytime?', 'The proposed plans are month to month. You would be able to export your data whenever you like.'],
    ['Is my data safe?', 'This preview stores everything only in your own browser and sends nothing to a server. The paid version would use encrypted cloud storage.']
  ];
  K.routes[''] = () => {
    K.routeTitle = 'KeyNest | Simple property management software for small landlords (2 to 20 units)';
    return `<section class="lhero"><div class="lhero-in"><div>
      <span class="eyebrow">For first-time owners of duplexes to 20 units</span>
      <h1>Run your rentals from your phone, in plain English.</h1>
      <p class="lead">Track rent, fill empty units, and fix repairs without spreadsheets or jargon. KeyNest tells you exactly what to do next.</p>
      <div class="row"><a class="btn acc big-cta" href="#/signup">Start free trial</a><button class="btn ghost big-cta" data-act="liveDemo">See live demo</button></div>
      <p class="fine">Free 30-day trial (proposed). No card needed for the preview.</p></div>
      <div class="device" aria-label="KeyNest dashboard preview"><div class="device-bar"><span></span><span></span><span></span></div><div class="device-screen">${mockHome()}</div></div></div></section>
    <section class="lsec"><h2 class="center">Owning your first rental is a lot</h2><div class="pains">
      ${[['Rent in five places', 'Venmo, checks, a notebook, and your memory.', 'One rent list that shows who paid, who is late, and adds late fees for you.'], ['Repairs fall through the cracks', 'Texts at 11 PM and no record of what got fixed.', 'Tenants send a request with photos. You pick a handyman and track it to done.'], ['Empty units cost money every day', 'Every vacant month is lost rent you never get back.', 'Copy-ready listings, a showing calendar, and every lead in one inbox.'], ['Tax time panic', 'A shoebox of receipts in April.', 'Snap receipt photos as you go and export a Schedule E style summary.']].map(([t, p, s]) => `<div class="pain"><h3>${t}</h3><p class="bad">✕ ${p}</p><p class="good">✓ ${s}</p></div>`).join('')}
    </div></section>
    <section class="lsec alt"><h2 class="center">Everything a small landlord needs</h2><div class="feat-grid">
      ${[['💵', 'Rent roll', 'Auto late fees, partial payments, extra charges like parking, printable receipts.'], ['🏠', 'Listings and leads', 'Post units, book showings, and keep every question and application together.'], ['📝', 'Leases', 'Build a lease from a template, sign it digitally (demo), and send renewals.'], ['🔧', 'Repairs', 'A simple board: New, Being fixed, Fixed. Assign vendors in one tap.'], ['🔍', 'Move-in and move-out checks', 'Room by room checklist with photos, so deposit talks are easy.'], ['💬', 'Messages', 'Text-style threads with each tenant, plus building-wide announcements.'], ['📅', 'Calendar', 'Showings, lease ends, inspections, and rent due dates in one place.'], ['📊', 'Reports', 'Cash flow for 12 months, profit per unit, and how full you are.'], ['🧮', 'Calculators', 'See what an empty unit costs you and what a rent increase really means.']].map(([i, t, d]) => `<div class="fcard"><div class="ic">${i}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}
    </div></section>
    <section class="lsec"><h2 class="center">Up and running in 3 steps</h2><ol class="how"><li><b>Add your property</b><span>Name, address, neighborhood.</span></li><li><b>Add units and tenants</b><span>Rent, bedrooms, lease dates. Skip what you do not know yet.</span></li><li><b>Follow "What to do next"</b><span>KeyNest checks your rent, leases, and repairs and gives you a short to-do list.</span></li></ol>
      <div class="center"><a class="btn big-cta" href="#/signup">Set up my property</a></div></section>
    <section class="lsec alt" id="calc"><h2 class="center">What could you save?</h2><p class="center mut">Move the sliders. Estimates only, based on the numbers you enter.</p>
      <div class="calc card"><div class="b">
        <label>Units you own <output id="cU">4</output></label><input type="range" min="2" max="20" value="4" id="sU" data-input="lcalc">
        <label>Average rent per unit <output id="cR">$1,200</output></label><input type="range" min="500" max="3000" step="50" value="1200" id="sR" data-input="lcalc">
        <label>Hours per month you spend on paperwork, rent chasing, and texts <output id="cH">10</output></label><input type="range" min="1" max="40" value="10" id="sH" data-input="lcalc">
        <label>Days a unit usually sits empty between tenants <output id="cV">30</output></label><input type="range" min="0" max="90" value="30" id="sV" data-input="lcalc">
        <div class="calc-out" id="calcOut"></div><p class="fine">Assumes KeyNest could save about a third of your admin time and shave a week off each vacancy, valued at $25 an hour. Your results will vary.</p></div></div></section>
    <section class="lsec"><h2 class="center">How KeyNest compares</h2><p class="center mut">General comparison based on how these tools are typically positioned. Features and prices change, so check each company's site.</p>
      <div class="tbl"><table class="cmp"><thead><tr><th></th><th>Spreadsheets</th><th>Large suites<br><small>e.g. AppFolio, Buildium</small></th><th>Landlord apps<br><small>e.g. TurboTenant, Avail</small></th><th class="us">KeyNest<br><small>proposed</small></th></tr></thead><tbody>
      ${[['Made for 2 to 20 units', 'Any size', 'Often aimed at larger portfolios', 'Yes', 'Yes'], ['Plain-English screens and tooltips', 'No', 'Pro terms', 'Mostly', 'Yes, every number'], ['Tells you what to do next', 'No', 'Varies', 'Varies', 'Yes'], ['Rent tracking with late fees', 'Manual', 'Yes', 'Yes', 'Yes'], ['Repairs board with vendors', 'No', 'Yes', 'Varies', 'Yes'], ['Learning curve', 'Low, but manual', 'Higher', 'Moderate', 'Low'], ['Kansas City focus', 'No', 'No', 'No', 'Yes']].map(r => `<tr><th>${r[0]}</th>${r.slice(1).map((c, i) => `<td class="${i === 3 ? 'us' : ''}">${c}</td>`).join('')}</tr>`).join('')}
      </tbody></table></div></section>
    <section class="lsec alt" id="pricing"><h2 class="center">Simple pricing</h2><p class="center mut">Proposed launch pricing. Not live yet.</p><div class="tiers">
      <div class="tier"><h3>Free trial</h3><div class="big">$0</div><p class="mut">30 days, all features</p><ul><li>Up to 20 units</li><li>Guided setup</li><li>Cancel anytime</li></ul><a class="btn ghost" href="#/signup">Start free trial</a></div>
      <div class="tier pop"><span class="badge">Most popular</span><h3>Starter</h3><div class="big">$49<small>/mo</small></div><p class="mut">Up to 20 units</p><ul><li>Rent roll and late fees</li><li>Listings, leads, showings</li><li>Leases, renewals, inspections</li><li>Repairs, vendors, messages</li><li>Reports and tax export</li></ul><a class="btn" href="#/signup">Start free trial</a></div>
      <div class="tier"><h3>Growing</h3><div class="big">Let's talk</div><p class="mut">21 to 50 units</p><ul><li>Everything in Starter</li><li>Priority local support</li><li>Help moving your data in</li></ul><a class="btn ghost" href="#/signup">Get in touch</a></div>
    </div></section>
    <section class="lsec"><h2 class="center">Built with care, honestly</h2><div class="trust">
      <div><b>🔒 Your data stays yours</b><p>This preview keeps everything in your browser. Export anytime.</p></div>
      <div><b>📍 Kansas City roots</b><p>Built for local owners in neighborhoods like Westport, Brookside, and Waldo.</p></div>
      <div><b>🙋 Real humans</b><p>Early users get direct help setting up. No phone trees.</p></div>
      <div><b>🧪 Early access</b><p>KeyNest is new. We would rather earn your trust than show you fake reviews.</p></div>
    </div></section>
    <section class="lsec alt"><h2 class="center">Questions</h2><div class="faq">${faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></section>
    <section class="lsec final"><h2>Ready to feel in control of your rentals?</h2><p>Set up your first property in about 10 minutes.</p><div class="row center-row"><a class="btn acc big-cta" href="#/signup">Start free trial</a><button class="btn ghost big-cta" data-act="liveDemo">See live demo</button></div></section>
    <div class="mcta"><a class="btn acc" href="#/signup">Start free trial</a><button class="btn ghost" data-act="liveDemo">Live demo</button></div>`;
  };
  K.changes.lcalc = () => {
    const u = +K.$('#sU').value, r = +K.$('#sR').value, h = +K.$('#sH').value, v = +K.$('#sV').value;
    K.$('#cU').textContent = u; K.$('#cR').textContent = K.money(r); K.$('#cH').textContent = h; K.$('#cV').textContent = v;
    const timeSaved = Math.round(h / 3), timeVal = timeSaved * 25 * 12, vacDays = Math.min(7, v), vac = Math.round(r / 30 * vacDays * u * 0.5), cost = 49 * 12;
    K.$('#calcOut').innerHTML = `<div><span>Hours back each month</span><b>${timeSaved}</b></div><div><span>Value of your time per year</span><b>${K.money(timeVal)}</b></div><div><span>Rent kept from shorter vacancies per year</span><b>${K.money(vac)}</b></div><div class="tot"><span>Estimated yearly benefit after the $49/mo plan</span><b>${K.money(timeVal + vac - cost)}</b></div>`;
  };
  const oldRender = K.render; K.render = function () { oldRender(); if (K.$('#calcOut')) K.changes.lcalc(); };
  K.acts.liveDemo = () => { K.loadDemo(); K.setSess({ landlord: true, pid: 'all' }); K.toast('Welcome to the live demo'); K.go('#/dash/home'); };
  K.routes.signup = () => { K.routeTitle = 'Start your free trial | KeyNest';
    return `<div class="signup card"><div class="b"><h1>Start your free trial</h1><p class="mut">Preview only. Nothing is sent anywhere and no card is needed.</p>
    <form data-form="signup"><label>Your name</label><input name="name" required autocomplete="name"><label>Email</label><input name="email" type="email" required autocomplete="email"><label>How many units do you own?</label><select name="size"><option>2 (a duplex)</option><option>3 to 4</option><option>5 to 10</option><option>11 to 20</option><option>More than 20</option></select>
    <button class="btn big">Create my account and set up</button></form><p class="fine center">Just looking? <button class="link" data-act="liveDemo">Open the live demo instead</button></p></div></div>`; };
  K.forms.signup = d => { K.startFresh(); K.db.settings.owner = d.name; K.save(); K.setSess({ landlord: true, pid: 'all', owner: d.name }); K.toast('Account created. Let\'s set up your property.'); K.go('#/dash'); };
})();
