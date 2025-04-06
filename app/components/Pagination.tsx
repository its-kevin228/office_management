"use client"
import { useState } from 'react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ totalItems, itemsPerPage = 10, onPageChange }: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange(page);
    }
  };

  // Function to render page numbers with ellipsis for many pages
  const renderPageNumbers = () => {
    const pageNumbers = [];

    // For mobile screens or fewer pages, show simplified pagination
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 text-sm font-medium rounded-md ${currentPage === i
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
          >
            {i}
          </button>
        );
      }
      return pageNumbers;
    }

    // For desktop with many pages, use ellipsis
    if (currentPage <= 3) {
      // Show 1, 2, 3, ..., totalPages
      for (let i = 1; i <= 3; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 text-sm font-medium rounded-md ${currentPage === i
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
          >
            {i}
          </button>
        );
      }
      pageNumbers.push(
        <span key="ellipsis1" className="px-2 py-1 text-gray-500">...</span>
      );
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50`}
        >
          {totalPages}
        </button>
      );
    } else if (currentPage >= totalPages - 2) {
      // Show 1, ..., totalPages-2, totalPages-1, totalPages
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50`}
        >
          1
        </button>
      );
      pageNumbers.push(
        <span key="ellipsis2" className="px-2 py-1 text-gray-500">...</span>
      );
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 text-sm font-medium rounded-md ${currentPage === i
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Show 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50`}
        >
          1
        </button>
      );
      pageNumbers.push(
        <span key="ellipsis3" className="px-2 py-1 text-gray-500">...</span>
      );
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 text-sm font-medium rounded-md ${currentPage === i
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
          >
            {i}
          </button>
        );
      }
      pageNumbers.push(
        <span key="ellipsis4" className="px-2 py-1 text-gray-500">...</span>
      );
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50`}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
      <div className="text-sm text-gray-700 order-2 sm:order-1">
        {totalItems > 0 ? `Showing ${((currentPage - 1) * itemsPerPage) + 1} to ${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} results` : 'No results found'}
      </div>
      <div className="flex items-center space-x-2 order-1 sm:order-2 justify-center sm:justify-end">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="hidden sm:flex space-x-1">
          {renderPageNumbers()}
        </div>
        <div className="sm:hidden">
          <span className="px-3 py-1 text-sm font-medium rounded-md bg-gray-100">
            {currentPage} of {totalPages}
          </span>
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
