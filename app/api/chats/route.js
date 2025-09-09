export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { ObjectId } from 'mongodb';
import { getDb } from '../../_utils/mongodb';

async function ensureConversation(db, email, conversationId, titleHint) {
  if (conversationId) return new ObjectId(conversationId);
  const now = new Date();
  const conv = { email, title: titleHint || 'New chat', createdAt: now, updatedAt: now };
  const res = await db.collection('conversations').insertOne(conv);
  return res.insertedId;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const conversationId = searchParams.get('conversationId');
    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400 });
    }
    if (!conversationId) {
      return new Response(JSON.stringify({ error: 'Missing conversationId' }), { status: 400 });
    }

    const db = await getDb();
    const doc = await db.collection('chats').findOne({ email, conversationId: new ObjectId(conversationId) });
    const messages = doc?.messages || [];
    return new Response(JSON.stringify({ messages }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages, email, conversationId, titleHint } = body || {};

    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400 });
    }
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'messages must be an array' }), { status: 400 });
    }

    const db = await getDb();
    const convId = await ensureConversation(db, email, conversationId, titleHint);

    await db.collection('chats').updateOne(
      { email, conversationId: convId },
      { $setOnInsert: { email, conversationId: convId, createdAt: new Date() }, $push: { messages: { $each: messages } }, $set: { updatedAt: new Date() } },
      { upsert: true }
    );

    await db.collection('conversations').updateOne({ _id: convId }, { $set: { updatedAt: new Date() }, $setOnInsert: { createdAt: new Date(), email } });

    return new Response(JSON.stringify({ ok: true, conversationId: String(convId) }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
}
