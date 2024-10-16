export const fetchProducts = async (page, perPage, category = '') => {
  const categoryParam = category ? `&category=${category}` : '';
  const response = await fetch(
    `https://next-ecommerce-api.vercel.app/products?skip=${(page - 1) * perPage}&limit=${perPage}${categoryParam}`
  );
  if (!response.ok) throw new Error('Failed to fetch products');
  return await response.json();
};
  
export const fetchCategories = async () => {
  const response = await fetch('https://next-ecommerce-api.vercel.app/categories');
  if (!response.ok) throw new Error('Failed to fetch categories');
  return await response.json();
};
  