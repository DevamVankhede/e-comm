import Link from "next/link";
import React from "react";

// The main App component containing the entire page layout.
// All components, logic, and styling are in this single file.
export default function App() {
  const bannerImageUrl =
    "https://images.unsplash.com/photo-1628003613695-1e3a6c9053d2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const bannerImageAlt =
    "A close-up of a diamond ring and other sparkling jewellery on a dark surface.";

  return (
    <div className="bg-gray-950 min-h-screen font-sans antialiased text-gray-100">
      {/* Hero Section */}
      <section className="relative w-full max-w-full lg:max-w-7xl h-[60vh] md:h-[70vh] rounded-none lg:rounded-3xl overflow-hidden shadow-2xl mx-auto mt-0 lg:mt-8 flex items-center justify-center">
        <img
          src={bannerImageUrl}
          alt={bannerImageAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight tracking-wide animate-fade-in-down">
            Adorn Yourself in Elegance
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl font-light animate-fade-in-up">
            Explore our exquisite collection of hand-crafted jewellery for every
            occasion.
          </p>
          <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
            <Link href="./Product"> Shop Now </Link>
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="flex flex-col items-center p-8">
        <div className="max-w-4xl w-full bg-gray-900 rounded-3xl shadow-xl p-8 transform -translate-y-12">
          <h2 className="text-3xl text-gray-100 font-bold mb-4 text-center">
            Welcome to Our Jewellery Collection
          </h2>
          <p className="text-gray-300 text-center text-lg leading-relaxed">
            Every piece tells a story. From timeless classics to modern
            statements, find the perfect accessory to express your unique style.
            We use only the finest materials and meticulous craftsmanship to
            ensure each piece is as beautiful and unique as you are.
          </p>
        </div>

        {/* Additional Content Section */}
        <div className="mt-8 max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-amber-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.596 3-9s-1.343-9-3-9m0 18a9 9 0 009-9m-9 9c-1.657 0-3-4.596-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Timeless Designs
            </h3>
            <p className="text-gray-300 text-center">
              Our collection features classic pieces that will never go out of
              style.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-amber-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Quality Craftsmanship
            </h3>
            <p className="text-gray-300 text-center">
              Each item is meticulously crafted by skilled artisans for lasting
              beauty.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-amber-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Ethical Sourcing
            </h3>
            <p className="text-gray-300 text-center">
              We are committed to using ethically sourced materials in all our
              products.
            </p>
          </div>
        </div>
      </div>

      {/* Tailwind CSS and other scripts */}
      <style>
        {`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.5s;
          animation-fill-mode: backwards;
        }

        .font-sans {
          font-family: 'Inter', sans-serif;
        }
        `}
      </style>
    </div>
  );
}
