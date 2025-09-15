export default function Loading() {
    return (
      <main className="p-8 flex flex-col items-center">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-6 animate-pulse">
          <div className="h-10 bg-gray-300 rounded w-1/2 mb-6"></div>
          <div className="w-96 h-96 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </main>
    );
  }
  