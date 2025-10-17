export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { ObjectId } from 'mongodb';
import { getDb } from '../../_utils/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400 });
    }
    const db = await getDb();
    const items = await db
      .collection('conversations')
      .find({ email })
      .project({ title: 1, email: 1, createdAt: 1, updatedAt: 1 })
      .sort({ updatedAt: -1 })
      .toArray();
    return new Response(JSON.stringify({ conversations: items }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, title } = body || {};
    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400 });
    }
    const now = new Date();
    const conv = { email, title: String(title || 'New chat'), createdAt: now, updatedAt: now };
    const db = await getDb();
    const res = await db.collection('conversations').insertOne(conv);
    return new Response(JSON.stringify({ conversation: { _id: res.insertedId, ...conv } }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { email, conversationId } = body || {};``
    if (!email || !conversationId) {
      return new Response(JSON.stringify({ error: 'Missing email or conversationId' }), { status: 400 });
    }
    const db = await getDb();
    const convObjectId = new ObjectId(conversationId);
    await db.collection('conversations').deleteOne({ _id: convObjectId, email });
    await db.collection('chats').deleteOne({ email, conversationId: convObjectId });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
}
