import React, { useEffect, useState } from 'react';
import { ShoppingCartIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, priceRange]);

  const fetchProducts = async () => {
    try {
      const resProducts = await fetch(`${API_URL}/products/`);
      const data = await resProducts.json();
      
      let productsArray = [];
      if (data.results && Array.isArray(data.results)) {
        productsArray = data.results;
      } else if (Array.isArray(data)) {
        productsArray = data;
      }
      
      setProducts(productsArray);
      setFilteredProducts(productsArray);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const resCategories = await fetch(`${API_URL}/categories/`);
      const data = await resCategories.json();
      let categoriesArray = [];
      if (data.results && Array.isArray(data.results)) {
        categoriesArray = data.results;
      } else if (Array.isArray(data)) {
        categoriesArray = data;
      }
      setCategories(categoriesArray);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === parseInt(selectedCategory) || p.category_name === selectedCategory);
    }
    
    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(p => p.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(p => p.price <= parseFloat(priceRange.max));
    }
    
    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Please login to add items to cart');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success(`Added ${product.name} to cart!`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
  };

  const getImageUrl = (product) => {
    if (product.image_url) {
      return product.image_url;
    }
    if (product.image) {
      if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
        return product.image;
      }
      return `http://127.0.0.1:8000${product.image}`;
    }
    return null;
  };

  const defaultImage = 'https://images.unsplash.com/photo-1583878363729-7a2b7e5f92b1?w=300';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 pt-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-4">Networking Equipment Shop</h1>
        <p className="text-center text-gray-600 mb-8">
          {filteredProducts.length} products available
        </p>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              <FunnelIcon className="h-5 w-5" />
              Filters
            </button>
            
            {(searchTerm || selectedCategory || priceRange.min || priceRange.max) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-red-600 hover:text-red-700 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Min Price (KES)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Max Price (KES)</label>
                  <input
                    type="number"
                    placeholder="Any"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            <button onClick={clearFilters} className="mt-4 text-primary-600 hover:underline">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const imageUrl = getImageUrl(product);
              return (
                <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImage;
                        }}
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl mb-2">📡</div>
                        <p className="text-gray-400 text-sm">{product.category_name || 'Product'}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                        {product.category_name || 'Uncategorized'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description?.substring(0, 80)}</p>
                    <div className="flex justify-between items-center mt-3">
                      <div>
                        <span className="text-2xl font-bold text-primary-600">KES {parseFloat(product.price).toLocaleString()}</span>
                        {product.stock > 0 && product.stock < 10 && (
                          <p className="text-xs text-orange-600">Only {product.stock} left!</p>
                        )}
                      </div>
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg hover:from-primary-700 hover:to-primary-800 transition flex items-center gap-2"
                      >
                        <ShoppingCartIcon className="h-5 w-5" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
