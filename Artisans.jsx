import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import artisansData from '../data/artisans.json';

const Artisans = () => {
  const [artisans, setArtisans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setArtisans(artisansData);
  }, []);

  const handleViewProducts = (artisanId) => {
    navigate(`/products?artisan=${artisanId}`);
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Artisans
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet the talented craftspeople behind our beautiful handloom products.
            Each artisan brings years of experience and passion to their work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artisans.map((artisan) => (
            <div key={artisan.id} className="card">
              <div className="relative">
                <img
                  src={artisan.image}
                  alt={artisan.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 font-semibold">{artisan.rating}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {artisan.name}
                </h3>
                <p className="text-gray-600 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {artisan.location}
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {artisan.description}
                </p>
                <button
                  onClick={() => handleViewProducts(artisan.id)}
                  className="btn-primary w-full"
                >
                  View Products
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Artisans;


