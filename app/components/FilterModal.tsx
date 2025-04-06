'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: { access: string[], sortBy: string }) => void;
  activeFilters: {
    access: string[],
    sortBy: string
  };
}

export default function FilterModal({ isOpen, onClose, onApplyFilters, activeFilters }: FilterModalProps) {
  const [selectedFilters, setSelectedFilters] = useState({
    access: activeFilters.access,
    sortBy: activeFilters.sortBy || 'recent'
  });

  const accessOptions = ['Admin', 'Data Export', 'User Management'];
  const sortOptions = [
    { value: 'recent', label: 'Most recent' },
    { value: 'old', label: 'Oldest first' },
    { value: 'alphabetical', label: 'Alphabetical order' }
  ];

  useEffect(() => {
    setSelectedFilters(activeFilters);
  }, [activeFilters]);

  const handleAccessChange = (access: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      access: prev.access.includes(access)
        ? prev.access.filter(a => a !== access)
        : [...prev.access, access]
    }));
  };

  const handleSortChange = (sortBy: string) => {
    setSelectedFilters(prev => ({ ...prev, sortBy }));
  };

  const handleApply = () => {
    onApplyFilters(selectedFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters = { access: [], sortBy: 'recent' };
    setSelectedFilters(defaultFilters);
    onApplyFilters(defaultFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 top-20 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl p-5 w-80 border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Filter Users</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {selectedFilters.access.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">Active Access Filters:</div>
            <div className="flex flex-wrap gap-1 overflow-x-auto">
              {selectedFilters.access.map((filter) => (
                <span key={filter} className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-medium">
                  {filter}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
          <select
            value={selectedFilters.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
          <div className="space-y-1">
            {accessOptions.map((access) => (
              <label key={access} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={selectedFilters.access.includes(access)}
                  onChange={() => handleAccessChange(access)}
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                {access}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={handleReset}
            className="text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="text-sm text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
