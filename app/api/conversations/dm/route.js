export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getDb } from '../../../_utils/mongodb';

// POST /api/conversations/dm { email, targetEmail }
// Upserts a 1:1 conversation by member emails and returns { conversationId }
export async function POST(request) {
  try {
    const { email, targetEmail } = await request.json();
    if (!email || !targetEmail || email === targetEmail) {
      return new Response(JSON.stringify({ error: 'Invalid emails' }), { status: 400 });
    }
    const db = await getDb();
    const now = new Date();

    // Try find existing conversation with both members
    let conv = await db.collection('conversations').findOne({ email: { $exists: true }, members: { $all: [email, targetEmail], $size: 2 } }, { projection: { _id: 1 } });

    if (!conv) {
      // Create new conversation document with both members
      const doc = { email, members: [email, targetEmail], title: 'Direct message', createdAt: now, updatedAt: now };
      const res = await db.collection('conversations').insertOne(doc);
      conv = { _id: res.insertedId };
    } else {
      await db.collection('conversations').updateOne({ _id: conv._id }, { $set: { updatedAt: now } });
    }

    return new Response(JSON.stringify({ conversationId: String(conv._id) }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
}
