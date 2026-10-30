// Demo accounts for the multi-account + Master Admin preview. All people and companies are fictional.
window.KN_ACCOUNTS = [
  { id: 'a1', role: 'landlord', name: 'Demo Owner', business: 'Sunny Nest Rentals', email: 'owner@keynest.demo', phone: '(816) 555-0101', pw: 'demo', status: 'active', created: '2026-01-12' },
  { id: 'a2', role: 'landlord', name: 'Pat Placeholder', business: 'Fountain City Homes', email: 'landlord2@keynest.demo', phone: '(816) 555-0102', pw: 'demo', status: 'active', created: '2026-03-03', seed: [['Plaza Twin Duplex', 'Country Club Plaza', 'Duplex', 2], ['Brookside Fourplex', 'Brookside', 'Fourplex', 4]] },
  { id: 'a3', role: 'landlord', name: 'Riley Example', business: 'Riverside Keys', email: 'landlord3@keynest.demo', phone: '(816) 555-0103', pw: 'demo', status: 'active', created: '2026-05-20', seed: [['Northeast Triplex', 'Historic Northeast', 'Triplex', 3]] },
  { id: 'a4', role: 'landlord', name: 'Morgan Mockwell', business: 'Mockwell Rentals', email: 'landlord4@keynest.demo', phone: '(816) 555-0104', pw: 'demo', status: 'active', created: '2026-10-25' },
  { id: 'a5', role: 'landlord', name: 'Casey Sampleton', business: 'Sampleton Property Co.', email: 'landlord5@keynest.demo', phone: '(816) 555-0105', pw: 'demo', status: 'suspended', created: '2026-02-14', seed: [['Waldo Single', 'Waldo', 'House', 1]] },
  { id: 'r1', role: 'tenant', name: 'Testy Renterson', email: 'tenant1@example.com', phone: '(816) 555-0201', status: 'active', landlord: 'a1', created: '2026-02-01' },
  { id: 'r2', role: 'tenant', name: 'Demo Leaseworth', email: 'tenant2@example.com', phone: '(816) 555-0202', status: 'active', landlord: 'a1', created: '2026-02-01' },
  { id: 'r3', role: 'tenant', name: 'Sample Keyholder', email: 'a2-tenant1@example.com', phone: '(816) 555-0203', status: 'active', landlord: 'a2', created: '2026-04-11' },
  { id: 'r4', role: 'tenant', name: 'Mock Walkup', email: 'a3-tenant1@example.com', phone: '(816) 555-0204', status: 'active', landlord: 'a3', created: '2026-06-02' }
];
// Small seed for extra landlords. Same shapes as data.js.
KN.seedLandlord = a => {
  const K = KN, db = K.blank(), T = K.todayIso(), tn = ['Sample Keyholder', 'Faux Lofton', 'Pretend Doe', 'Dummy Studioz', 'Example Unitson', 'Mock Walkup'];
  db.settings.owner = a.name; db.settings.business = a.business; db.setup = true; let n = 0;
  a.seed.forEach(([name, hood, type, cnt], pi) => { const pid = 'p' + (pi + 1); db.props.push({ id: pid, name, addr: (100 + pi * 211) + ' Demo St (demo)', hood, img: `img/b-${['duplex', 'fourplex', 'triplex', 'unit'][pi % 4]}-${pi}.svg`, type });
    for (let u = 0; u < cnt; u++) { n++; const id = 'u' + n, beds = 1 + (n % 3), rent = 900 + beds * 300, leased = n % 3 !== 0;
      db.units.push({ id, pid, label: cnt <= 2 ? 'AB'[u] : String(101 + u), beds, baths: beds > 1 ? 2 : 1, sqft: 600 + beds * 250, rent, status: leased ? 'leased' : 'vacant', deposit: rent, avail: leased ? null : T, photos: [db.props[pi].img], desc: `${beds} bedroom home in ${hood}.`, amenities: ['In-unit laundry', 'Central air'], tid: null });
      if (leased) { const tid = 't' + n, ten = a.id === 'a3' ? tn[(n + 4) % 6] : tn[(n - 1) % 6]; db.tenants.push({ id: tid, uid: id, name: ten, email: `${a.id}-tenant${n}@example.com`, phone: '(816) 555-03' + String(10 + n), start: K.addDays(T, -200), end: K.addDays(T, 165 + n * 20) }); db.units[db.units.length - 1].tid = tid;
        db.leases.push({ id: 'ls' + n, tid, uid: id, start: K.addDays(T, -200), end: K.addDays(T, 165 + n * 20), rent, deposit: rent, status: 'active', clauses: [] }); } } });
  return db;
};
