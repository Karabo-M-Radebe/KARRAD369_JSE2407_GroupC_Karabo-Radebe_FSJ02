import { useState } from 'react';


const Sort = ({ onSort }) => {
  const [sortOrder, setSortOrder] = useState('');

  const handleSort = (order) => {
    setSortOrder(order);
    onSort(order);
  };

  return (
    <div className="flex justify-center space-x-4 my-4">
      <select 
        value={sortOrder} 
        onChange={(e) => handleSort(e.target.value)} 
        className="py-2 px-4 rounded bg-gray-300"
      >
        <option value="">Sort by Price</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>
    </div>
  );
};

export default Sort;
