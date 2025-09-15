
type CheckoutResp = {
  id: string;
  token?: string;
  lines?: CheckoutLine[];
};

interface GraphQLError {
  message: string;
  field?: string;
}

interface GraphQLResponseBase {
  errors?: GraphQLError[];
}

interface CheckoutLine {
  id: string;
  quantity: number;
  variant: { id: string; name: string; sku: string };
}

interface CheckoutCreateInput {
  channel: string;
  email: string;
  lines: { variantId: string; quantity: number }[];
  [key: string]: unknown; // Add index signature
}

interface CheckoutLinesAddInput {
  checkoutId: string;
  lines: { variantId: string; quantity: number }[];
  [key: string]: unknown; // Add index signature
}

const CHECKOUT_CREATE = `
  mutation CheckoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        token
        lines {
          id
          quantity
          variant { id name sku }
        }
      }
      errors { field message }
    }
  }
  `;

const CHECKOUT_LINES_ADD = `
  mutation CheckoutLinesAdd($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {
    checkoutLinesAdd(checkoutId: $checkoutId, lines: $lines) {
      checkout {
        id
        token
        lines {
          id
          quantity
          variant { id name sku }
        }
      }
      errors { field message }
    }
  }
  `;

function graphqlFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const endpoint =
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
    "https://saleor.kombee.co.in/graphql/";
  return fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  })
    .then((r) => r.json())
    .then((json: T & GraphQLResponseBase) => {
      if (json.errors) {
        throw new Error(json.errors.map((e) => e.message).join(", "));
      }
      return json;
    });
}

async function createCheckout(
  variantId: string,
  quantity: number,
  email: string
): Promise<CheckoutResp> {
  const variables: CheckoutCreateInput = {
    channel: "online-inr",
    email,
    lines: [{ variantId, quantity }],
  };

  const json = await graphqlFetch<{
    data: {
      checkoutCreate: { checkout: CheckoutResp; errors: GraphQLError[] };
    };
  }>(CHECKOUT_CREATE, { input: variables as Record<string, unknown> });
  const resp = json.data?.checkoutCreate;
  if (resp?.errors?.length) throw new Error(resp.errors[0].message);

  const checkout: CheckoutResp = resp.checkout;
  localStorage.setItem("checkoutId", checkout.id);
  if (checkout.token) localStorage.setItem("checkoutToken", checkout.token);
  if (typeof window !== "undefined")
    window.dispatchEvent(
      new CustomEvent("checkoutUpdated", { detail: checkout })
    );
  return checkout;
}

async function addLinesToExistingCheckout(
  checkoutId: string,
  variantId: string,
  quantity: number
): Promise<CheckoutResp> {
  const variables: CheckoutLinesAddInput = {
    checkoutId: checkoutId,
    lines: [{ variantId, quantity }],
  };

  const json = await graphqlFetch<{
    data: {
      checkoutLinesAdd: { checkout: CheckoutResp; errors: GraphQLError[] };
    };
  }>(CHECKOUT_LINES_ADD, variables as Record<string, unknown>);
  const resp = json.data?.checkoutLinesAdd;
  if (resp?.errors?.length) throw new Error(resp.errors[0].message);

  const checkout: CheckoutResp = resp.checkout;
  if (typeof window !== "undefined")
    window.dispatchEvent(
      new CustomEvent("checkoutUpdated", { detail: checkout })
    );
  return checkout;
}


export async function addToCart(
  variantId: string,
  quantity = 1,
  email = "guest@example.com"
): Promise<CheckoutResp> {
  if (!variantId) throw new Error("variantId is required");

  try {
    const existingCheckoutId =
      typeof window !== "undefined" ? localStorage.getItem("checkoutId") : null;

    if (!existingCheckoutId) {
      return await createCheckout(variantId, quantity, email);
    } else {
      return await addLinesToExistingCheckout(
        existingCheckoutId,
        variantId,
        quantity
      );
    }
  } catch (err: unknown) {
    console.error("Error in addToCart:", err);
    let errorMessage = "Unknown error";
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === "string") {
      errorMessage = err;
    } else if (
      typeof err === "object" &&
      err !== null &&
      "message" in err &&
      typeof (err as { message?: unknown }).message === "string"
    ) {
      errorMessage = (err as { message: string }).message;
    }
    throw new Error(`Failed to add to cart: ${errorMessage}`); // Re-throw the error so the caller can handle it
  }
}
