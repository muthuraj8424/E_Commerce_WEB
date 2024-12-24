import React, { useState } from "react";
import axios from "axios";

const AddProducts = () => {
  const [products, setProducts] = useState({
    name: "",
    price: "",
    description: "",
    photos: [],
    location: "",
    stock: "",
  });

  const [addedphotos, setAddedPhotos] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducts((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadImages = (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (!files.length) return;

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    axios
      .post("/api/products/upload-photos", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        const { data: filenames } = res;
        setAddedPhotos((prev) => [...prev, ...filenames]);
        setProducts((prev) => ({
          ...prev,
          photos: [...prev.photos, ...filenames],
        }));
      })
      .catch((err) => {
        console.error("Error uploading files:", err);
        alert("Failed to upload files. Please try again.");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/products/addproducts", products);
      alert("Product added successfully!");
      setProducts({
        name: "",
        price: "",
        description: "",
        photos: [],
        location: "",
        stock: "",
      });
      setAddedPhotos([]);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="container max-w-screen-lg mx-auto p-6 mt-12 ml-10"> {/* Adjusted padding and margin */}
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Product Name</label>
          <input
            type="text"
            name="name"
            value={products.name}
            onChange={handleChange}
            className="border p-3 w-full rounded-md"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={products.description}
            onChange={handleChange}
            className="border p-3 w-full rounded-md"
            required
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={products.price}
            onChange={handleChange}
            className="border p-3 w-full rounded-md"
            required
          />
        </div>

        {/* Stock */}
        <div className="mb-4">
          <label className="block text-gray-700">Stock</label>
          <input
            type="number"
            name="stock"
            value={products.stock}
            onChange={handleChange}
            className="border p-3 w-full rounded-md"
            required
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={products.location}
            onChange={handleChange}
            className="border p-3 w-full rounded-md"
            required
          />
        </div>

        {/* Uploaded Photos */}
        <div className="mb-6">
          <div className="mt-2 gap-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {addedphotos.length > 0 &&
              addedphotos.map((link, index) => (
                <div key={index} className="flex justify-center w-36 h-36 mb-2">
                  <img
                    src={`https://e-com-backend-65l1.onrender.com${link}`}
                    alt="Product"
                    className="w-full h-full object-cover rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                  />
                </div>
              ))}
            <label className="flex justify-center items-center gap-2 border bg-transparent rounded-2xl p-12 mb-2 cursor-pointer transition duration-300 ease-in-out hover:bg-gray-100">
              <input
                type="file"
                multiple
                className="hidden"
                onChange={uploadImages}
              />
              <span className="text-gray-700">Upload</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 w-full rounded-md hover:bg-blue-600 transition duration-300"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
