"use client"
import React, { useState } from 'react';

interface User {
    name: string;
    email: string;
    avatar: string;
    access: string[];
    lastActive: string;
    dateAdded: string;
}

interface ManagePermissionsModalProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdatePermissions: (userId: string, newAccess: string[]) => void;
}

export default function ManagePermissionsModal({ user, isOpen, onClose, onUpdatePermissions }: ManagePermissionsModalProps) {
    const [selectedAccess, setSelectedAccess] = useState<string[]>([]);
    const accessOptions = ['Admin', 'Data Export', 'Data Import'];

    React.useEffect(() => {
        if (user) {
            setSelectedAccess(user.access);
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleAccessChange = (access: string) => {
        setSelectedAccess(prev =>
            prev.includes(access)
                ? prev.filter(a => a !== access)
                : [...prev, access]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdatePermissions(user.email, selectedAccess);
        onClose();

        // Show success toast
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        toast.textContent = 'Permissions updated successfully';
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Manage Permissions</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="mb-4">
                    <p className="text-sm text-gray-500">Managing permissions for <span className="font-medium text-gray-900">{user.name}</span></p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Access Levels</h3>
                        <div className="space-y-2">
                            {accessOptions.map((access) => (
                                <label key={access} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedAccess.includes(access)}
                                        onChange={() => handleAccessChange(access)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{access}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}