// Seed data for the KeyNest demo. All people, addresses, and companies are fictional.
window.KN_SEED = (function () {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const iso = d => d.toISOString().slice(0, 10);
  const add = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const props = [
    { id: 'p1', name: 'Westport Lofts', addr: '4120 Pennsylvania Ave (demo)', hood: 'Westport', img: 'img/b-fourplex-0.svg', type: 'Fourplex x2' },
    { id: 'p2', name: 'Brookside Commons', addr: '6330 Wornall Rd (demo)', hood: 'Brookside', img: 'img/b-unit-1.svg', type: 'Small apartment' },
    { id: 'p3', name: 'Midtown Flats', addr: '3415 Gillham Rd (demo)', hood: 'Midtown', img: 'img/b-unit-2.svg', type: 'Small apartment' },
    { id: 'p4', name: 'River Market Row', addr: '412 Delaware St (demo)', hood: 'River Market', img: 'img/b-triplex-3.svg', type: 'Rowhouses' },
    { id: 'p5', name: 'Waldo Duplex', addr: '7520 Main St (demo)', hood: 'Waldo', img: 'img/b-duplex-4.svg', type: 'Duplex' }
  ];
  const counts = [6, 5, 6, 5, 2];
  const first = ['Testy', 'Demo', 'Sample', 'Placeholder', 'Fakey', 'Mock', 'Pretend', 'Example', 'Dummy', 'Faux'];
  const last = ['McTenant', 'Renterson', 'Leaseworth', 'Doe', 'Keyholder', 'Unitson', 'Rowhouse', 'Walkup', 'Studioz', 'Lofton'];
  const units = [], tenants = [], payments = [], expenses = [], charges = [], leases = [];
  let n = 0;
  props.forEach((p, pi) => {
    for (let u = 0; u < counts[pi]; u++) {
      n++;
      const beds = [0, 1, 1, 2, 2, 3][(n * 7) % 6];
      const rent = 850 + beds * 325 + pi * 40 + (u % 3) * 25;
      const id = 'u' + n, status = n % 4 === 0 ? 'vacant' : 'leased', k = (n % 3) + 1;
      units.push({
        id, pid: p.id, label: pi === 4 ? (u ? 'B' : 'A') : String((Math.floor(u / 3) + 1) * 100 + (u % 3) + 1),
        beds, baths: beds >= 2 ? 2 : 1, sqft: 480 + beds * 260 + u * 15, rent, status, deposit: rent,
        avail: status === 'vacant' ? iso(add(today, (n % 3) * 10)) : null,
        photos: [p.img, `img/p${pi + 1}-i1.svg`, `img/p${pi + 1}-i2.svg`, `img/p${pi + 1}-i3.svg`],
        desc: `${beds ? beds + ' bedroom' : 'Studio'} home in ${p.hood} with in-unit laundry, an updated kitchen, and easy access to the KC Streetcar and bus lines.`,
        amenities: ['In-unit laundry', 'Off-street parking', 'Pets OK with fee', 'Central air'].slice(0, 2 + (n % 3)),
        tid: null
      });
      if (n % 5 === 1) charges.push({ id: 'c' + n, uid: id, name: 'Pet rent', amount: 35 });
      if (n % 7 === 2) charges.push({ id: 'c' + n + 'b', uid: id, name: 'Parking spot', amount: 50 });
      if (status === 'leased') {
        const tid = 't' + n, endOffset = [25, 45, 120, 200, 300, 55, 400][n % 7];
        const end = add(today, endOffset), start = add(end, -365);
        tenants.push({ id: tid, uid: id, name: first[n % 10] + ' ' + last[(n * 3) % 10], email: `tenant${n}@example.com`, phone: `(816) 555-0${100 + n}`, start: iso(start), end: iso(end), emergency: 'Demo Contact, (816) 555-0199' });
        units[units.length - 1].tid = tid;
        leases.push({ id: 'ls' + n, tid, uid: id, start: iso(start), end: iso(end), rent, deposit: rent, status: 'active', signedLandlord: iso(add(start, -10)), signedTenant: iso(add(start, -9)), clauses: ['pets', 'smoking', 'utilities'] });
        const extra = charges.filter(c => c.uid === id).reduce((a, c) => a + c.amount, 0);
        for (let m = 11; m >= 0; m--) {
          const due = new Date(today.getFullYear(), today.getMonth() - m, 1);
          if (due < new Date(start.getFullYear(), start.getMonth(), 1)) continue;
          const late = (n + m) % 9 === 0, unpaid = m === 0 && n % 6 === 1, partial = m === 0 && n % 6 === 3;
          const amt = rent + extra, txns = [];
          if (!unpaid) txns.push({ date: iso(add(due, late ? 9 : 2)), amt: partial ? Math.round(amt / 2) : amt + (late ? 50 : 0), method: ['Bank transfer', 'Check', 'Card (demo)'][n % 3] });
          payments.push({ id: 'pay' + n + '-' + m, tid, uid: id, pid: p.id, due: iso(due), rent, extra, lateFee: late ? 50 : 0, txns });
        }
      }
    }
    const cats = ['Repairs', 'Utilities', 'Insurance', 'Cleaning and maintenance', 'Taxes', 'Management fees', 'Supplies', 'Advertising'];
    for (let m = 11; m >= 0; m--) {
      const d = new Date(today.getFullYear(), today.getMonth() - m, 12);
      expenses.push({ id: 'e' + pi + m, pid: p.id, date: iso(d), cat: cats[(pi + m) % 8], vendor: ['Fix-It Demo Co.', 'KC Demo Utilities', 'Sample Insurance Co.'][m % 3], amount: 200 + ((pi * 137 + m * 91) % 700), note: '', receipt: null });
      if (m % 6 === 0) expenses.push({ id: 'ex' + pi + m, pid: p.id, date: iso(add(d, 5)), cat: 'Mortgage interest', vendor: 'Demo Bank', amount: 900 + pi * 120, note: '', receipt: null });
    }
  });
  const vendors = [
    { id: 'h1', name: 'Fix-It Demo Co.', trade: 'General handyman', phone: '(816) 555-0201', email: 'fixit@example.com', notes: 'Fast on small jobs. Weekdays.' },
    { id: 'h2', name: 'Sample Plumbing LLC', trade: 'Plumbing', phone: '(816) 555-0202', email: 'plumb@example.com', notes: '24/7 emergency line.' },
    { id: 'h3', name: 'Placeholder Electric', trade: 'Electrical', phone: '(816) 555-0203', email: 'spark@example.com', notes: 'Licensed, KCMO permits.' },
    { id: 'h4', name: 'Mock HVAC Pros', trade: 'Heating and AC', phone: '(816) 555-0204', email: 'hvac@example.com', notes: 'Does yearly furnace checks.' },
    { id: 'h5', name: 'Demo Clean Team', trade: 'Cleaning', phone: '(816) 555-0205', email: 'clean@example.com', notes: 'Move-out cleans, 48 hour turnaround.' }
  ];
  const tickets = [
    { id: 'm1', uid: 'u1', tid: 't1', title: 'Kitchen faucet dripping', desc: 'Drips all night.', priority: 'Low', status: 'new', hid: null, photos: [], created: iso(add(today, -2)) },
    { id: 'm2', uid: 'u6', tid: 't6', title: 'AC not cooling', desc: 'Blowing warm air.', priority: 'High', status: 'progress', hid: 'h4', photos: [], created: iso(add(today, -4)) },
    { id: 'm3', uid: 'u10', tid: 't10', title: 'Bedroom outlet dead', desc: 'Outlet by the window stopped working.', priority: 'Medium', status: 'progress', hid: 'h3', photos: [], created: iso(add(today, -6)) },
    { id: 'm4', uid: 'u14', tid: 't14', title: 'Garbage disposal jammed', desc: '', priority: 'Medium', status: 'done', hid: 'h1', photos: [], created: iso(add(today, -12)) },
    { id: 'm5', uid: 'u2', tid: 't2', title: 'Toilet running', desc: 'Runs all the time.', priority: 'Medium', status: 'new', hid: null, photos: [], created: iso(add(today, -1)) }
  ];
  const leads = [
    { id: 'l1', type: 'inquiry', uid: 'u4', name: 'Demo Prospect', email: 'prospect1@example.com', phone: '(816) 555-0191', msg: 'Is parking included?', status: 'new', created: iso(add(today, -1)) },
    { id: 'l2', type: 'showing', uid: 'u8', name: 'Sample Seeker', email: 'seeker@example.com', phone: '(816) 555-0192', slot: iso(add(today, 3)) + ' 10:00 AM', status: 'contacted', created: iso(add(today, -2)) },
    { id: 'l3', type: 'application', uid: 'u12', name: 'Faux Applicant', email: 'applicant@example.com', phone: '(816) 555-0193', income: 62000, employer: 'Example Corp', moveIn: iso(add(today, 20)), status: 'new', created: iso(add(today, -3)), screen: { id: true, income: true, refs: false, bg: false, credit: false } }
  ];
  const threads = [
    { id: 'th1', tid: 't1', msgs: [{ from: 'tenant', text: 'Hi! Is it OK if I paint the bedroom a light gray?', at: iso(add(today, -3)) }, { from: 'landlord', text: 'Sure, light neutral colors are fine. Thanks for asking!', at: iso(add(today, -2)) }] },
    { id: 'th2', tid: 't6', msgs: [{ from: 'tenant', text: 'The AC tech came by, thank you.', at: iso(add(today, -1)) }], unread: true }
  ];
  const announcements = [{ id: 'an1', pid: 'p1', text: 'Heads up: the parking lot gets sealed next Tuesday from 8 AM to 2 PM. Please park on the street.', at: iso(add(today, -4)) }];
  const inspections = [{ id: 'in1', uid: 'u5', type: 'Move-in', date: iso(add(today, -200)), status: 'done', items: [{ room: 'Kitchen', item: 'Appliances work', ok: true, note: '', photo: null }, { room: 'Living room', item: 'Walls and floors', ok: false, note: 'Small scuff by door', photo: null }] },
    { id: 'in2', uid: 'u3', type: 'Move-out', date: iso(add(today, 6)), status: 'scheduled', items: [] }];
  const docs = [
    { id: 'd1', name: 'Property insurance policy (placeholder).pdf', cat: 'Insurance', pid: 'p1', at: iso(add(today, -90)) },
    { id: 'd2', name: 'KCMO rental permit (placeholder).pdf', cat: 'Permits', pid: 'p3', at: iso(add(today, -60)) },
    { id: 'd3', name: 'Lead paint disclosure (placeholder).pdf', cat: 'Leases', pid: 'p4', at: iso(add(today, -30)) }
  ];
  const settings = { lateType: 'flat', lateAmount: 50, grace: 5, dueDay: 1, methods: { bank: true, card: true, check: true, cash: false }, owner: 'Demo Owner', business: 'Demo Properties LLC' };
  return { props, units, tenants, payments, expenses, charges, leases, vendors, tickets, leads, threads, announcements, inspections, docs, settings, readNotes: [] };
})();
