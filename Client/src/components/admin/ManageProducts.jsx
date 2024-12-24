import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Reference to the edit form section for scrolling
  const editFormRef = React.createRef();

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/admin/products");
        setProducts(response.data); // Store fetched products
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Handle changes in the product editing form
  const handleEditInputChange = (e) => {
    setEditingProduct({
      ...editingProduct,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for updating the product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      // Send updated product data to the backend
      const response = await axios.put(
        `/api/admin/editProducts/${editingProduct._id}`,
        editingProduct
      );

      // Update the products list with the updated product
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === editingProduct._id ? response.data : product
        )
      );
      setEditingProduct(null); // Reset the editing state
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };

  // Handle clicking the edit button
  const handleEditClick = (product) => {
    setEditingProduct({ ...product }); // Populate the form with the selected product details
    // Scroll to the edit form
    if (editFormRef.current) {
      editFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle clicking the delete button
  const handleDeleteProduct = async (productId) => {
    try {
      // Send delete request to the backend
      const response = await axios.delete(`/api/products/${productId}`);
      alert(response.data.message)
      // Remove the deleted product from the list
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  return (
    <div className="p-4">
      <div className="container max-w-screen-xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-bold mb-4 text-center sm:text-left">Existing Products</h2>
        {/* Display list of products */}
        {products.map((product) => (
          <div
            key={product._id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 p-4 border rounded-lg shadow-md"
          >
            <div className="mb-4 sm:mb-0 w-full sm:w-3/4">
              <p><strong>Name:</strong> {product.name}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
            </div>
            <div className="w-full sm:w-auto">
              <button
                onClick={() => handleEditClick(product)}
                className="bg-yellow-500 text-white px-4 py-2 mt-2 sm:mt-0 rounded w-full sm:w-auto mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(product._id)}
                className="bg-red-500 text-white px-4 py-2 mt-2 sm:mt-0 rounded w-full sm:w-auto"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product editing form */}
      {editingProduct && (
        <div
          ref={editFormRef}
          className="mt-6 container max-w-screen-xl mx-auto p-4 bg-white shadow-lg rounded-lg "
        >
          <h2 className="text-lg font-bold text-center sm:text-left">Edit Product</h2>
          <form onSubmit={handleUpdateProduct} className="mt-4">
            {/* Input fields for updating the product */}
            <input
              name="name"
              placeholder="Name"
              value={editingProduct.name}
              onChange={handleEditInputChange}
              required
              className="border p-2 mb-2 w-full sm:w-3/4 lg:w-1/2 rounded-md"
            />
            <input
              name="price"
              placeholder="Price"
              value={editingProduct.price}
              onChange={handleEditInputChange}
              required
              className="border p-2 mb-2 w-full sm:w-3/4 lg:w-1/2 rounded-md"
            />
            <input
              name="description"
              placeholder="Description"
              value={editingProduct.description}
              onChange={handleEditInputChange}
              required
              className="border p-2 mb-2 w-full sm:w-3/4 lg:w-1/2 rounded-md"
            />
            <input
              name="stock"
              placeholder="Stock"
              value={editingProduct.stock}
              onChange={handleEditInputChange}
              required
              className="border p-2 mb-2 w-full sm:w-3/4 lg:w-1/2 rounded-md"
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md w-full sm:w-auto">
              Update Product
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
