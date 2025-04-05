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
        let result = initialUsers;

        // Appliquer les filtres
        if (activeFilters.length > 0) {
            result = result.filter(user =>
                activeFilters.every(filter => user.access.includes(filter))
            );
        }

        // Appliquer la recherche
        if (searchTerm.trim()) {
            result = result.filter(user => 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.access.some(access => access.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <div className='p-6 bg-white rounded-xl shadow-md'>
            {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun résultat trouvé</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Essayez de modifier vos critères de recherche
                    </p>
                </div>
            ) : (
                <table className='w-full text-left text-sm border-collapse'>
                    <thead>
                        <tr className='border-b'>
                            <th className='py-3 px-4 font-medium text-gray-500'>
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all duration-200 ease-in-out cursor-pointer"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className='py-3 px-4 font-medium text-gray-500'>User</th>
                            <th className='py-3 px-4 font-medium text-gray-500'>Access</th>
                            <th className='py-3 px-4 font-medium text-gray-500'>Last Active</th>
                            <th className='py-3 px-4 font-medium text-gray-500'>Date Added</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr key={index} className='border-b hover:bg-gray-50 transition-colors duration-150 ease-in-out'>
                                <td className='py-3 px-4'>
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all duration-200 ease-in-out cursor-pointer"
                                        checked={selectedUsers.has(index)}
                                        onChange={() => handleSelectUser(index)}
                                    />
                                </td>
                                <td className='py-3 px-4'>
                                    <div className='flex items-center gap-3'>
                                        <Image
                                            src={user.avatar}
                                            width={40}
                                            height={40}
                                            className='rounded-full'
                                            alt={user.name}
                                        />
                                        <div>
                                            <div className='font-medium text-gray-900'>{user.name}</div>
                                            <div className='text-sm text-gray-500'>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className='py-3 px-4'>
                                    <div className='flex flex-wrap gap-2'>
                                        {user.access.map((access, index) => {
                                            let badgeColor = "bg-gray-200 text-gray-700";
                                            if (access === "Admin") badgeColor = "bg-green-100 text-green-700";
                                            if (access === "Data Export") badgeColor = "bg-blue-100 text-blue-700";
                                            if (access === "Data Import") badgeColor = "bg-purple-100 text-purple-700";
                                            return (
                                                <span key={index} className={`inline-flex items-center ${badgeColor} rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200 ease-in-out hover:opacity-80`}>
                                                    {access}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </td>
                                <td className='py-3 px-4 text-gray-500'>{user.lastActive}</td>
                                <td className='py-3 px-4 text-gray-500'>{user.dateAdded}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
