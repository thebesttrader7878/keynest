# KeyNest v4 (static demo)

Open `index.html` through any static server (for example `python3 -m http.server`). All data lives in the browser's localStorage. People, companies, and photos are fictional.

## Demo logins
| Role | Email | Password |
|---|---|---|
| Master Admin | admin@keynest.demo | admin |
| Landlord (Sunny Nest Rentals) | owner@keynest.demo | demo |
| Landlord (Fountain City Homes) | landlord2@keynest.demo | demo |
| Landlord (Riverside Keys) | landlord3@keynest.demo | demo |
| Landlord, new and empty | landlord4@keynest.demo | demo |
| Landlord, suspended | landlord5@keynest.demo | demo (blocked) |
| Tenant | tenant1@example.com | demo |

Admin area: `#/admin`. "Help set up / View as" opens that landlord's dashboard with a yellow banner, and every save goes to their account and the activity log.

## How data is scoped in the demo
- `keynest_v4_accounts`: list of accounts (role, status, profile).
- `keynest_v4_db_<accountId>`: one data store per landlord (properties, units, tenants, leads, furnished stays...). A landlord login only ever loads their own store.
- `keynest_v4_adminlog`: admin activity log.
- The furnished marketplace reads published listings from every active landlord, and inquiries are written into the owning landlord's store.

## Mapping to a real backend later (Supabase example)
```sql
-- Every owned table gets an owner column
alter table properties add column owner_id uuid not null references auth.users(id);
alter table properties enable row level security;

-- Landlords: only their own rows
create policy "owner rows" on properties for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Admin: role lives in a profiles table (or a custom JWT claim), bypasses the owner check
create policy "admin all rows" on properties for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Audit log written by a trigger or an edge function
create table admin_log (id bigserial primary key, admin_id uuid, target_owner uuid, action text, at timestamptz default now());
```
- "View as" in production: keep the admin's own session, send the target `owner_id` with each request, and let the admin policy allow it. Never sign in as the user or store their password.
- Do sensitive admin actions (role changes, suspensions) in a server-side function using the service role key, and log each one to `admin_log`.
- Suspended accounts: add `status` to `profiles` and include `status = 'active'` in the landlord policies.
