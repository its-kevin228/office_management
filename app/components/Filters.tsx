'use client';

import React, { useState } from 'react';
import { Filter, Plus } from 'lucide-react';
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
    onApplyFilters: (filters: { access: string[]; sortBy: string }) => void;
    activeFilters: {
        access: string[];
        sortBy: string;
    };
}

export default function Filters({ onAddUser, onApplyFilters, activeFilters }: FiltersProps) {
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    return (
        <div className="relative w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full">
                <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition justify-center whitespace-nowrap"
                >
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                    {activeFilters.access.length > 0 && (
                        <span className="ml-1 w-5 h-5 flex items-center justify-center text-xs font-semibold text-white bg-blue-600 rounded-full">
                            {activeFilters.access.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 hover:shadow-lg active:scale-95 transition-all duration-200 ease-in-out justify-center whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add User</span>
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
