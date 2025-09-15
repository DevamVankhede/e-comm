import { fetchGraphQL } from "@/lib/fetchGraphQL";
import { QUERY_PRODUCT_DETAIL } from "@/graphql/queries";
import AddToCartButton from "@/components/AddToCartButton";
import Image from "next/image";
import Link from "next/link";

type Props = Readonly<{ params: Promise<Readonly<{ id: string }>> }>;

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const id = decodeURIComponent(resolvedParams.id);

  const safeQuery = QUERY_PRODUCT_DETAIL;

  let data;
  try {
    data = await fetchGraphQL(safeQuery, { id, channel: "online-inr" });
  } catch (error) {
    console.error(
      "Primary product query failed, retrying without pricing...",
      error
    );
    // Fallback to a minimal query without pricing fields if pricing fails
    const fallbackQuery = `
      query ProductBasic($id: ID, $channel: String!) {
        product(id: $id, channel: $channel) {
          id
          name
          description
          thumbnail { url }
          media { url }
          defaultVariant { id }
          variants { id }
        }
      }
    `;
    try {
      data = await fetchGraphQL(fallbackQuery, { id, channel: "online-inr" });
    } catch (fallbackError) {
      console.error("Fallback product query also failed:", fallbackError);
      return (
        <div className="p-6 text-center">
          Error loading product. Please try again.
        </div>
      );
    }
  }
  interface ProductResponseVariant {
    id: string;
    pricing?: {
      price?: { gross?: { amount?: number; currency?: string } | null } | null;
    } | null;
    quantityAvailable?: number | null;
  }
  interface ProductResponseMedia {
    url: string;
  }
  interface ProductResponseProduct {
    id: string;
    name: string;
    description?: string | null;
    thumbnail?: { url: string } | null;
    media?: ProductResponseMedia[] | null;
    pricing?: {
      priceRange?: {
        start?: {
          gross?: { amount?: number; currency?: string } | null;
        } | null;
        stop?: { gross?: { amount?: number; currency?: string } | null } | null;
      } | null;
    } | null;
    defaultVariant?: ProductResponseVariant | null;
    variants?: ProductResponseVariant[] | null;
  }
  interface ProductResponse {
    product?: ProductResponseProduct | null;
  }

  const p = (data as unknown as ProductResponse)?.product;
  if (!p) return <div>Product not found</div>;

  const convertDescriptionToHtml = (description?: string | null): string => {
    try {
      const data = JSON.parse(description || "");
      return `<p>${data.blocks[0].data.text}</p>`;
    } catch {
      return description || "";
    }
  };

  // Compute price from variant or product pricing (fallback to 0/INR)
  const variantPrice = p?.defaultVariant?.pricing?.price?.gross?.amount;
  const variantCurrency = p?.defaultVariant?.pricing?.price?.gross?.currency;
  const productPriceStart = p?.pricing?.priceRange?.start?.gross?.amount;
  const productCurrency = p?.pricing?.priceRange?.start?.gross?.currency;

  const rawPriceCandidate =
    (typeof variantPrice === "number" ? variantPrice : undefined) ??
    (typeof productPriceStart === "number" ? productPriceStart : undefined);

  const numericPrice =
    typeof rawPriceCandidate === "number" && isFinite(rawPriceCandidate)
      ? rawPriceCandidate
      : 0;

  const price: number = Math.max(0, numericPrice);
  const currency: string = variantCurrency || productCurrency || "INR";
  const image: string | null = p?.media?.[0]?.url || p?.thumbnail?.url || null;
  const variantId: string | undefined =
    p?.defaultVariant?.id || p?.variants?.[0]?.id;
  const availableQuantity: number =
    (p?.defaultVariant?.quantityAvailable ??
      p?.variants?.[0]?.quantityAvailable ??
      0) ||
    0;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/Product" className="hover:text-gray-700">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{p.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-lg shadow">
        <div>
          <Image
            src={image || "/images/1.avif"}
            alt={p.name}
            width={1200}
            height={1200}
            className="w-full h-auto rounded-xl shadow-lg"
          />

          {p.media && p.media.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {p.media.slice(0, 6).map((m, idx) => (
                <Image
                  key={`${m.url}-${idx}`}
                  src={m.url}
                  alt={`${p.name} ${idx + 1}`}
                  width={84}
                  height={84}
                  className="h-20 w-20 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between">
            <h1 className="text-4xl font-extrabold text-black leading-tight">
              {p.name}
            </h1>
            <span
              className={`ml-4 px-3 py-1 text-xs font-semibold rounded-full ${
                availableQuantity > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {availableQuantity > 0 ? "In stock" : "Out of stock"}
            </span>
          </div>

          <div className="mt-4 bg-gray-50 border rounded-lg p-4 inline-block">
            <p className="text-3xl font-bold text-green-600">
              {price > 0
                ? `${currency === "INR" ? "₹" : currency} ${price.toFixed(2)}`
                : "Price unavailable"}
            </p>
            {price > 0 && (
              <p className="text-xs text-gray-500">Inclusive of all taxes</p>
            )}
          </div>

          <div className="mt-6 text-black">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: convertDescriptionToHtml(p.description),
              }}
            />
          </div>

          <div className="mt-6">
            <AddToCartButton
              variantId={variantId}
              productName={p.name}
              price={price}
              image={image || undefined}
              availableQuantity={availableQuantity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
