export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getDb } from '../../../_utils/mongodb';

// POST /api/friends/accept { email, fromEmail }
// Accepts a pending request from fromEmail into email's friends list (both sides).
export async function POST(request) {
  try {
    const { email, fromEmail } = await request.json();
    if (!email || !fromEmail) {
      return new Response(JSON.stringify({ error: 'email and fromEmail are required' }), { status: 400 });
    }
    if (email === fromEmail) {
      return new Response(JSON.stringify({ error: 'Invalid' }), { status: 400 });
    }

    const db = await getDb();
    const users = db.collection('users');

    // Verify there is a pending request
    const me = await users.findOne({ email }, { projection: { pendingRequests: 1 } });
    if (!me?.pendingRequests?.includes(fromEmail)) {
      return new Response(JSON.stringify({ error: 'No pending request from this user' }), { status: 400 });
    }

    // Atomically: remove pending, add friends both sides
    const now = new Date();
    await users.updateOne(
      { email },
      { $pull: { pendingRequests: fromEmail }, $addToSet: { friends: fromEmail }, $set: { updatedAt: now } }
    );
    await users.updateOne(
      { email: fromEmail },
      { $addToSet: { friends: email }, $set: { updatedAt: now } }
    );

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
}
