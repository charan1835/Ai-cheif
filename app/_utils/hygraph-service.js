import { request, gql } from 'graphql-request';

const MASTER_URL = process.env.NEXT_PUBLIC_HYGRAPH_API_URL;

if (!MASTER_URL) {
  throw new Error("NEXT_PUBLIC_HYGRAPH_API_URL is not set in the environment variables.");
}

export const getFoodItems = async () => {
  const query = gql`
    query FoodItems {
      fooditems {
        about
        slug
        types
        image {
          url
        }
      }
    }
  `;
  return request(MASTER_URL, query);
};

export const getTypesByItemSlug = async (slug) => {
  const query = gql`
    query TypesByItemSlug($slug: String!) {
      typoffoods(where: { fooditem: { slug: $slug } }) {
        names
        slug
        foodimg {
          url
        }
      }
    }
  `;
  return request(MASTER_URL, query, { slug });
};

export const getAllTypes = async () => {
  const query = gql`
    query AllTypes {
      typoffoods {
        names
        slug
        foodimg {
          url
        }
      }
    }
  `;
  return request(MASTER_URL, query);
};

export const getRecipes = async () => {
  const query = gql`
    query Recipies {
      recipies {
        name
        fulldetails
        image {
          url
        }
      }
    }
  `;
  return request(MASTER_URL, query);
};