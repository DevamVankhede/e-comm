"use client";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCartStore, CartStore } from "@/app/store/cartStore";
import { useEffect, useState } from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const items = useCartStore((state: CartStore) => state.items);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = () => {
      fetch("/api/auth/me")
        .then((r) =>
          r.ok ? r.json() : Promise.resolve({ authenticated: false })
        )
        .then((json) => {
          if (!cancelled) setIsAuthenticated(Boolean(json?.authenticated));
        })
        .catch(() => {
          if (!cancelled) setIsAuthenticated(false);
        });
    };

    checkAuth();
    const onAuthChanged = () => checkAuth();
    const onFocus = () => checkAuth();
    window.addEventListener("authChanged", onAuthChanged as EventListener);
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.removeEventListener("authChanged", onAuthChanged as EventListener);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("authChanged"));
        window.location.reload();
      }
    } catch {}
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-white hover:text-gray-300 font-medium">
          Home
        </Link>
        <Link
          href="/Product"
          className="text-white hover:text-gray-300 font-medium"
        >
          Products
        </Link>
        {!isAuthenticated && (
          <>
            <Link
              href="/Login"
              className="text-white hover:text-gray-300 font-medium"
            >
              Login
            </Link>
            <Link
              href="/Signup"
              className="text-white hover:text-gray-300 font-medium"
            >
              Signup
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Link href="/Cart" className="relative inline-block mt-4 lg:mt-0">
          <ShoppingCartIcon className="size-6 text-white" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          )}
        </Link>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            title="Logout"
            className="mt-4 lg:mt-0 inline-flex items-center justify-center text-white hover:text-gray-300"
          >
            <ArrowRightOnRectangleIcon className="size-6" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
