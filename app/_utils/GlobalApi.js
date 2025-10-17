/**
 * A helper function to make API requests and handle responses.
 * @param {string} url - The URL to fetch.
 * @param {object} options - The options for the fetch request.
 * @returns {Promise<any>} - The JSON response from the API.
 * @throws {Error} - If the fetch request fails.
 */
async function apiRequest(url, options = {}) {
  const res = await fetch(url, options);
  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload?.error || `Request failed with status ${res.status}`);
  }
  return payload;
}

/**
 * Generates a recipe by calling the Gemini API.
 * @param {string} prompt - The user's prompt for the recipe.
 * @returns {Promise<{text: string}>}
 */
export const generateRecipe = (prompt) => {
  return apiRequest('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
};

/**
 * Fetches the chat messages for a given user and conversation.
 * @param {string} email - The user's email.
 * @param {string} conversationId - The ID of the conversation.
 * @returns {Promise<any>}
 */
export const getUserChats = (email, conversationId) => {
  return apiRequest(`/api/chats?email=${encodeURIComponent(email)}&convId=${encodeURIComponent(conversationId)}`);
};

/**
 * Saves chat messages to the database.
 * @param {Array<object>} messages - The messages to save.
 * @param {string} email - The user's email.
 * @param {string} [conversationId] - The optional ID of the conversation.
 * @param {string} [title] - The optional title for a new conversation.
 * @returns {Promise<any>}
 */
export const saveUserChats = (messages, email, conversationId, title) => {
  return apiRequest('/api/chats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, email, conversationId, title }),
  });
};

/**
 * Lists all conversations for a user.
 * @param {string} email - The user's email.
 * @returns {Promise<any>}
 */
export const listConversations = (email) => {
  return apiRequest(`/api/conversations?email=${encodeURIComponent(email)}`);
};

/**
 * Creates a new conversation.
 * @param {string} email - The user's email.
 * @param {string} title - The title of the new conversation.
 * @returns {Promise<any>}
 */
export const createConversation = (email, title) => {
  return apiRequest('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, title }),
  });
};

/**
 * Deletes a conversation.
 * @param {string} email - The user's email.
 * @param {string} conversationId - The ID of the conversation to delete.
 * @returns {Promise<any>}
 */
export const deleteConversation = (email, conversationId) => {
  return apiRequest('/api/conversations', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, conversationId }),
  });
};

// --- Friend Connection APIs ---

export const requestFriend = (email, toEmail) => {
  return apiRequest('/api/friends/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, toEmail }),
  });
};

export const acceptFriend = (email, fromEmail) => {
  return apiRequest('/api/friends/accept', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, fromEmail }),
  });
};

export const listFriends = (email) => apiRequest(`/api/friends?email=${encodeURIComponent(email)}`);

export const listPending = (email) => apiRequest(`/api/friends/pending?email=${encodeURIComponent(email)}`);