export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getDb } from '../../../_utils/mongodb';

// GET /api/friends/list?email=...
// Returns the friends array of the given user.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) {
      return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400 });
    }
    const db = await getDb();
    const me = await db.collection('users').findOne({ email }, { projection: { friends: 1 } });
    const friends = me?.friends || [];
    return new Response(JSON.stringify({ friends }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
}
