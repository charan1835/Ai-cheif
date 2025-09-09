export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getDb } from '../../../_utils/mongodb';

// GET /api/friends/pending?email=...
// Returns emails that have requested friendship with the given user (incoming requests).
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) {
      return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400 });
    }
    const db = await getDb();
    const me = await db.collection('users').findOne({ email }, { projection: { pendingRequests: 1 } });
    const pending = me?.pendingRequests || [];
    return new Response(JSON.stringify({ pending }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
}
