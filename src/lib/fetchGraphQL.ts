import { client } from "./graphclient";

interface ProductMedia {
  url: string;
}

interface ProductNode {
  id: string;
  name: string;
  media: ProductMedia[];
}

export interface ProductEdge {
  node: ProductNode;
}

interface GraphQLResponse {
  products: {
    edges: ProductEdge[];
  };
}

export async function fetchGraphQL<T = GraphQLResponse>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  // graphql-request client supports passing variables via request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (client as any).request(query, variables);
}
