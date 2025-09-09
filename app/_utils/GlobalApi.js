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

