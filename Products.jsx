import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';
import artisansData from '../data/artisans.json';
import { useCart } from '../hooks/useCart';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const filterProducts = (search, category, artisanId = null, productsList = products) => {
    let filtered = [...productsList];

    // Filter by artisan
    if (artisanId) {
      filtered = filtered.filter((p) => p.artisanId === artisanId);
    }

    // Filter by category
    if (category !== 'All') {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Filter by search term
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  useEffect(() => {
    // Load products from localStorage or use default data
    const storedProducts = localStorage.getItem('products');
    const productsToUse = storedProducts ? JSON.parse(storedProducts) : productsData;
    
    setProducts(productsToUse);
    
    // Check if artisan filter is in URL
    const artisanId = searchParams.get('artisan');
    if (artisanId) {
      const artisan = artisansData.find((a) => a.id === parseInt(artisanId));
      if (artisan) {
        setSelectedArtisan(artisan);
        filterProducts('', 'All', parseInt(artisanId), productsToUse);
      } else {
        setFilteredProducts(productsToUse);
      }
    } else {
      setFilteredProducts(productsToUse);
    }
  }, [searchParams]);

  // Listen for storage changes to update products
  useEffect(() => {
    const handleStorageChange = () => {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        const productsToUse = JSON.parse(storedProducts);
        setProducts(productsToUse);
        filterProducts(searchTerm, selectedCategory, selectedArtisan?.id || null, productsToUse);
      }
    };

    // Check localStorage on interval for same-tab updates
    const interval = setInterval(() => {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        const productsToUse = JSON.parse(storedProducts);
        if (JSON.stringify(productsToUse) !== JSON.stringify(products)) {
          setProducts(productsToUse);
          filterProducts(searchTerm, selectedCategory, selectedArtisan?.id || null, productsToUse);
        }
      }
    }, 1000);

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [searchTerm, selectedCategory, selectedArtisan, products]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterProducts(value, selectedCategory, selectedArtisan?.id || null);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterProducts(searchTerm, category, selectedArtisan?.id || null);
  };

  const handleClearArtisanFilter = () => {
    setSelectedArtisan(null);
    navigate('/products');
    filterProducts(searchTerm, selectedCategory, null);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Products
          </h1>
          {selectedArtisan && (
            <div className="bg-primary-100 border border-primary-300 rounded-lg p-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Filtered by Artisan:</p>
                <p className="font-semibold text-gray-800">{selectedArtisan.name}</p>
              </div>
              <button
                onClick={handleClearArtisanFilter}
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <input
                type="text"
                placeholder="Search by name, description, or category..."
                value={searchTerm}
                onChange={handleSearch}
                className="input-field"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="input-field"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCardClick={handleProductClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No products found matching your criteria.</p>
          </div>
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  <div>
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-2xl font-bold text-primary-600 mb-4">
                      ₹{selectedProduct.price.toLocaleString()}
                    </p>
                    <div className="mb-4">
                      <span className="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold mr-2">
                        {selectedProduct.category}
                      </span>
                      {artisansData.find((a) => a.id === selectedProduct.artisanId) && (
                        <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">
                          By {artisansData.find((a) => a.id === selectedProduct.artisanId).name}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                    {selectedProduct.stock !== undefined && (
                      <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-1">Stock Available:</p>
                        <p className={`text-lg font-semibold ${
                          selectedProduct.stock > 10 
                            ? 'text-green-600' 
                            : selectedProduct.stock > 0 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                        }`}>
                          {selectedProduct.stock} {selectedProduct.stock === 1 ? 'item' : 'items'} in stock
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        alert(`${selectedProduct.name} added to cart!`);
                        closeModal();
                      }}
                      disabled={!selectedProduct.inStock || (selectedProduct.stock !== undefined && selectedProduct.stock === 0)}
                      className="btn-primary w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

