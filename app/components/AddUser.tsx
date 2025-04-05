"use client"
import React, { useState } from 'react';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddUser: (user: {
        name: string;
        email: string;
        access: string[];
    }) => void;
}

export default function AddUserModal({ isOpen, onClose, onAddUser }: AddUserModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        access: [] as string[]
    });

    const accessOptions = ['Admin', 'Data Export', 'Data Import'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddUser(formData);
        setFormData({ name: '', email: '', access: [] });
        onClose();
    };

    const handleAccessChange = (access: string) => {
        setFormData(prev => ({
            ...prev,
            access: prev.access.includes(access)
                ? prev.access.filter(a => a !== access)
                : [...prev.access, access]
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed right-0 top-0 mt-16 mr-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Ajouter un utilisateur</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom complet
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Accès
                        </label>
                        <div className="space-y-2">
                            {accessOptions.map((access) => (
                                <label key={access} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.access.includes(access)}
                                        onChange={() => handleAccessChange(access)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{access}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 