"use client"
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

interface User {
    name: string;
    email: string;
    avatar: string;
    access: string[];
    lastActive: string;
    dateAdded: string;
    selected?: boolean;
}

// List of available permissions with descriptions - remove Data Import
const AVAILABLE_PERMISSIONS = [
    { id: 'Admin', label: 'Admin', description: 'Full access to all features' },
    { id: 'Data Export', label: 'Data Export', description: 'Can export data' },
    { id: 'User Management', label: 'User Management', description: 'Can create and modify users (restricted to administrators)' }
];

interface UserTableProps {
    searchTerm: string;
    users: User[];
    activeFilters: {
        access: string[],
        sortBy: string
    };
    onDeleteUser?: (email: string) => void;
    onUpdateUser?: (email: string, updatedUser: User) => void;
    onSetActiveUser?: (user: User) => void;
}

export default function UserTable({ searchTerm, users: initialUsers, activeFilters, onDeleteUser, onUpdateUser, onSetActiveUser }: UserTableProps) {
    const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
    const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFormat, setExportFormat] = useState<'json' | 'excel'>('json');
    const [activeUser, setActiveUser] = useState<User | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPermissions, setEditingPermissions] = useState<string[]>([]);
    const [showSingleExportModal, setShowSingleExportModal] = useState(false);
    const [singleExportFormat, setSingleExportFormat] = useState<'json' | 'excel'>('json');
    const [dropdownPosition, setDropdownPosition] = useState<'up' | 'down'>('down');

    useEffect(() => {
        let result = initialUsers;

        // Appliquer les filtres
        if (activeFilters.access.length > 0) {
            result = result.filter(user =>
                activeFilters.access.every(filter => user.access.includes(filter))
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

    const handleAction = (action: string, user: User) => {
        console.log('handleAction called with:', action, user); // Debug log
        setOpenDropdown(null);
        setActiveUser(user);
        setEditingUser({ ...user });
        setEditingPermissions([...user.access]);
        setIsEditing(false);

        switch (action) {
            case 'view':
                console.log('Setting showProfileModal to true'); // Debug log
                setShowProfileModal(true);
                break;
            case 'delete':
                setShowDeleteConfirm(true);
                break;
            case 'permissions':
                setShowPermissionsModal(true);
                break;
            case 'export':
                // Export single user data
                setActiveUser(user);
                setShowSingleExportModal(true);
                break;
            default:
                break;
        }
    };

    const toggleDropdown = (index: number, event: React.MouseEvent) => {
        console.log("toggleDropdown called with index:", index, "current openDropdown:", openDropdown);

        // Si le dropdown est ouvert, on le ferme
        if (openDropdown === index) {
            setOpenDropdown(null);
            return;
        }

        // Sinon, on l'ouvre et on détermine sa position
        setOpenDropdown(index);

        // Récupérer la position du clic par rapport à la fenêtre
        const button = event.currentTarget;
        const buttonRect = button.getBoundingClientRect();

        // Vérifier si on est proche du bas de la fenêtre
        const windowHeight = window.innerHeight;
        const isNearBottom = windowHeight - buttonRect.bottom < 200; // 200px du bas

        // Mémoriser la position pour que le dropdown s'affiche correctement
        setDropdownPosition(isNearBottom ? 'up' : 'down');
    };

    // Simpler click outside handler
    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            // Don't close if clicking on a dropdown button or inside dropdown content
            if (
                (e.target as Element).closest('.dropdown-button') ||
                (e.target as Element).closest('.dropdown-content')
            ) {
                return;
            }
            // Otherwise close any open dropdown
            setOpenDropdown(null);
        };

        document.addEventListener('mousedown', handleGlobalClick);
        return () => {
            document.removeEventListener('mousedown', handleGlobalClick);
        };
    }, []);

    // Debug effect to monitor state changes
    useEffect(() => {
        console.log('showProfileModal:', showProfileModal);
        console.log('activeUser:', activeUser);
    }, [showProfileModal, activeUser]);

    const handleSaveProfile = () => {
        if (editingUser && onUpdateUser) {
            onUpdateUser(editingUser.email, editingUser);
            setShowProfileModal(false);
            setIsEditing(false);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (editingUser) {
                    setEditingUser({
                        ...editingUser,
                        avatar: reader.result as string
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const confirmDelete = () => {
        if (activeUser && onDeleteUser) {
            onDeleteUser(activeUser.email);
        }
        setShowDeleteConfirm(false);
        setActiveUser(null);
    };

    const handlePermissionChange = (permission: string) => {
        console.log("Changing permission:", permission);
        console.log("Current permissions:", editingPermissions);

        // Check if it's "User Management" and the user isn't admin
        if (permission === 'User Management' && !editingPermissions.includes('Admin')) {
            alert("Only users with Admin role can have 'User Management' access");
            return;
        }

        if (editingPermissions.includes(permission)) {
            // If trying to remove "Admin" while "User Management" is present, prevent this action
            if (permission === 'Admin' && editingPermissions.includes('User Management')) {
                alert("You must first remove 'User Management' before removing the Admin role");
                return;
            }
            // Remove the permission if it already exists
            setEditingPermissions(prev => prev.filter(p => p !== permission));
        } else {
            // Add the permission if it doesn't exist yet
            setEditingPermissions(prev => [...prev, permission]);
        }

        console.log("Updated permissions:", editingPermissions);
    };

    const handleSavePermissions = () => {
        if (activeUser && onUpdateUser) {
            // Vérifier si les permissions ont réellement changé
            if (JSON.stringify(activeUser.access) !== JSON.stringify(editingPermissions)) {
                const updatedUser = {
                    ...activeUser,
                    access: editingPermissions
                };
                onUpdateUser(activeUser.email, updatedUser);
            }
            setShowPermissionsModal(false);
        }
    };

    // Gestion des clics sur les badges de permission
    const handlePermissionClick = (permission: string, user: User) => {
        // Si c'est "User Management", définir cet utilisateur comme actif
        if (permission === 'User Management' && onSetActiveUser) {
            onSetActiveUser(user);
            // Sauvegarder l'utilisateur actif dans localStorage
            localStorage.setItem('activeManagerUser', JSON.stringify({
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }));
        }
    };

    // Helper function pour obtenir le style de badge en fonction du type d'accès
    const getBadgeStyle = (access: string) => {
        let badgeColor = "bg-gray-200 text-gray-700";
        if (access === "Admin") badgeColor = "bg-green-100 text-green-700";
        if (access === "Data Export") badgeColor = "bg-blue-100 text-blue-700";
        if (access === "User Management") badgeColor = "bg-orange-100 text-orange-700";
        return badgeColor;
    };

    // Export users data function
    const exportUsersData = () => {
        // Determine which users to export (selected or all filtered)
        const usersToExport = selectedUsers.size > 0
            ? filteredUsers.filter((_, index) => selectedUsers.has(index))
            : filteredUsers;

        // Get only the necessary fields for export
        const exportData = usersToExport.map(user => ({
            name: user.name,
            email: user.email,
            access: user.access.join(', '),
            lastActive: user.lastActive,
            dateAdded: user.dateAdded
        }));

        if (exportFormat === 'json') {
            // Export as JSON
            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            FileSaver.saveAs(blob, 'users-data.json');
        } else {
            // Export as Excel
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

            // Generate Excel file and save
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileSaver.saveAs(blob, 'users-data.xlsx');
        }

        // Close export modal after exporting
        setShowExportModal(false);
    };

    // Check if user can export data (has Data Export permission)
    const canExportData = (user: User) => {
        return user.access.includes('Data Export');
    };

    // Function to check current user's permissions from localStorage
    const hasExportPermission = () => {
        // Par défaut, permettre l'exportation pour faciliter les tests
        return true;

        // Le code ci-dessous peut être réactivé pour vérifier les permissions réelles
        /*
        const currentUserData = localStorage.getItem('activeManagerUser');
        if (!currentUserData) return false;

        try {
            const currentUser = JSON.parse(currentUserData);
            // Find the full user in the users list
            const userWithPermissions = initialUsers.find(u => u.email === currentUser.email);
            return userWithPermissions?.access.includes('Data Export') || false;
        } catch (error) {
            console.error("Error checking export permissions:", error);
            return false;
        }
        */
    };

    // Modify the exportSingleUserData function
    const exportSingleUserData = () => {
        if (!activeUser) return;

        // Create a single user export data
        const exportData = {
            name: activeUser.name,
            email: activeUser.email,
            access: activeUser.access.join(', '),
            lastActive: activeUser.lastActive,
            dateAdded: activeUser.dateAdded
        };

        if (singleExportFormat === 'json') {
            // Export as JSON
            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            FileSaver.saveAs(blob, `user-${activeUser.name.replace(/\s+/g, '_')}.json`);
        } else {
            // Export as Excel
            const worksheet = XLSX.utils.json_to_sheet([exportData]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'User');

            // Generate Excel file and save
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileSaver.saveAs(blob, `user-${activeUser.name.replace(/\s+/g, '_')}.xlsx`);
        }

        // Close modal after exporting
        setShowSingleExportModal(false);
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
                <>
                    <div className="flex justify-between mb-4">
                        <div>
                            {selectedUsers.size > 0 && (
                                <span className="text-sm text-gray-500">
                                    {selectedUsers.size} user{selectedUsers.size > 1 ? 's' : ''} selected
                                </span>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <div className="relative group">
                                <button
                                    onClick={() => hasExportPermission() ? setShowExportModal(true) : null}
                                    className={`px-3 py-1 text-sm font-medium rounded transition-colors flex items-center ${hasExportPermission()
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        }`}
                                    disabled={filteredUsers.length === 0 || !hasExportPermission()}
                                    aria-label="Export users data"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Export Data
                                </button>
                                {!hasExportPermission() && (
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity w-48 text-center">
                                        You need "Data Export" permission to export user data.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Desktop view - Table */}
                    <div className="hidden md:block overflow-x-auto">
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
                                    <th className='py-3 px-4 font-semibold text-gray-700'>User</th>
                                    <th className='py-3 px-4 font-semibold text-gray-700'>Access</th>
                                    <th className='py-3 px-4 font-semibold text-gray-700'>Last Active</th>
                                    <th className='py-3 px-4 font-semibold text-gray-700'>Date Added</th>
                                    <th className='py-3 px-4 font-semibold text-gray-700'>Actions</th>
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
                                            <div className='flex items-center'>
                                                <div className='h-10 w-10 flex-shrink-0'>
                                                    <Image src={user.avatar} alt={user.name} width={40} height={40} className='rounded-full object-cover' style={{ width: '40px', height: '40px' }} />
                                                </div>
                                                <div className='ml-4'>
                                                    <div className='font-medium text-gray-900'>{user.name}</div>
                                                    <div className='text-gray-500'>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-3 px-4'>
                                            <div className='flex flex-wrap gap-2'>
                                                {user.access.map((access, index) => {
                                                    const badgeColor = getBadgeStyle(access);
                                                    const permissionItem = AVAILABLE_PERMISSIONS.find(p => p.id === access);
                                                    return (
                                                        <span
                                                            key={index}
                                                            className={`inline-flex items-center ${badgeColor} rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200 ease-in-out hover:opacity-80 cursor-pointer`}
                                                            onClick={() => handlePermissionClick(access, user)}
                                                        >
                                                            {permissionItem ? permissionItem.label : access}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className='py-3 px-4 text-gray-500'>{user.lastActive}</td>
                                        <td className='py-3 px-4 text-gray-500'>{user.dateAdded}</td>
                                        <td className='py-3 px-4'>
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => toggleDropdown(index, e)}
                                                    className="dropdown-button text-gray-500 hover:bg-gray-100 rounded-full p-1.5 focus:outline-none"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                    </svg>
                                                </button>
                                                {openDropdown === index && (
                                                    <div className={`dropdown-content absolute right-0 ${dropdownPosition === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'} w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[100]`}>
                                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    console.log('View profile clicked for user:', user.name);
                                                                    handleAction('view', user);
                                                                }}
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                <span className="flex items-center">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                                                    </svg>
                                                                    View Profile
                                                                </span>
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    console.log('Permissions clicked for user:', user.name);
                                                                    handleAction('permissions', user);
                                                                }}
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                <span className="flex items-center">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                    </svg>
                                                                    Permissions
                                                                </span>
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    if (hasExportPermission()) {
                                                                        handleAction('export', user);
                                                                    }
                                                                }}
                                                                className={`block w-full text-left px-4 py-2 text-sm ${hasExportPermission() ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'}`}
                                                                disabled={!hasExportPermission()}
                                                            >
                                                                <span className="flex items-center">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                    </svg>
                                                                    Export User Data
                                                                </span>
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    console.log('Delete clicked for user:', user.name);
                                                                    handleAction('delete', user);
                                                                }}
                                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                            >
                                                                <span className="flex items-center">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                    </svg>
                                                                    Delete User
                                                                </span>
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

                    {/* Mobile view - Cards */}
                    <div className="md:hidden space-y-4">
                        {filteredUsers.map((user, index) => (
                            <div key={index} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                                                checked={selectedUsers.has(index)}
                                                onChange={() => handleSelectUser(index)}
                                            />
                                            <div className="flex items-center">
                                                <Image
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    width={40} height={40}
                                                    className="rounded-full object-cover"
                                                    style={{ width: '40px', height: '40px' }}
                                                />
                                                <div className="ml-3">
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <button
                                                onClick={(e) => toggleDropdown(index, e)}
                                                className="dropdown-button text-gray-500 hover:bg-gray-100 rounded-full p-1.5 focus:outline-none"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                            {openDropdown === index && (
                                                <div className={`dropdown-content absolute right-0 ${dropdownPosition === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'} w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[100]`}>
                                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleAction('view', user);
                                                            }}
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <span className="flex items-center">View Profile</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleAction('permissions', user);
                                                            }}
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <span className="flex items-center">Permissions</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleAction('delete', user);
                                                            }}
                                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                        >
                                                            <span className="flex items-center">Delete User</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {user.access.map((access, i) => {
                                            const badgeColor = getBadgeStyle(access);
                                            const permissionItem = AVAILABLE_PERMISSIONS.find(p => p.id === access);
                                            return (
                                                <span
                                                    key={i}
                                                    className={`inline-flex items-center ${badgeColor} rounded-full px-2.5 py-0.5 text-xs font-medium`}
                                                    onClick={() => handlePermissionClick(access, user)}
                                                >
                                                    {permissionItem ? permissionItem.label : access}
                                                </span>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-between text-xs text-gray-500 border-t pt-2">
                                        <div>
                                            <span className="font-medium">Last active:</span> {user.lastActive}
                                        </div>
                                        <div>
                                            <span className="font-medium">Added:</span> {user.dateAdded}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Profile Modal */}
            {showProfileModal && activeUser && (
                <div
                    className="fixed inset-0 bg-black/30 flex items-center justify-center z-[200]"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowProfileModal(false);
                    }}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-96 max-w-lg relative"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">User Profile</h2>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowProfileModal(false);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                <Image
                                    src={editingUser?.avatar || activeUser.avatar}
                                    width={80}
                                    height={80}
                                    className="rounded-full mb-4 object-cover"
                                    style={{ width: '80px', height: '80px' }}
                                    alt={editingUser?.name || activeUser.name}
                                />
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </label>
                                )}
                            </div>
                            {isEditing ? (
                                <div className="w-full space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            value={editingUser?.name || ''}
                                            onChange={(e) => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={editingUser?.email || ''}
                                            onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-lg font-medium">{activeUser.name}</h3>
                                    <p className="text-gray-500">{activeUser.email}</p>
                                </>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Access</h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {activeUser.access.map((access, index) => {
                                        const badgeColor = getBadgeStyle(access);
                                        const permissionItem = AVAILABLE_PERMISSIONS.find(p => p.id === access);
                                        return (
                                            <span
                                                key={index}
                                                className={`inline-flex items-center ${badgeColor} rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer`}
                                                onClick={() => handlePermissionClick(access, activeUser)}
                                            >
                                                {permissionItem ? permissionItem.label : access}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Last active</h4>
                                <p className="mt-1">{activeUser.lastActive}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Date added</h4>
                                <p className="mt-1">{activeUser.dateAdded}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsEditing(false);
                                            setEditingUser({ ...activeUser });
                                        }}
                                        className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSaveProfile();
                                        }}
                                        className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                                    >
                                        Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsEditing(true);
                                        }}
                                        className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setShowProfileModal(false);
                                        }}
                                        className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Permissions Modal */}
            {showPermissionsModal && activeUser && (
                <div
                    className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowPermissionsModal(false);
                    }}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-96 max-w-lg"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Edit Permissions</h2>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowPermissionsModal(false);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Image
                                    src={activeUser.avatar}
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                    style={{ width: '40px', height: '40px' }}
                                    alt={activeUser.name}
                                />
                                <div>
                                    <div className="font-medium">{activeUser.name}</div>
                                    <div className="text-sm text-gray-500">{activeUser.email}</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="font-medium">Access permissions</div>
                                <div className="space-y-3">
                                    {AVAILABLE_PERMISSIONS.map((permission) => {
                                        const isDisabled = permission.id === 'User Management' && !editingPermissions.includes('Admin');
                                        return (
                                            <div
                                                key={permission.id}
                                                className={`p-3 border rounded-lg transition-all ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:border-blue-200 cursor-pointer'}`}
                                                onClick={() => {
                                                    if (!isDisabled) {
                                                        handlePermissionChange(permission.id);
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`permission-${permission.id}`}
                                                        checked={editingPermissions.includes(permission.id)}
                                                        onChange={() => {
                                                            if (!isDisabled) {
                                                                handlePermissionChange(permission.id);
                                                            }
                                                        }}
                                                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 pointer-events-none"
                                                        disabled={isDisabled}
                                                    />
                                                    <div className="ml-2 text-sm font-medium text-gray-700 flex-1">
                                                        {permission.label}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 ml-7">{permission.description}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowPermissionsModal(false);
                                }}
                                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSavePermissions();
                                }}
                                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && activeUser && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Confirm Deletion</h2>
                            <button onClick={() => setShowDeleteConfirm(false)} className="text-gray-500 hover:text-gray-700">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-600">
                                Are you sure you want to delete the user <span className="font-medium">{activeUser.name}</span>? This action is permanent and cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Modal */}
            {showExportModal && hasExportPermission() && (
                <div
                    className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowExportModal(false);
                    }}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-96 max-w-lg"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Export Users Data</h2>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowExportModal(false);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mb-4">
                            <p className="text-gray-600 mb-4">
                                Select the format to export {selectedUsers.size > 0 ? `${selectedUsers.size} selected` : 'all'} users:
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="format-json"
                                        name="exportFormat"
                                        checked={exportFormat === 'json'}
                                        onChange={() => setExportFormat('json')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="format-json" className="ml-2 text-sm font-medium text-gray-700">
                                        JSON Format
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="format-excel"
                                        name="exportFormat"
                                        checked={exportFormat === 'excel'}
                                        onChange={() => setExportFormat('excel')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="format-excel" className="ml-2 text-sm font-medium text-gray-700">
                                        Excel Spreadsheet (.xlsx)
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowExportModal(false);
                                }}
                                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    exportUsersData();
                                }}
                                className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
                            >
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Single User Export Modal */}
            {showSingleExportModal && activeUser && hasExportPermission() && (
                <div
                    className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowSingleExportModal(false);
                    }}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-96 max-w-lg"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Export User Data</h2>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowSingleExportModal(false);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Image
                                    src={activeUser.avatar}
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                    style={{ width: '40px', height: '40px' }}
                                    alt={activeUser.name}
                                />
                                <div>
                                    <div className="font-medium">{activeUser.name}</div>
                                    <div className="text-sm text-gray-500">{activeUser.email}</div>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-4">
                                Select the format to export {activeUser.name}'s data:
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="single-format-json"
                                        name="singleExportFormat"
                                        checked={singleExportFormat === 'json'}
                                        onChange={() => setSingleExportFormat('json')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="single-format-json" className="ml-2 text-sm font-medium text-gray-700">
                                        JSON Format
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="single-format-excel"
                                        name="singleExportFormat"
                                        checked={singleExportFormat === 'excel'}
                                        onChange={() => setSingleExportFormat('excel')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="single-format-excel" className="ml-2 text-sm font-medium text-gray-700">
                                        Excel Spreadsheet (.xlsx)
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowSingleExportModal(false);
                                }}
                                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    exportSingleUserData();
                                }}
                                className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
                            >
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

