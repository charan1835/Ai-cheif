import { gql, request } from "graphql-request";

const MASTER_URL = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;

export const getRecipes = async () => {
  const query = gql`
    query MyQuery2 {
      recipies {
        name
        fulldetails
        recipie
        image {
          url
        }
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

export const uploadImage = async (image) => {
  const formData = new FormData();
  formData.append("fileUpload", image);

  const response = await fetch(MASTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HYGRAPH_AUTH_TOKEN}`,
    },
    body: formData,
  });

  const result = await response.json();
  return result.id;
};

export const createAndPublishRecipe = async (recipeData) => {
  const mutation = gql`
    mutation createAndPublishRecipie($data: RecipieCreateInput!) {
      createRecipie(data: $data) {
        id
      }
    }
  `;

  const publishMutation = gql`
    mutation publishRecipie($id: ID!) {
      publishRecipie(where: { id: $id }, to: PUBLISHED) {
        id
      }
    }
  `;

  try {
    const createResult = await request(MASTER_URL, mutation, { data: recipeData });
    const recipeId = createResult.createRecipie.id;
    await request(MASTER_URL, publishMutation, { id: recipeId });
    return recipeId;
  } catch (error) {
    console.error("Error creating and publishing recipe:", error);
    throw error;
  }
};