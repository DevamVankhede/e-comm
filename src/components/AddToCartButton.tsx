// src/components/AddToCartButton.tsx
"use client";

import React, { useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { addToCart } from "@/lib/cart";
import { useCartStore } from "@/app/store/cartStore";

interface AddToCartButtonProps {
  readonly variantId?: string;
  readonly productName?: string;
  readonly price?: number;
  readonly image?: string;
  readonly availableQuantity?: number;
}

export default function AddToCartButton({
  variantId,
  productName,
  price,
  image,
  availableQuantity = 0,
}: Readonly<AddToCartButtonProps>) {
  const [loading, setLoading] = useState(false);
  const addToCartStore = useCartStore((state) => state.addToCart);

  async function handleAdd() {
    if (!variantId) {
      alert("Unable to add: variant id missing");
      return;
    }
    try {
      setLoading(true);
      // Require authentication before adding to cart
      const me = await fetch("/api/auth/me")
        .then((r) => r.json())
        .catch(() => ({ authenticated: false }));
      if (!me?.authenticated) {
        alert("Please log in to add items to your cart.");
        window.location.href = "/Login";
        return;
      }
      const checkout = await addToCart(variantId, 1);

      // Also add to Zustand store for cart badge
      if (productName && price) {
        addToCartStore({
          id: variantId,
          name: productName,
          price: price.toString(),
          image: image || "",
        });
      }

      // small UX feedback - you can replace with toast
      alert("Added to cart ✅");
      // Inform other parts of app already done by addToCart via 'checkoutUpdated' event.
      // Optionally redirect: window.location.href = "/Cart";
      console.log("checkout:", checkout);
    } catch (err: unknown) {
      console.error("Add to cart failed:", err);
      let errorMessage = "Unknown error";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      // Handle specific error cases
      if (errorMessage.includes("Only 0 remaining in stock")) {
        alert("❌ Sorry, this item is currently out of stock!");
      } else if (errorMessage.includes("remaining in stock")) {
        alert("❌ Not enough stock available for this item!");
      } else if (errorMessage.includes("variant id missing")) {
        alert("❌ Unable to add item - product variant not found!");
      } else {
        alert("❌ Add to cart failed: " + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  const isOutOfStock = !availableQuantity || availableQuantity <= 0;

  return (
    <button
      onClick={handleAdd}
      disabled={loading || isOutOfStock}
      className={`mt-5 px-5 py-2 text-white font-bold rounded-xl inline-flex items-center space-x-2 transition duration-300 ${
        isOutOfStock
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gray-950 hover:bg-gray-800"
      }`}
    >
      <span>
        {loading ? "Adding..." : isOutOfStock ? "Out of stock" : "Add to cart"}
      </span>
      <ShoppingCartIcon className="h-5 w-5" />
    </button>
  );
}
