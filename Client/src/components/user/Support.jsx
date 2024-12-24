import React, { useState, useContext } from "react";
import axios from "axios";
import UserContext from "../../context/UserContext";

const Support = () => {
  const [message, setMessage] = useState(""); // Store the support message
  const [response, setResponse] = useState(""); // Store the response message
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const { email } = useContext(UserContext);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    setIsSubmitting(true); // Start loading state
    setError(""); // Clear any previous errors

    try {
      const res = await axios.post("/api/auth/support", { email, message });
      setResponse(res.data.message); // Set the success response
      setMessage(""); // Clear the message input field after successful submission
    } catch (err) {
      console.error("Failed to send support message:", err);
      setError("Failed to send your message. Please try again later.");
    } finally {
      setIsSubmitting(false); // Stop loading state
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ml-5">
      <div className="p-6 max-w-lg w-full mx-auto container bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Support</h1>

        {response ? (
          // If there's a response, display it and hide the form
          <div className="bg-green-50 p-4 rounded-md text-green-600">
            <p>{response}</p>
          </div>
        ) : (
          // Otherwise, display the form
          <form onSubmit={handleSubmit} className="mt-4">
            <textarea
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="6"
              autoFocus
            />
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

            <div className="flex justify-between items-center mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-500 text-white px-6 py-2 rounded-md w-full ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="spinner-border spinner-border-sm">Submitting</span> // Add a spinner here
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Support;
