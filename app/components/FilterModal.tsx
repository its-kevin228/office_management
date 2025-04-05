"use client"
import React, { useState, useEffect } from 'react';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: string[]) => void;
    activeFilters: string[];
}

export default function FilterModal({ isOpen, onClose, onApplyFilters, activeFilters }: FilterModalProps) {
    const [selectedFilters, setSelectedFilters] = useState<string[]>(activeFilters);

    const accessOptions = ['Admin', 'Data Export', 'Data Import'];

    useEffect(() => {
        setSelectedFilters(activeFilters);
    }, [activeFilters]);

    const handleFilterChange = (access: string) => {
        setSelectedFilters(prev => 
            prev.includes(access)
                ? prev.filter(a => a !== access)
                : [...prev, access]
        );
    };

    const handleApply = () => {
        onApplyFilters(selectedFilters);
    };

    const handleReset = () => {
        setSelectedFilters([]);
        onApplyFilters([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed right-0 top-0 mt-16 mr-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Filtrer les utilisateurs</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="space-y-4">
                    {activeFilters.length > 0 && (
                        <div className="bg-blue-50 p-3 rounded-md">
                            <p className="text-sm text-blue-700 font-medium mb-2">Filtres actifs :</p>
                            <div className="flex flex-wrap gap-2">
                                {activeFilters.map((filter) => (
                                    <span key={filter} className="inline-flex items-center bg-blue-100 text-blue-700 rounded-full px-2.5 py-0.5 text-xs font-medium">
                                        {filter}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Niveau d'accès</h3>
                        <div className="space-y-2">
                            {accessOptions.map((access) => (
                                <label key={access} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters.includes(access)}
                                        onChange={() => handleFilterChange(access)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{access}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between pt-4">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Réinitialiser
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Appliquer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 