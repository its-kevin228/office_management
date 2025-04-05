"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface User {
    name: string;
    email: string;
    avatar: string;
    access: string[];
    lastActive: string;
    dateAdded: string;
    selected?: boolean;
}

interface UserTableProps {
    searchTerm: string;
    users: User[];
    activeFilters: string[];
}

export default function UserTable({ searchTerm, users: initialUsers, activeFilters }: UserTableProps) {
    const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
    const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        setFilteredUsers(initialUsers);
    }, [initialUsers]);

    useEffect(() => {
        setSelectedUsers(new Set());
        setSelectAll(false);
    }, [initialUsers]);

    useEffect(() => {
        let result = initialUsers;

        // Apply access filters
        if (activeFilters.length > 0) {
            result = result.filter(user =>
                activeFilters.every(filter => user.access.includes(filter))
            );
        }

        // Apply search filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(user => 
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                user.access.some(access => access.toLowerCase().includes(searchLower))
            );
        }

        setFilteredUsers(result);
    }, [searchTerm, activeFilters, initialUsers]);

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(filteredUsers.map((_, index) => index)));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectUser = (index: number) => {
        const newSelected = new Set(selectedUsers);
        if (selectedUsers.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedUsers(newSelected);
        setSelectAll(newSelected.size === filteredUsers.length);
    };

    return (
        <div className='p-2 sm:p-4 md:p-6 bg-white rounded-xl shadow-md overflow-hidden'>
            {filteredUsers.length === 0 ? (
                <div className="text-center py-8 px-4">
                    <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">Aucun résultat trouvé</h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">
                        Essayez de modifier vos critères de recherche
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto -mx-2 sm:-mx-4 md:-mx-6">
                    <div className="inline-block min-w-full align-middle">
                        <table className='w-full text-left text-xs sm:text-sm border-collapse min-w-[640px]'>
                            <thead>
                                <tr className='border-b'>
                                    <th className='sticky top-0 bg-white py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-500'>
                                        <input
                                            type="checkbox"
                                            className="h-3 w-3 sm:h-4 sm:w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all duration-200 ease-in-out cursor-pointer"
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className='sticky top-0 bg-white py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-800'>User</th>
                                    <th className='sticky top-0 bg-white py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-800'>Access</th>
                                    <th className='sticky top-0 bg-white py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-800'>Last Active</th>
                                    <th className='sticky top-0 bg-white py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-800'>Date Added</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user, index) => (
                                    <tr key={index} className='hover:bg-gray-50 transition-colors duration-150 ease-in-out'>
                                        <td className='whitespace-nowrap py-2 sm:py-3 px-2 sm:px-4'>
                                            <input
                                                type="checkbox"
                                                className="h-3 w-3 sm:h-4 sm:w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all duration-200 ease-in-out cursor-pointer"
                                                checked={selectedUsers.has(index)}
                                                onChange={() => handleSelectUser(index)}
                                            />
                                        </td>
                                        <td className='whitespace-nowrap py-2 sm:py-3 px-2 sm:px-4'>
                                            <div className='flex items-center gap-2 sm:gap-3'>
                                                <Image
                                                    src={user.avatar}
                                                    width={32}
                                                    height={32}
                                                    className='rounded-full sm:w-10 sm:h-10 object-cover'
                                                    alt={user.name}
                                                />
                                                <div>
                                                    <div className='font-medium text-gray-900 text-xs sm:text-sm'>{user.name}</div>
                                                    <div className='text-xs sm:text-sm text-gray-500'>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='whitespace-nowrap py-2 sm:py-3 px-2 sm:px-4'>
                                            <div className='flex flex-wrap gap-1 sm:gap-2'>
                                                {user.access.map((access, index) => {
                                                    let badgeColor = "bg-gray-200 text-gray-700";
                                                    if (access === "Admin") badgeColor = "bg-green-100 text-green-700";
                                                    if (access === "Data Export") badgeColor = "bg-blue-100 text-blue-700";
                                                    if (access === "Data Import") badgeColor = "bg-purple-100 text-purple-700";
                                                    return (
                                                        <span key={index} className={`inline-flex items-center ${badgeColor} rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-medium transition-all duration-200 ease-in-out hover:opacity-80`}>
                                                            {access}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className='whitespace-nowrap py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-500'>{user.lastActive}</td>
                                        <td className='whitespace-nowrap py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-500'>{user.dateAdded}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
