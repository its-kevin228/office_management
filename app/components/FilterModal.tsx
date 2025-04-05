"use client"
import React, { useState, useEffect } from 'react';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: {
        filters: string[];
        sortOrder: string;
        dateRange?: {
            startDate: string;
            endDate: string;
        };
    }) => void;
    activeFilters: string[];
}

export default function FilterModal({ isOpen, onClose, onApplyFilters, activeFilters }: FilterModalProps) {
    const [selectedFilters, setSelectedFilters] = useState<string[]>(activeFilters);
    const [sortOrder, setSortOrder] = useState<string>('asc');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const accessOptions = ['Admin', 'Data Export', 'Data Import'];

    useEffect(() => {
        setSelectedFilters(activeFilters);
    }, [activeFilters]);

    const handleSortOrderChange = (order: string) => {
        if (order !== 'asc' && order !== 'desc') return;
        setSortOrder(order);
    };

    const handleFilterChange = (access: string) => {
        if (!accessOptions.includes(access)) return;
        setSelectedFilters((prev) =>
            prev.includes(access)
                ? prev.filter((a) => a !== access)
                : [...prev, access]
        );
    };

    const handleApply = () => {
        const filterData: {
            filters: string[];
            sortOrder: string;
            dateRange?: {
                startDate: string;
                endDate: string;
            };
        } = {
            filters: selectedFilters,
            sortOrder
        };
        
        if (startDate && endDate) {
            filterData.dateRange = {
                startDate,
                endDate
            };
        }
        
        onApplyFilters(filterData);
        onClose();
    };

    const handleReset = () => {
        setSelectedFilters([]);
        setSortOrder('asc');
        setStartDate('');
        setEndDate('');
        onApplyFilters({
            filters: [],
            sortOrder: 'asc'
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-start justify-end pt-16 px-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full sm:w-96 max-h-[calc(100vh-5rem)] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base sm:text-lg font-semibold">Filtrer les utilisateurs</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all duration-200"
                    >
                        <svg
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="space-y-4">
                    {activeFilters.length > 0 && (
                        <div className="bg-blue-50 p-2 sm:p-3 rounded-md">
                            <p className="text-xs sm:text-sm text-blue-700 font-medium mb-2">
                                Filtres actifs :
                            </p>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                                {activeFilters.map((filter) => (
                                    <span
                                        key={filter}
                                        className="inline-flex items-center bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-medium"
                                    >
                                        {filter}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Niveau d'accès
                        </h3>
                        <div className="space-y-2">
                            {accessOptions.map((access) => (
                                <label key={access} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters.includes(access)}
                                        onChange={() => handleFilterChange(access)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        {access}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Ordre alphabétique
                        </h3>
                        <div className="space-y-2">
                            <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sortOrder"
                                    value="asc"
                                    checked={sortOrder === 'asc'}
                                    onChange={() => handleSortOrderChange('asc')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Ascendant
                                </span>
                            </label>
                            <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sortOrder"
                                    value="desc"
                                    checked={sortOrder === 'desc'}
                                    onChange={() => handleSortOrderChange('desc')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Descendant
                                </span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Date d'arrivée
                        </h3>
                        <div className="space-y-2">
                            <div className="flex flex-col space-y-1 sm:space-y-2">
                                <label className="text-xs text-gray-600">Du:</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                />
                            </div>
                            <div className="flex flex-col space-y-1 sm:space-y-2">
                                <label className="text-xs text-gray-600">Au:</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between pt-4">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                        >
                            Réinitialiser
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                            Appliquer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}