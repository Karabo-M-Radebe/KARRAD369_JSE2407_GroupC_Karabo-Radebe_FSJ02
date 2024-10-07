const Pagination = ({ currentPage, totalPages, handleNextPage, handlePreviousPage }) => (
    <div className="flex justify-center space-x-4 mt-8">
      <div>
        <button onClick={handlePreviousPage} disabled={currentPage === 1} className="group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="32"
            width="32"
            viewBox="0 0 512 512"
            className="group-hover:scale-110"
          >
            <path
              fill="#b6c1d2"
              d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM271 135c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-87 87 87 87c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L167 273c-9.4-9.4-9.4-24.6 0-33.9L271 135z"
            />
          </svg>
        </button>
      </div>
      
      <p>{currentPage}</p>
  
      <div>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="32"
            width="32"
            viewBox="0 0 512 512"
            className="group-hover:scale-110"
          >
            <path
              fill="#b6c1d2"
              d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
  
  export default Pagination;
  