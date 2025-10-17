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
    const conversationId = searchParams.get('convId');
    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing or invalid email' }), { status: 400 });
    }
    if (!conversationId) {
      return new Response(JSON.stringify({ error: 'Missing conversationId' }), { status: 400 });
    }

    const db = await getDb();
    // Ensure indexes for faster queries
    await db.collection('messages').createIndex({ conversationId: 1, createdAt: 1 });
    await db.collection('conversations').createIndex({ email: 1, updatedAt: -1 });

    // Verify user has access to this conversation
    const conversation = await db.collection('conversations').findOne({ _id: new ObjectId(conversationId), email });
    if (!conversation) {
      return new Response(JSON.stringify({ error: 'Conversation not found or access denied' }), { status: 404 });
    }

    // Fetch messages for the conversation, sorted by creation time
    const messages = await db.collection('messages').find({ conversationId: new ObjectId(conversationId) }).sort({ createdAt: 1 }).toArray();

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

    const now = new Date();
    // Prepare messages to be inserted as individual documents
    const messagesToInsert = messages.map(msg => ({
      ...msg,
      conversationId: convId,
      email, // Associate message with the user for potential future access control
      createdAt: now,
      updatedAt: now,
    }));

    if (messagesToInsert.length > 0) {
      await db.collection('messages').insertMany(messagesToInsert);
    }

    await db.collection('conversations').updateOne({ _id: convId }, { $set: { updatedAt: now }, $setOnInsert: { createdAt: now, email } });
    return new Response(JSON.stringify({ ok: true, conversationId: String(convId) }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
}
