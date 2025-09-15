"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/app/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { items, removeFromCart, clearCart } = useCartStore();
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get checkout ID from localStorage
    const storedCheckoutId = localStorage.getItem("checkoutId");
    if (storedCheckoutId) {
      setCheckoutId(storedCheckoutId);
      // You could fetch checkout details here if needed
    }
  }, []);

  const totalPrice = items.reduce((sum, item) => {
    return sum + parseFloat(item.price) * item.qty;
  }, 0);

  const formatINR = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    clearCart();
    localStorage.removeItem("checkoutId");
    localStorage.removeItem("checkoutToken");
    setCheckoutId(null);
  };

  const handleProceedToCheckout = async () => {
    if (placingOrder) return;
    setPlacingOrder(true);
    try {
      // Here you would normally call your checkout complete endpoint.
      // For now, simulate success: clear local state and show success message.
      handleClearCart();
      setOrderSuccess(true);
      // Redirect to Products after a brief delay
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8 text-center">
          {orderSuccess && (
            <div className="mb-6 rounded-md bg-green-50 p-4 border border-green-200">
              <p className="text-green-800 font-medium">
                Order placed successfully! Redirecting to Home...
              </p>
            </div>
          )}
          <h1 className="text-3xl font-extrabold mb-2 text-black">Your cart is empty</h1>
          <p className="text-gray-600">
            Looks like you haven’t added anything yet.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-white">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-red-400 hover:text-red-300 flex items-center gap-2 border border-red-500/30 px-3 py-1.5 rounded-md"
        >
          <TrashIcon className="h-5 w-5" />
          Clear Cart
        </button>
      </div>

      {orderSuccess && (
        <div className="mb-6 rounded-md bg-green-50 p-4 border border-green-200">
          <p className="text-green-800 font-medium">
            Order placed successfully! Redirecting to Products...
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-5 bg-gray-900 border border-gray-800 rounded-xl shadow-sm hover:shadow transition text-gray-100"
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover border border-gray-700"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-white">
                    {item.name}
                  </h3>
                  <p className="text-gray-400 text-sm">Quantity: {item.qty}</p>
                  <p className="text-lg font-bold mt-1 text-green-400">
                    {formatINR(parseFloat(item.price) * item.qty)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-400 hover:text-red-300 p-2 rounded-md border border-red-500/30"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Summary */}
        <div className="md:col-span-1">
          <div className="bg-gray-900 p-6 rounded-xl shadow border border-gray-800 text-gray-100">
            <h2 className="text-xl font-bold mb-4 text-white">Order Summary</h2>
            <div className="space-y-3 mb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">
                  Subtotal ({items.length} items)
                </span>
                <span className="text-white">{formatINR(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span className="text-white">Free</span>
              </div>
              <div className="border-t border-gray-800 pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-gray-300">Total</span>
                  <span className="text-white">{formatINR(totalPrice)}</span>
                </div>
              </div>
            </div>

            {checkoutId && (
              <div className="mb-4 p-3 bg-gray-800 rounded border border-gray-700">
                <p className="text-xs text-gray-300 mb-1">Checkout ID</p>
                <div className="text-sm font-mono text-blue-300 break-all overflow-hidden">
                  {checkoutId}
                </div>
              </div>
            )}

            <button
              onClick={handleProceedToCheckout}
              disabled={placingOrder}
              className={`w-full text-white py-3 rounded-lg font-semibold transition ${
                placingOrder
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {placingOrder ? "Placing order..." : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
