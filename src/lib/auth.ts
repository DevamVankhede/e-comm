export const AUTH_COOKIE_NAME = "authToken";

export const graphqlEndpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
  "https://saleor.kombee.co.in/graphql/";

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string): boolean {
  return typeof password === "string" && password.length >= 5;
}
