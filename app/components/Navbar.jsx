// const Navbar = () => {
//   return (
//     <header className="bg-gray-800 text-white py-4">
//     <div className="container mx-auto flex justify-between items-center">
//       {/* Store Name */}
//       <h1 className="text-3xl font-bold ml-9">The Pantry</h1>

//       {/* Navigation examples*/}
//       <nav className="space-x-6">
//         <a href="/" className="hover:underline">
//           Home
//         </a>
//         <a href="/home" className="hover:underline">
//           Products
//         </a>
//         <a href="/about" className="hover:underline">
//           About
//         </a>
//       </nav>

//       {/* Shopping Cart Icon */}
//       <div className="relative">
//         <div className="hover:text-gray-400 mr-6">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M3 3h2l.4 2M7 13h10l3.6-8H6.4L5.3 5H3m4 8a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"
//             />
//           </svg>
//         </div>
//       </div>
//     </div>
//   </header>
// );
// };

"use client";

import React, { useState } from 'react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Store Name */}
        <h1 className="text-3xl font-bold">The Pantry</h1>

        {/* Hamburger Menu for smaller screens */}
        <div className="lg:hidden">
          <button
            className="text-gray-300 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation for larger screens */}
        <nav className="hidden lg:flex space-x-6">
          <a href="/" className="hover:underline">
            Home
          </a>
          <a href="/products" className="hover:underline">
            Products
          </a>
          <a href="/about" className="hover:underline">
            About
          </a>
          <div className="relative">
          <div className="hover:text-gray-400 mr-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l3.6-8H6.4L5.3 5H3m4 8a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
          </div>
        </div>
        </nav>

        {/* Shopping Cart Icon */}
        
      </div>

      {/* Dropdown Menu for smaller screens */}
      {menuOpen && (
        <nav className="lg:hidden bg-gray-800 px-4 py-2">
          <a href="/" className="block py-2 text-gray-300 hover:bg-gray-700 rounded">
            Home
          </a>
          <a href="/products" className="block py-2 text-gray-300 hover:bg-gray-700 rounded">
            Products
          </a>
          <a href="/about" className="block py-2 text-gray-300 hover:bg-gray-700 rounded">
            About
          </a>
          <div className="relative">
          <div className="hover:text-gray-400 mr-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l3.6-8H6.4L5.3 5H3m4 8a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
          </div>
        </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
