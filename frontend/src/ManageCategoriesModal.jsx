import React, { useState, useEffect } from "react";

const ManageCategoriesModal = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data.categories);
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      showAlert("Category name cannot be empty", "error");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/add_category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });
      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      setNewCategory("");
      fetchCategories();
      showAlert("Category added successfully", "success");
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/delete_category/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      fetchCategories();
      showAlert("Category deleted successfully", "success");
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg w-96">
          <h2 className="text-lg font-bold mb-4">Manage Categories</h2>

          {alertMessage && (
            <div
              className={`mb-4 p-2 rounded text-center ${
                alertType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {alertMessage}
            </div>
          )}

          <div className="mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              placeholder="New category name"
            />
            <button
              onClick={handleAddCategory}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Category
            </button>
          </div>

          <div className="overflow-y-auto max-h-40">
            {categories.length === 0 ? (
              <p className="text-center text-gray-500">No categories available</p>
            ) : (
              <ul>
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="flex justify-between items-center p-2 border-b"
                  >
                    <span>{category.name}</span>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ManageCategoriesModal;
