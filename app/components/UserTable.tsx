'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import ViewProfileModal from './ViewProfileModal'
import ManagePermissionsModal from './ManagePermissionsModal'

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
    const [selectedDropdowns, setSelectedDropdowns] = useState<Set<number>>(new Set());

    useEffect(() => {
        let result = initialUsers;

        if (activeFilters.length > 0) {
            result = result.filter(user =>
                activeFilters.every(filter => user.access.includes(filter))
            );
        }

        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(user =>
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                user.access.some(access => access.toLowerCase().includes(searchLower))
            );
        }

        setFilteredUsers(result);
    }, [initialUsers, activeFilters, searchTerm]);

    useEffect(() => {
        setSelectedUsers(new Set());
        setSelectAll(false);
    }, [initialUsers]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectedDropdowns.size > 0) {
                const target = event.target as HTMLElement;
                if (!target.closest('.dropdown-menu')) {
                    setSelectedDropdowns(new Set());
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [selectedDropdowns]);

    const [showViewModal, setShowViewModal] = useState(false);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleAction = (action: string, user: User) => {
        switch (action) {
            case 'view':
                setSelectedUser(user);
                setShowViewModal(true);
                break;
            case 'delete':
                if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                    const updatedUsers = filteredUsers.filter(u => u.email !== user.email);
                    setFilteredUsers(updatedUsers);
                }
                break;
            case 'archive':
                if (window.confirm(`Are you sure you want to archive ${user.name}?`)) {
                    const updatedUsers = filteredUsers.map(u => {
                        if (u.email === user.email) {
                            return { ...u, status: 'archived' };
                        }
                        return u;
                    });
                    setFilteredUsers(updatedUsers);
                }
                break;
            case 'permissions':
                setSelectedUser(user);
                setShowPermissionsModal(true);
                break;
        }

        setSelectedDropdowns(new Set());

        if (action === 'delete' || action === 'archive') {
            const message = action === 'delete' ? 'User deleted successfully' : 'User archived successfully';
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50';
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => document.body.removeChild(toast), 3000);
        }
    };

    const toggleDropdown = (index: number) => {
        setSelectedDropdowns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.clear();
                newSet.add(index);
            }
            return newSet;
        });
    };

    const handleUpdatePermissions = (userId: string, newAccess: string[]) => {
        setFilteredUsers(prevUsers =>
            prevUsers.map(user =>
                user.email === userId
                    ? { ...user, access: newAccess }
                    : user
            )
        );
    };

    return (
        <>
            <ViewProfileModal
                user={selectedUser}
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
            />
            <ManagePermissionsModal
                user={selectedUser}
                isOpen={showPermissionsModal}
                onClose={() => setShowPermissionsModal(false)}
                onUpdatePermissions={handleUpdatePermissions}
            />
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last active</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date added</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user, index) => (
                            <tr key={user.email} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <Image
                                                className="h-10 w-10 rounded-full"
                                                src={user.avatar}
                                                alt={user.name}
                                                width={40}
                                                height={40}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-wrap gap-1">
                                        {user.access.map((access) => (
                                            <span
                                                key={access}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${access === 'Admin' ? 'bg-purple-100 text-purple-800' :
                                                    access === 'Data Export' ? 'bg-green-100 text-green-800' :
                                                        'bg-orange-100 text-orange-800'
                                                    }`}
                                            >
                                                {access}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.lastActive}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.dateAdded}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="relative">
                                        <button
                                            onClick={() => toggleDropdown(index)}
                                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                        >
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                        </button>
                                        {selectedDropdowns.has(index) && (
                                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 dropdown-menu z-10">
                                                <div className="py-1" role="menu" aria-orientation="vertical">
                                                    <button
                                                        onClick={() => handleAction('view', user)}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                        role="menuitem"
                                                    >
                                                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        View profile
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction('delete', user)}
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                                        role="menuitem"
                                                    >
                                                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction('archive', user)}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                        role="menuitem"
                                                    >
                                                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                        </svg>
                                                        Archive
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction('permissions', user)}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                        role="menuitem"
                                                    >
                                                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                        </svg>
                                                        Manage Permissions
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
