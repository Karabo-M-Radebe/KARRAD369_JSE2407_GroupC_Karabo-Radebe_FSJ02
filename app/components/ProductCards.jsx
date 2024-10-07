"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import ProductCard from './ProductCard';
import Sort from './Sort';
import Filter from './Filter';
import Pagination from './pagination';
import Loading from './Loading';
import Error from './Error';
import { fetchProducts, fetchCategories } from '../lib/api';
import Head from 'next/head';

<Head>
  <title>The Pantry - Browse Products</title>
  <meta name="description" content="Browse our wide range of products." />
  <meta name="keywords" content="shop, products, buy" />
  <meta name="author" content="The Pantry" />
  <meta property="og:title" content="The Pantry" />
  <meta property="og:description" content="Your one-stop shop for all your daily essentials." />
  <meta property="og:type" content="website" />
</Head>


const ProductCards = ({ initialProducts, currentPage, initialCategories }) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentPageState, setCurrentPageState] = useState(currentPage || 1);
  const [categories, setCategories] = useState(initialCategories || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const perPage = 20;
  const totalFiltered = filteredProducts.length;
  const totalPages = Math.ceil(totalFiltered / perPage);

  useEffect(() => {
    const loadProductsAndCategories = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await fetchProducts(currentPageState, perPage);
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);

        if (!categories.length) {
          const fetchedCategories = await fetchCategories();
          setCategories(fetchedCategories);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProductsAndCategories();
  }, [currentPageState]);

  const handleSearch = () => {
    const filtered = products.filter((product) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.title.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        (product.tags && product.tags.join(", ").toLowerCase().includes(searchLower))
      );
    });
    setFilteredProducts(filtered);
    setCurrentPageState(1); 
  };

  const handleSort = (order) => {
    setSortOrder(order);
    const sortedProducts = [...filteredProducts].sort((a, b) =>
      order === 'asc' ? a.price - b.price : b.price - a.price
    );
    setFilteredProducts(sortedProducts);
    updateQueryParams({ sort: order });
  };

  const handleFilter = (category) => {
    setSelectedCategory(category);
    const filtered = products.filter((product) => 
      category ? product.category === category : true
    );
    setFilteredProducts(filtered);
    setCurrentPageState(1); // Reset to page 1 after filtering
  };

  const resetFilters = () => {
    setFilteredProducts(products);
    setCurrentPageState(1);
    setSearchTerm("");
    setSortOrder("");
  };

  // Reflect changes in the URL query parameters
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

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

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
        <Filter onFilter={handleFilter} categories={categories} />
        <button className="bg-gray-800 text-white py-2 px-4 rounded w-60" onClick={resetFilters}>
          Reset all filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        currentPage={currentPageState}
        totalPages={totalPages}
        handleNextPage={() => setCurrentPageState(currentPageState + 1)}
        handlePreviousPage={() => setCurrentPageState(currentPageState - 1)}
      />
    </div>
  );
};

/**
 * Get server-side props
 *
 * @async
 * @param {object} context - Context object
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
        revalidate: 60, // Enable caching with revalidation every 60 seconds
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