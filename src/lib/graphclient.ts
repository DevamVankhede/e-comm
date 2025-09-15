import { GraphQLClient } from "graphql-request";

const endpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
  "https://saleor.kombee.co.in/graphql/";

export const client = new GraphQLClient(endpoint, {
  headers: {
    "Content-Type": "application/json",
  },
});
