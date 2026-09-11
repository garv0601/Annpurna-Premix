import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY; // may not exist in backend/.env

const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

async function main() {
  // 1. Find an active admin user + their email.
  const { data: admins, error: adminErr } = await admin
    .from('admin_users')
    .select('id, user_id, is_active')
    .eq('is_active', true)
    .limit(1);
  if (adminErr || !admins || !admins.length) {
    console.log('No active admin found:', adminErr?.message);
    return;
  }
  const adminUserId = admins[0].user_id;
  const { data: userData, error: userErr } = await admin.auth.admin.getUserById(adminUserId);
  if (userErr || !userData?.user?.email) {
    console.log('Could not resolve admin email:', userErr?.message);
    return;
  }
  const adminEmail = userData.user.email;
  console.log('Using admin email:', adminEmail);

  // 2. Mint a magic link and verify it to get a real session (no password needed).
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: adminEmail,
  });
  if (linkErr) {
    console.log('generateLink error:', linkErr.message);
    return;
  }

  // Use an anon-key client (fallback to service key if no anon key present —
  // verifyOtp only needs a valid Supabase client, not privilege).
  const anon = createClient(url, anonKey || serviceKey, { auth: { persistSession: false } });
  const { data: sessionData, error: verifyErr } = await anon.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'email',
  });
  if (verifyErr || !sessionData?.session) {
    console.log('verifyOtp error:', verifyErr?.message);
    return;
  }
  const token = sessionData.session.access_token;
  console.log('Got access token (len):', token.length);

  // 3. Hit the new backend endpoints.
  const base = 'http://localhost:5000/api/admin/customers';
  const headers = { Authorization: `Bearer ${token}` };

  const listRes = await fetch(base, { headers });
  const listBody = await listRes.json();
  console.log('GET /admin/customers ->', listRes.status, 'count:', listBody.customers?.length, listBody.message || '');

  const statsRes = await fetch(`${base}/stats`, { headers });
  const statsBody = await statsRes.json();
  console.log('GET /admin/customers/stats ->', statsRes.status, JSON.stringify(statsBody.stats || statsBody));

  if (listBody.customers?.length) {
    const firstId = listBody.customers[0].id;
    const oneRes = await fetch(`${base}/${firstId}`, { headers });
    const oneBody = await oneRes.json();
    console.log('GET /admin/customers/:id ->', oneRes.status, oneBody.customer ? 'OK' : oneBody.message);
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
