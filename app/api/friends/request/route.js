export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getDb } from '../../../_utils/mongodb';

// POST /api/friends/request { fromEmail, toEmail }
// Creates a pending friend request from fromEmail to toEmail.
export async function POST(request) {
  try {
    let { fromEmail, toEmail } = await request.json();

    // Normalize
    fromEmail = typeof fromEmail === 'string' ? fromEmail.trim().toLowerCase() : '';
    toEmail = typeof toEmail === 'string' ? toEmail.trim().toLowerCase() : '';

    // Basic validations
    if (!fromEmail || !toEmail) {
      return new Response(JSON.stringify({ error: 'fromEmail and toEmail are required' }), { status: 400 });
    }
    if (fromEmail === toEmail) {
      return new Response(JSON.stringify({ error: 'Cannot friend yourself' }), { status: 409 });
    }

    const db = await getDb();
    const users = db.collection('users');

    // Ensure both user documents exist (minimal profile)
    const now = new Date();
    await users.updateOne(
      { email: fromEmail },
      { $setOnInsert: { email: fromEmail, friends: [], pendingRequests: [], blocked: [], createdAt: now, updatedAt: now }, $set: { updatedAt: now } },
      { upsert: true }
    );
    await users.updateOne(
      { email: toEmail },
      { $setOnInsert: { email: toEmail, friends: [], pendingRequests: [], blocked: [], createdAt: now, updatedAt: now }, $set: { updatedAt: now } },
      { upsert: true }
    );

    // Check blocks (simple one-way block check)
    const target = await users.findOne({ email: toEmail }, { projection: { blocked: 1, friends: 1, pendingRequests: 1 } });
    if (target?.blocked?.includes(fromEmail)) {
      return new Response(JSON.stringify({ error: 'Recipient has blocked requests from you' }), { status: 403 });
    }

    // Prevent duplicates: if already friends or already pending
    if (target?.friends?.includes(fromEmail)) {
      return new Response(JSON.stringify({ ok: true, info: 'Already friends' }), { status: 200 });
    }
    if (target?.pendingRequests?.includes(fromEmail)) {
      return new Response(JSON.stringify({ ok: true, info: 'Request already pending' }), { status: 200 });
    }

    // Add pending request to recipient
    await users.updateOne(
      { email: toEmail },
      { $addToSet: { pendingRequests: fromEmail }, $set: { updatedAt: new Date() } }
    );

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
}
