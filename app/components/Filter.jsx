import { useState, useEffect } from 'react';

const Filter = ({ onFilter, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleFilter = (category) => {
    setSelectedCategory(category);
    onFilter(category);
  };

  return (
    <div className="flex justify-center space-x-4 my-4">
      <select 
        value={selectedCategory} 
        onChange={(e) => handleFilter(e.target.value)} 
        className="py-2 px-4 rounded bg-gray-300"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
