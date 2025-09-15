"use client";

import { useState } from "react";
import { isStrongPassword, isValidEmail } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) return setError("Enter a valid email");
    if (!isStrongPassword(password))
      return setError("Password must be at least 5 chars");
    if (password !== confirm) return setError("Passwords do not match");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Signup failed");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("authChanged"));
      }
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6 text-white">
        Create account
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-xl border border-gray-800"
      >
        {error && (
          <div className="mb-4 rounded bg-red-50 border border-red-200 px-3 py-2 text-red-700">
            {error}
          </div>
        )}
        <label htmlFor="email" className="block text-gray-300 text-sm mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
          placeholder="you@example.com"
          required
        />
        <label htmlFor="password" className="block text-gray-300 text-sm mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
          placeholder="Minimum 5 characters"
          required
        />
        <label htmlFor="confirm" className="block text-gray-300 text-sm mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirm"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full mb-6 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
          placeholder="Re-enter password"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white font-semibold ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}
