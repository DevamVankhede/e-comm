"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchGraphQL, ProductEdge } from "@/lib/fetchGraphQL";
import { QUERY_PRODUCTS } from "@/graphql/queries";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState<ProductEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getProducts() {
      try {
        const data = await fetchGraphQL<{ products: { edges: ProductEdge[] } }>(
          QUERY_PRODUCTS,
          { first: 20, channel: "online-inr" }
        );
        console.log("Products data:", data);

        if (data?.products?.edges) {
          setProducts(data.products.edges);
        } else {
          setError("No products found in response");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, []);

  if (loading) {
    return (
      <main className="p-6 flex justify-center items-center h-screen">
        <div className="diamondCon">
          <ul className="diamond">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          {/* <div className="textCon">Diamond Loader</div> */}
        </div>
        <style>{`
         
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
}

html,
body {
  margin: 0;
  padding: 0;
  background-color: #000;
}

.diamondCon {
  width: 200px;
  height: 200px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  margin: auto;
}

.diamond {
  display: block;
  width: 200px;
  height: 200px;
  position: relative;
}

.diamond li {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  opacity: 0;
  z-index: 100;
  transition: 400ms ease;
}

.diamond li:nth-child(1) {
  border-width: 20px 20px 0 20px;
  border-color: #7AD997 transparent transparent transparent;
  left: 0;
  right: 0;
  margin: auto;
  animation: traingle1 200ms 2.2s ease, opacity 2s 2.4s ease infinite;
  animation-fill-mode: forwards;
}

.diamond li:nth-child(2) {
  border-width: 0 20px 20px 20px;
  border-color: transparent transparent #64C592;
  left: 59px;
  animation: traingle2 200ms 1.8s ease, opacity 2s 2.4s ease infinite;
  animation-fill-mode: forwards;
}

.diamond li:nth-child(3) {
  border-width: 0 20px 20px 20px;
  border-color: transparent transparent #54B28D;
  right: 59px;
  animation: traingle3 200ms 2s ease, opacity 2s 2.4s ease infinite;
  animation-fill-mode: forwards;
}

.diamond li:nth-child(4) {
  border-width: 0 20px 20px 20px;
  border-width: 20px 20px 0 20px;
  border-color: #7AD997 transparent transparent transparent;
  animation: traingle4 200ms 1.6s ease, opacity 2s 2.6s ease infinite;
  animation-fill-mode: forwards;
}

.diamond li:nth-child(5) {
  border-width: 0 20px 20px 20px;
  border-width: 20px 20px 0 20px;
  border-color: #B4FEA5 transparent transparent transparent;
  animation: traingle5 200ms 1.4s ease, opacity 2s 2.6s ease infinite;
  animation-fill-mode: forwards;
}

.diamond li:nth-child(6) {
  border-width: 0 20px 20px 20px;
  border-color: transparent transparent #90EF9D;
  left: 0;
  right: 0;
  margin: auto;
  animation: traingle6 200ms 1.2s ease, opacity 2s 2.6s ease infinite;
  animation-fill-mode: forwards;
}

.diamond li:nth-child(7) {
  border-width: 20px 20px 0 20px;
  border-color: #C9FEAC transparent transparent transparent;
  left: 0;
  right: 0;
  margin: auto;
  animation: traingle7 200ms 1s ease, opacity 2s 2.8s ease infinite;
  animation-fill-mode: forwards;
}

.textCon {
  width: 200px;
  height: 50px;
  position: absolute;
  top: 0;
  text-align: center;
  line-height: 50px;
  font-size: 30px;
  font-family: Dancing Script;
  color: #fff;
  opacity: 0;
  animation: text 500ms 2.4s ease;
  animation-fill-mode: forwards;
}

@keyframes traingle1 {
  0% {
    top: -50px;
    opacity: 0;
  }
  100% {
    top: 0;
    opacity: 1;
  }
}

@keyframes traingle2 {
  0% {
    top: -50px;
    opacity: 0;
  }
  100% {
    top: 1px;
    opacity: 1;
  }
}

@keyframes traingle3 {
  0% {
    top: -50px;
    opacity: 0;
  }
  100% {
    top: 1px;
    opacity: 1;
  }
}

@keyframes traingle4 {
  0% {
    right: 59px;
    top: -33px;
    opacity: 0;
  }
  100% {
    right: 59px;
    top: 22px;
    opacity: 1;
  }
}

@keyframes traingle5 {
  0% {
    left: 59px;
    top: -33px;
    opacity: 0;
  }
  100% {
    left: 59px;
    top: 22px;
    opacity: 1;
  }
}

@keyframes traingle6 {
  0% {
    top: -33px;
    opacity: 0;
  }
  100% {
    top: 23px;
    opacity: 1;
  }
}

@keyframes traingle7 {
  0% {
    top: -10px;
    opacity: 0;
  }
  100% {
    top: 44px;
    opacity: 1;
  }
}

@keyframes opacity {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}

@keyframes text {
  0% {
    top: 0;
    opacity: 0;
  }
  100% {
    top: 70px;
    opacity: 1;
  }
}`}</style>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Products
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(({ node }) => (
          <Link key={node.id} href={`/Product/${node.id}`}>
            <div
              key={node.id}
              className="p-4 border rounded-lg shadow-lg flex flex-col items-center h-72 w-full "
            >
              <div className="mb-4 flex items-center justify-center w-40 h-40">
                <Image
                  src={node.media?.[0]?.url || "/images/1.avif"}
                  alt={node.name}
                  width={160}
                  height={160}
                  className="rounded-md object-cover w-40 h-40"
                />
              </div>
              <p
                className="text-lg font-semibold text-center px-2"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical" as unknown as undefined,
                  overflow: "hidden",
                }}
              >
                {node.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
