import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function DisplayComponents() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products/getAllProducts");
        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filtered products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on the search query
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercasedQuery) 
        // product.description.toLowerCase().includes(lowercasedQuery) ||
        // product.location.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  return (
    <div className="p-6 container min-h-screen ml-4 top-0 right-0">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Products</h1>
      
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="border border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow bg-white hover:bg-gray-100"
            >
              <div className="relative">
                <img
                  src={`http://localhost:5000${product.photos[0]}`}
                  alt={product.name}
                  className="w-full h-48 mb-4 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-blue-500 transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-2 truncate">{product.description}</p>
              <p className="text-gray-800 font-medium mb-2">Price: Rs-{product.price}</p>
              <p className="text-gray-600 mb-2">Stock: {product.stock}</p>
              <p className="text-gray-600 mb-4">Location: {product.location}</p>
            </Link>
          ))
        ) : (
          <p className="text-gray-600 text-center col-span-full">
            No products match your search query.
          </p>
        )}
      </div>
    </div>
  );
}

export default DisplayComponents;
