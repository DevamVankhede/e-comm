// Read-only GraphQL queries

export const QUERY_PRODUCTS = `
  query Products($first: Int!, $channel: String!) {
    products(first: $first, channel: $channel) {
      edges {
        node { id name media { url } }
      }
    }
  }
`;

export const QUERY_PRODUCT_DETAIL = `
  query ProductDetail($id: ID, $slug: String, $channel: String!) {
    product(id: $id, slug: $slug, channel: $channel) {
      id
      name
      description
      thumbnail { url }
      media { url }
      pricing { priceRange { start { gross { amount currency } } stop { gross { amount currency } } } }
      defaultVariant { id pricing { price { gross { amount currency } } } quantityAvailable }
      variants { id quantityAvailable }
    }
  }
`;
