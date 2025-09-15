export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-6">About Our Store</h1>
      <p className="text-lg text-gray-500 mb-4">
        Welcome to MyStore, your one-stop shop for all your needs. We are
        dedicated to providing you with the best products and an unparalleled
        shopping experience.
      </p>
      <p className="text-lg text-gray-500 mb-6">
        Our mission is to offer a wide range of high-quality products at
        competitive prices, coupled with excellent customer service. We believe
        in making online shopping easy, enjoyable, and secure for everyone.
      </p>

      <h2 className="text-3xl font-bold text-white mb-4">Our Story</h2>
      <p className="text-lg text-gray-500 mb-6">
        Founded in 2025, MyStore started with a vision to revolutionize the
        e-commerce landscape. From humble beginnings, we have grown into a
        trusted platform, serving thousands of satisfied customers daily.
      </p>

      <h2 className="text-3xl font-bold text-white mb-4">Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-gray-500 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-white mb-2">
            Rajesh Kumar
          </h3>
          <p className="text-white">CEO & Founder</p>
        </div>
        <div className="bg-gray-500 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-white mb-2">
            Sanjay Kumar
          </h3>
          <p className="text-white">Chief Operating Officer</p>
        </div>
        <div className="bg-gray-500 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-white mb-2">Ravi Kumar</h3>
          <p className="text-white">Head of Marketing</p>
        </div>
      </div>
    </div>
  );
}
