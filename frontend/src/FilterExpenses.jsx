import React from "react";

const FilterExpenses = ({
  filterCategory,
  setFilterCategory,
  filterMinAmount,
  setFilterMinAmount,
  filterMaxAmount,
  setFilterMaxAmount,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-2">Filters</h2>
      <div className="grid grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Min Amount"
          value={filterMinAmount}
          onChange={(e) => setFilterMinAmount(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Max Amount"
          value={filterMaxAmount}
          onChange={(e) => setFilterMaxAmount(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
};

export default FilterExpenses;
