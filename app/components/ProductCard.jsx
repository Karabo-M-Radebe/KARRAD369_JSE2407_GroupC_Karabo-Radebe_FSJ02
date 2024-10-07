import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (product.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [product.images.length]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <Image
          src={product.images[currentImageIndex]}
          alt={product.title}
          width={400}
          height={300}
          className="object-contain rounded h-48 w-full"
        />
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {currentImageIndex + 1}/{product.images.length}
          </div>
        )}
      </div>
      <h2 className="text-lg font-semibold">{product.title}</h2>
      <p className="text-gray-600">Category: {product.category}</p>
      <p className="text-gray-800 font-bold mt-2">${product.price}</p>
      <Link href={`/product/${product.id}`}>
        <button className="bg-gray-800 text-white py-2 px-4 rounded w-full hover:bg-gray-600 mt-4">
          View Details
        </button>
      </Link>
    </div>
  );
};

export default ProductCard;
