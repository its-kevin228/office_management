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
    }) => void;
    onApplyFilters: (filters: string[]) => void;
    activeFilters: string[];
}

export default function Filters({ onAddUser, onApplyFilters, activeFilters }: FiltersProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    return (
        <div className="relative">
            <div className="flex items-center space-x-4">
                <button 
                    onClick={() => setIsFilterModalOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters {activeFilters.length > 0 && (
                            <span className="ml-2 bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs">
                                {activeFilters.length}
                            </span>
                        )}
                    </div>
                </button>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn btn-primary w-48 flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add user
                </button>
            </div>
            <AddUserModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddUser={onAddUser}
            />
            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApplyFilters={onApplyFilters}
                activeFilters={activeFilters}
            />
        </div>
    );
}