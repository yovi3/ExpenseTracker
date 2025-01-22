import React, { useState, useEffect } from "react";
import CategoryModal from "./ManageCategoriesModal";
import FilterExpenses from "./FilterExpenses";
import ActionButtons from "./ActionButtons";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Divider from "@mui/material/Divider";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [editExpense, setEditExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [filterCategory, setFilterCategory] = useState("");
  const [filterMinAmount, setFilterMinAmount] = useState("");
  const [filterMaxAmount, setFilterMaxAmount] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/expenses");
        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }
        const data = await response.json();
        setExpenses(data.expenses);
      } catch (err) {
        setError(err.message);
        showAlert(err.message, "error");
      }
    };

    fetchExpenses();
  }, []);

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/delete_expense/${expenseToDelete.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      setExpenses(
        expenses.filter((expense) => expense.id !== expenseToDelete.id)
      );
      setExpenseToDelete(null);
      setShowDeleteModal(false);
      showAlert("Expense deleted successfully", "success");
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  const confirmDelete = (expense) => {
    setExpenseToDelete(expense);
    setShowDeleteModal(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/update_expense/${editExpense.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editExpense),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update expense");
      }

      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === editExpense.id ? editExpense : expense
        )
      );
      setShowModal(false);
      showAlert("Expense updated successfully", "success");
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (showDeleteModal) {
        handleDelete();
      }
      if (showModal && editExpense) {
        event.preventDefault();
        handleUpdate();
      }
    }
  };

  useEffect(() => {
    if (showModal || showDeleteModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal, showDeleteModal, editExpense]);

  // Filters
  const applyFilters = () => {
    let updatedExpenses = expenses;

    if (filterCategory) {
      updatedExpenses = updatedExpenses.filter((expense) =>
        expense.category.toLowerCase().includes(filterCategory.toLowerCase())
      );
    }

    if (filterMinAmount) {
      updatedExpenses = updatedExpenses.filter(
        (expense) => expense.amount >= parseFloat(filterMinAmount)
      );
    }

    if (filterMaxAmount) {
      updatedExpenses = updatedExpenses.filter(
        (expense) => expense.amount <= parseFloat(filterMaxAmount)
      );
    }

    setFilteredExpenses(updatedExpenses);
  };

  useEffect(() => {
    applyFilters();
  }, [expenses, filterCategory, filterMinAmount, filterMaxAmount]);

  // Dropdown Handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryClick = () => {
    setShowCategoryModal(true);
    handleMenuClose();
  };

  return (
    <>
      <a href="/" className="flex text-4xl m-4">
        home
      </a>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
          <div className="flex items-center">
            <ActionButtons />
            <IconButton
              aria-label="more"
              aria-controls={open ? "category-menu" : undefined}
              aria-haspopup="true"
              onClick={handleMenuOpen}
            >
            <MoreVertIcon sx={{ color: "black" }} /> {/* Add sx prop to set the color */}
            </IconButton>
            <Menu
              id="category-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleCategoryClick}>Categories</MenuItem>
            </Menu>
          </div>
        </div>


        {alertMessage && (
          <div
            className={`fixed top-0 left-0 w-full p-4 z-50 text-center ${
              alertType === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
            style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
          >
            {alertMessage}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="text-left px-6 py-3">ID</th>
                <th className="text-left px-6 py-3">Category</th>
                <th className="text-left px-6 py-3">Amount</th>
                <th className="text-left px-6 py-3">Currency</th>
                <th className="text-left px-6 py-3">Description</th>
                <th className="text-left px-6 py-3">Date & time</th>
                <th className="text-left px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center px-6 py-4 text-gray-500">
                    No expenses found
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense, index) => (
                  <tr
                    key={expense.id}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    <td className="px-6 py-4">{expense.id}</td>
                    <td className="px-6 py-4">{expense.category}</td>
                    <td
                      className={`px-6 py-4 ${
                        expense.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {expense.amount > 0 ? `+${expense.amount.toFixed(2)}` : expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">PLN</td>
                    <td className="px-6 py-4">{expense.shortDescription}</td>
                    <td className="px-6 py-4">January 21, 2025 12:30</td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <IconButton
                          aria-label="more"
                          aria-controls="expense-menu"
                          aria-haspopup="true"
                          onClick={(event) => setAnchorEl(event.currentTarget)}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                        <Menu
                          id="expense-menu"
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={() => setAnchorEl(null)}
                        >
                          <MenuItem
                            onClick={() => {
                              setEditExpense(expense);
                              setShowModal(true);
                              setAnchorEl(null);
                            }}
                          >
                            <EditIcon/> Edit
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              // Duplicate action logic here
                              console.log("Duplicate expense:", expense);
                              setAnchorEl(null);
                            }}
                          >
                          <ContentCopyIcon/> Duplicate
                          </MenuItem>
                          <Divider />
                          <MenuItem
                            onClick={() => {
                              confirmDelete(expense);
                              setAnchorEl(null);
                            }}
                            style={{ color: "red" }}
                          >
                            <DeleteIcon/> Delete
                          </MenuItem>
                        </Menu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-98">
              <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
              <p className="mb-4">
                Are you sure you want to delete the expense{" "}
                <strong>{expenseToDelete?.shortDescription}</strong>?
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Edit Expense</h2>
              <input
                type="text"
                value={editExpense.category || ""}
                onChange={(e) =>
                  setEditExpense({ ...editExpense, category: e.target.value })
                }
                className="w-full mb-3 p-2 border rounded"
                placeholder="Category"
              />
              <input
                type="number"
                value={editExpense.amount || ""}
                onChange={(e) =>
                  setEditExpense({ ...editExpense, amount: parseFloat(e.target.value) })
                }
                className="w-full mb-3 p-2 border rounded"
                placeholder="Amount"
              />
              <input
                type="text"
                value={editExpense.shortDescription || ""}
                onChange={(e) =>
                  setEditExpense({ ...editExpense, shortDescription: e.target.value })
                }
                className="w-full mb-3 p-2 border rounded"
                placeholder="Description"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {showCategoryModal && (
          <CategoryModal
            isOpen={showCategoryModal}
            onClose={() => setShowCategoryModal(false)}
          />
        )}

      </div>
    </>
  );
};

export default ViewExpenses;
