// import { useRouter } from "next/navigation";

// const Products = ( ) => {
//     const router = useRouter();

//     fetch (`https://next-ecommerce-api.vercel.app/products?skip=${router}`, {
//         method: 'POST',
//         body: JSON.stringify({
//             skip: 10,
//             limit: 50,
//             sortBy: "fragrances"
//         })
//     })
// }

// export default Products();

"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import "../styles/globals.css";
import SkeletonCard from './SkeletonCard';
import Sort from './Sort';
import Filter from './Filter';

/**
 * ProductCards component
 * 
 * @param {object} initialProducts - Initial products data
 * @param {number} currentPage - Current page number
 * 
 * @returns {JSX.Element} - ProductCards component
 */
const ProductCards = ({ initialProducts, currentPage, initialCategories }) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [currentPageState, setCurrentPageState] = useState(currentPage || 1);
  const [categories, setCategories] = useState(initialCategories || []);
  const [searchTerm, setSearchTerm] = useState("") //State variable for search input
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
 // const pageParam = searchParams.get('page') || '1';
 // const page = parseInt(pageParam) - 1;

  const perPage = 20;
  const totalFiltered = filteredProducts.length;
  const totalPages = Math.ceil(totalFiltered / perPage);
  //const categories = [...new Set(products.map(product => product.category))];

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://next-ecommerce-api.vercel.app/categories');
      const data = await response.json();
      setCategories(data);
    } catch {
      console.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    /**
   * Fetch products data
   * 
   * @async
   * @returns {Promise<void>}
   */
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://next-ecommerce-api.vercel.app/products?skip=${(currentPageState - 1) * perPage}&limit=20`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        fetchCategories();
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


   // Update filteredProducts whenever products change
   useEffect(() => {
    setFilteredProducts(products); // This ensures filteredProducts is populated with products after the fetch.
  }, [products]);

  /**
   * Handle next page click
   * 
   * @returns {void}
   */
  const handleNextPage = () => {
    const nextPage = currentPageState + 1;
    //window.history.pushState({}, '', `${pathname}?page=${nextPage}`);
    if (nextPage <= totalPages) {
      setCurrentPageState(nextPage);
      updateQueryParams({ page: nextPage });
    }
  };

  /**
   * Handle previous page click
   * 
   * @returns {void}
   */
  const handlePreviousPage = () => {
    const prevPage = currentPageState - 1;
    if (prevPage >= 1) {
      setCurrentPageState(prevPage);
      updateQueryParams({page: prevPage})
      //window.history.pushState({}, '', `${pathname}?page=${prevPage}`);
    }
  };

  const handleSort = (order) => {
    const sortedProducts = [...filteredProducts].sort((a,b) => {
     return order === "asc" ? a.price - b.price : b.price - a.price;
    })
    setFilteredProducts(sortedProducts);
    updateQueryParams({ sort: order });
  }

  const handleFilter = (category) => {
    if (category) {
      const filtered = products.filter((product) => product.category === category)
      setFilteredProducts(filtered);
      setCurrentPageState(1); // Reset pagination after filtering
      updateQueryParams({ filter: category, page: 1 });
    } else {
      setFilteredProducts(products);
      setCurrentPageState(1)
      updateQueryParams({ filter: null});
    }
  }

  const handleSearch = () => {
    const filtered = products.filter((product) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.title.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        (product.tags && product.tags.join(", ").toLowerCase().includes(searchLower))
      )
    })  
    setFilteredProducts(filtered);
    setCurrentPageState(1); // Reset pagination after filtering
    //updateQueryParams({ search: searchTerm, page: 1 });
  };

   // Reset filters and sorting
   const resetFilters = () => {
    setFilteredProducts(products);
    setCurrentPageState(1);
    setSearchTerm("");
    updateQueryParams({ sort: null, filter: null, page: 1 });
  };

   // Helper function to update query params
   const updateQueryParams = (params) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    const newPath = `${pathname}?${newParams.toString()}`;
    router.push(newPath);
  };

  if (loading) {
    return (
        <div className="container mx-auto py-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center">Loading Products...</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Show Skeleton Loaders while loading */}
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
);
  }

  if (error) {
    return <div className="my-36 text-center text-3xl text-red-500">Oops, there seems to be an error buddy! {error}</div>;
  }

  return (
    <div className="container mx-auto py-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center">Products</h1>
      <div className='flex gap-6 items-center justify-center my-4'>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='py-2 px-4 rounded bg-gray-200'
          />
          <button onClick={handleSearch} className="bg-gray-800 text-white py-2 px-4 rounded w-24">Search</button>
        </div>
        <Sort onSort={handleSort}/>
        <Filter onFilter={handleFilter} categories ={categories}/>
        <button className="bg-gray-800 text-white py-2 px-4 rounded w-60 my-4" onClick={resetFilters}>Reset all filters</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts
        .slice((currentPageState -1) * perPage, currentPageState * perPage)
        .map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="flex justify-center space-x-4 mt-8">
        <div>
            <button onClick={handlePreviousPage} disabled={currentPageState === 1} className="group" >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height="32" width="32" 
                    viewBox="0 0 512 512"
                    className="group-hover:scale-110">
                    <path 
                    fill="#b6c1d2" 
                    d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM271 135c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-87 87 87 87c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L167 273c-9.4-9.4-9.4-24.6 0-33.9L271 135z"/>
                </svg>
            </button>

        </div>
        
        <p>{currentPageState}</p>
        <div>
            <button onClick={handleNextPage} disabled={currentPageState === totalPages} className="group">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height="32" width="32" 
                    viewBox="0 0 512 512"
                    className="group-hover:scale-110">
                    <path 
                    fill="#b6c1d2" 
                    d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z"/>
                </svg>
            </button>
        </div>
        
      </div>
    </div>
  );
};

/**
 * ProductCard component
 * 
 * @param {object} product - Product data
 * 
 * @returns {JSX.Element} - ProductCard component
 */
const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  /**
   * Update current image index
   * 
   * @param {number} prevIndex - Previous image index
   * 
   * @returns {number} - New image index
   */
  useEffect(() => {
    if (product.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
      }, 3000); // 3 seconds interval

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [product.images.length]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.images[currentImageIndex]}
          alt={product.title}
          className="h-48 w-full object-contain mb-4 rounded"
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
      <a href={`/product/${product.id}`}>
        <button className="bg-gray-800 text-white py-2 px-4 rounded w-full hover:bg-gray-600 mt-4">
          View Details
        </button>
      </a>
    </div>
  );
};

/**
 * Get server-side props
 * 
 * @async
 * @param {object} context - Context object
 * 
 * @returns {Promise<object>} - Server-side props
 */
// Server-side rendering (SSR) to fetch products for the initial page load
export async function getServerSideProps(context) {
  const page = parseInt(context.query.page) || 1;

  try {
    const response = await fetch(
      `https://next-ecommerce-api.vercel.app/products?skip=${(page - 1) * 20}&limit=20`
    );
    const products = await response.json();

    // Get all categories from the fetched products
    const allProductsResponse = await fetch(`https://next-ecommerce-api.vercel.app/products`);
    const allProducts = await allProductsResponse.json();

    // Extract unique categories from all products
    const categories = [...new Set(allProducts.map((product) => product.category))];

    return {
      props: {
        initialProducts: products,
        currentPage: page,
        initialCategories: categories,
      },
    };
  } catch (error) {
    return {
      props: {
        initialProducts: [],
        currentPage: page,
        initialCategories: [],
        error: 'Failed to load products',
      },
    };
  }
}

export default ProductCards;