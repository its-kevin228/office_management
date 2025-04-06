"use client"
import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import AddUserModal from './AddUserModal';
import FilterModal from './FilterModal';

interface FiltersProps {
    onAddUser: (user: {
        name: string;
        email: string;
        access: string[];
        avatar: string;
        lastActive: string;
        dateAdded: string;
    }) => void;
    onApplyFilters: (filters: { access: string[], sortBy: string }) => void;
    activeFilters: {
        access: string[],
        sortBy: string
    };
}

export default function Filters({ onAddUser, onApplyFilters, activeFilters }: FiltersProps) {
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const openFilterModal = () => {
        setIsFilterModalOpen(true);
    };

    return (
        <div className="relative">
            <div className="flex items-center space-x-4">
                <button
                    onClick={openFilterModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        Filter
                        {activeFilters.access.length > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full">
                                {activeFilters.access.length}
                            </span>
                        )}
                    </div>
                </button>
                <button
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="btn btn-primary w-48 flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add User
                </button>
            </div>
            {isFilterModalOpen && (
                <FilterModal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    onApplyFilters={onApplyFilters}
                    activeFilters={activeFilters}
                />
            )}
            {isAddUserModalOpen && (
                <AddUserModal
                    isOpen={isAddUserModalOpen}
                    onClose={() => setIsAddUserModalOpen(false)}
                    onAddUser={onAddUser}
                />
            )}
        </div>
    );
}