import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productsData from '../data/products.json';
import artisansData from '../data/artisans.json';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: '',
    category: '',
    artisanId: '',
    description: '',
    inStock: true,
    stock: '',
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is owner/admin
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.isLoggedIn && (user.role === 'owner' || user.role === 'admin')) {
        setIsAuthorized(true);
      } else {
        // Not authorized, redirect to home
        alert('Access denied. Only owners can manage products.');
        navigate('/');
      }
    } else {
      // Not logged in, redirect to login
      alert('Please login to access this page.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // Only load products if authorized
    if (!isAuthorized) return;

    // Load products from localStorage or use default data
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(productsData);
      localStorage.setItem('products', JSON.stringify(productsData));
    }
  }, [isAuthorized]);

  const categories = ['Sarees', 'Kurtas', 'Accessories', 'Shawls', 'Shirts', 'Dresses', 'Home Decor', 'Bags'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.image)) {
      newErrors.image = 'Please enter a valid image URL';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.artisanId) {
      newErrors.artisanId = 'Artisan is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.stock && (isNaN(formData.stock) || parseInt(formData.stock) < 0)) {
      newErrors.stock = 'Stock must be a valid number greater than or equal to 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        image: product.image,
        price: product.price.toString(),
        category: product.category,
        artisanId: product.artisanId.toString(),
        description: product.description,
        inStock: product.inStock,
        stock: product.stock !== undefined ? product.stock.toString() : '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        image: '',
        price: '',
        category: '',
        artisanId: '',
        description: '',
        inStock: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      image: '',
      price: '',
      category: '',
      artisanId: '',
      description: '',
      inStock: true,
      stock: '',
    });
    setErrors({});
  };

  const handleCreate = () => {
    if (validateForm()) {
      const newProduct = {
        id: Date.now(),
        name: formData.name.trim(),
        image: formData.image.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        artisanId: parseInt(formData.artisanId),
        description: formData.description.trim(),
        inStock: formData.inStock,
        stock: formData.stock ? parseInt(formData.stock) : 0,
      };

      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      handleCloseModal();
      alert('Product created successfully!');
    }
  };

  const handleUpdate = () => {
    if (validateForm()) {
      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id
          ? {
              ...product,
              name: formData.name.trim(),
              image: formData.image.trim(),
              price: parseFloat(formData.price),
              category: formData.category,
              artisanId: parseInt(formData.artisanId),
              description: formData.description.trim(),
              inStock: formData.inStock,
              stock: formData.stock ? parseInt(formData.stock) : 0,
            }
          : product
      );
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      handleCloseModal();
      alert('Product updated successfully!');
    }
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter((product) => product.id !== productId);
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      alert('Product deleted successfully!');
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading or nothing if not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen py-12 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              Product Management
            </h1>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary"
          >
            + Add New Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artisan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const artisan = artisansData.find((a) => a.id === product.artisanId);
                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-16 w-16 object-cover rounded"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {artisan ? artisan.name : 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mb-1 ${
                                product.inStock && (product.stock === undefined || product.stock > 0)
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {product.inStock && (product.stock === undefined || product.stock > 0) ? 'In Stock' : 'Out of Stock'}
                            </span>
                            {product.stock !== undefined && (
                              <span className="text-xs text-gray-600">
                                Qty: {product.stock}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleOpenModal(product)}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className={`input-field ${errors.image ? 'border-red-500' : ''}`}
                      placeholder="https://example.com/image.jpg"
                    />
                    {errors.image && (
                      <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                    )}
                    {formData.image && !errors.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="mt-2 h-32 w-32 object-cover rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={`input-field ${errors.price ? 'border-red-500' : ''}`}
                        placeholder="0.00"
                      />
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`input-field ${errors.category ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Artisan <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="artisanId"
                      value={formData.artisanId}
                      onChange={handleInputChange}
                      className={`input-field ${errors.artisanId ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select artisan</option>
                      {artisansData.map((artisan) => (
                        <option key={artisan.id} value={artisan.id}>
                          {artisan.name} - {artisan.location}
                        </option>
                      ))}
                    </select>
                    {errors.artisanId && (
                      <p className="mt-1 text-sm text-red-500">{errors.artisanId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                      placeholder="Enter product description"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        min="0"
                        className={`input-field ${errors.stock ? 'border-red-500' : ''}`}
                        placeholder="0"
                      />
                      {errors.stock && (
                        <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
                      )}
                    </div>
                    <div className="flex items-end">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="inStock"
                          checked={formData.inStock}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                          In Stock
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={editingProduct ? handleUpdate : handleCreate}
                      className="btn-primary"
                    >
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;

