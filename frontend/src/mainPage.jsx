import React, { useState, useEffect } from "react";

const MainPage = () => {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
  });

  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "category") {
      const filtered = categories.filter((category) =>
        category.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
      setShowDropdown(true);
    }
  };

  const handleSelectCategory = (category) => {
    setFormData({ ...formData, category });
    setShowDropdown(false);
  };

  const handleSubmit = async () => {
    if (!formData.category || !formData.amount || !formData.description) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/add_expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: formData.category,
          amount: parseFloat(formData.amount),
          shortDescription: formData.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      setFormData({
        category: "",
        amount: "",
        description: "",
      });

      setAlertMessage("Expense added successfully!");
      setAlertType("success");
    } catch (err) {
      setAlertMessage("An error occurred: " + err.message);
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleTakePicture = () => {
    console.log("Take Picture button clicked");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.categories.map((category) => category.name));
        console.log("fetched categories", data.categories);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <a href="/expenses" className="flex text-4xl m-4">
        expenses
      </a>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full">
          {alertMessage && (
            <div
              className={`${
                alertType === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              } p-4 mb-4 rounded-lg border-l-4 border-solid ${
                alertType === "success"
                  ? "border-green-500"
                  : "border-red-500"
              }`}
            >
              {alertMessage}
            </div>
          )}

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Expense Tracker
          </h1>

          {error && (
            <p className="text-red-600 bg-red-100 border border-red-400 p-4 rounded mb-4">
              {error}
            </p>
          )}

          <div className="relative">
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {showDropdown && filteredCategories.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredCategories.map((category, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectCategory(category)}
                    className="p-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {category}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-4 mt-4">
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="description"
              placeholder="Short Description"
              value={formData.description}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="my-6 flex items-center justify-center">
            <span className="h-px w-1/4 bg-gray-300"></span>
            <span className="mx-4 text-gray-500">OR</span>
            <span className="h-px w-1/4 bg-gray-300"></span>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleTakePicture}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              Take Picture
            </button>

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition-transform transform hover:scale-105 mt-4"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
