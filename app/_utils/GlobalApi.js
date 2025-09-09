import { gql, request } from "graphql-request";

const MASTER_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
const HYGRAPH_TOKEN = process.env.NEXT_PUBLIC_HYGRAPH_TOKEN;

if (!MASTER_URL) {
  console.error("NEXT_PUBLIC_BACKEND_API_URL is not defined.");
}
if (!HYGRAPH_TOKEN) {
  // Optional; only required for private content
}

const authHeaders = HYGRAPH_TOKEN ? { Authorization: `Bearer ${HYGRAPH_TOKEN}` } : undefined;


/**
 * Fetch featured food items with type(s), about, image and slug.
 */
export async function getFoodItems() {
  const query = gql`
    query foodtypes {
      fooditems {
        types
        about
        image { url }
        slug
      }
    }
  `;

  return request(MASTER_URL, query, undefined, authHeaders);
}

/**
 * Fetch type entries by their own slug.
 */
export async function getTypesBySlug(slug) {
  const query = gql`
    query foodtypes($slug: String!) {
      typoffoods(where: { slug: $slug }) {
        names
        slug
        foodimg { url }
      }
    }
  `;
  const variables = { slug };
  return request(MASTER_URL, query, variables, authHeaders);
}

/**
 * Fetch type entries that contain a given food item (by item slug).
 */
export async function getTypesByItemSlug(itemSlug) {
  const query = gql`
    query MyQuery2($itemSlug: String!) {
      typoffoods(where: { fooditems_some: { slug: $itemSlug } }) {
        foodimg { url }
        names
        slug
      }
    }
  `;
  const variables = { itemSlug };
  return request(MASTER_URL, query, variables, authHeaders);
}

/**
 * Fetch all type entries.
 */
export async function getAllTypes() {
  const query = gql`
    query AllTypes {
      typoffoods {
        foodimg { url }
        names
        slug
      }
    }
  `;
  return request(MASTER_URL, query, undefined, authHeaders);
}

/**
 * Generate a recipe via Gemini using our API proxy.
 */
export async function generateRecipe(prompt) {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) {
    throw new Error('Failed to generate recipe');
  }
  return res.json();
}

/**
 * Generate food images via Imagen using our API proxy.
 */
export async function generateFoodImages(prompt, { aspectRatio = '1:1', numberOfImages = 1 } = {}) {
  const res = await fetch('/api/gemini/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, aspectRatio, numberOfImages }),
  });
  let data;
  try {
    data = await res.json();
  } catch (e) {
    if (!res.ok) throw new Error('Failed to generate images');
    throw e;
  }
  if (!res.ok) {
    const detail = typeof data === 'object' ? (data.detail || data.error) : undefined;
    throw new Error(detail || 'Failed to generate images');
  }
  return data;
}

/**
 * Load saved chat messages for the given email.
 */
export async function getUserChats(email, conversationId) {
  const url = new URL('/api/chats', window.location.origin);
  if (email) url.searchParams.set('email', email);
  if (conversationId) url.searchParams.set('conversationId', conversationId);
  const res = await fetch(url.toString(), { method: 'GET' });
  let payload;
  try { payload = await res.json(); } catch {}
  if (!res.ok) {
    const detail = payload?.error || payload?.detail || `HTTP ${res.status}`;
    throw new Error(`Failed to load chats: ${detail}`);
  }
  return payload;
}

/**
 * Append new messages to the user's chat history.
 */
export async function saveUserChats(messages, email, conversationId, titleHint) {
  const res = await fetch('/api/chats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, email, conversationId, titleHint }),
  });
  let payload;
  try { payload = await res.json(); } catch {}
  if (!res.ok) {
    const detail = payload?.error || payload?.detail || `HTTP ${res.status}`;
    throw new Error(`Failed to save chats: ${detail}`);
  }
  return payload;
}

export async function listConversations(email) {
  const url = new URL('/api/conversations', window.location.origin);
  if (email) url.searchParams.set('email', email);
  const res = await fetch(url.toString(), { method: 'GET' });
  const payload = await res.json();
  if (!res.ok) throw new Error(payload?.error || 'Failed to list conversations');
  return payload;
}

export async function createConversation(email, title) {
  const res = await fetch('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, title }),
  });
  const payload = await res.json();
  if (!res.ok) throw new Error(payload?.error || 'Failed to create conversation');
  return payload;
}

export async function deleteConversation(email, conversationId) {
  const url = new URL('/api/conversations', window.location.origin);
  if (email) url.searchParams.set('email', email);
  if (conversationId) url.searchParams.set('conversationId', conversationId);
  const res = await fetch(url.toString(), { method: 'DELETE' });
  const payload = await res.json();
  if (!res.ok) throw new Error(payload?.error || 'Failed to delete conversation');
  return payload;
}

// Friends API helpers
export async function requestFriend(fromEmail, toEmail) {
  const res = await fetch('/api/friends/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fromEmail, toEmail }) });
  const payload = await res.json();
  if (!res.ok) throw new Error(payload?.error || 'Failed to send request');
  return payload;
}

export async function acceptFriend(email, fromEmail) {
  const res = await fetch('/api/friends/accept', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, fromEmail }) });
  const payload = await res.json();
  if (!res.ok) throw new Error(payload?.error || 'Failed to accept request');
  return payload;
}

export async function listFriends(email) {
  const url = new URL('/api/friends/list', window.location.origin);
  url.searchParams.set('email', email);
  const res = await fetch(url.toString());
  const payload = await res.json();
  if (!res.ok) throw new Error(payload?.error || 'Failed to list friends');
  return payload;
}

export async function listPending(email) {
  const url = new URL('/api/friends/pending', window.location.origin);
  url.searchParams.set('email', email);
  const res = await fetch(url.toString());
  const payload = await res.json();
  if (!res.ok) throw new Error(payload?.error || 'Failed to list pending');
  return payload;
}

