import { useCart } from '../hooks/useCart';

const ProductCard = ({ product, onCardClick }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(product);
    }
  };

  return (
    <div className={`card ${onCardClick ? 'cursor-pointer' : ''}`} onClick={onCardClick ? handleCardClick : undefined}>
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
        />
        {!product.inStock || (product.stock !== undefined && product.stock === 0) ? (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Out of Stock
          </div>
        ) : product.stock !== undefined && product.stock > 0 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {product.stock} in stock
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
        {product.stock !== undefined && (
          <p className="text-sm text-gray-500 mb-2">
            Stock: <span className={`font-semibold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
              {product.stock} available
            </span>
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            ₹{product.price.toLocaleString()}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="bg-gradient-to-r from-primary-600 to-primary-800 text-white px-4 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-900 transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

