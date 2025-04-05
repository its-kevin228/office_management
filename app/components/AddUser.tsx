"use client"
import React, { useState } from 'react';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddUser: (user: {
        name: string;
        email: string;
        access: string[];
        avatar: string;
    }) => void;
}

export default function AddUserModal({ isOpen, onClose, onAddUser }: AddUserModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        access: [] as string[],
        avatar: '/avatar.jpg'
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const accessOptions = ['Admin', 'Data Export', 'Data Import'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim()) {
            alert('Please fill in all required fields');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            alert('Please enter a valid email address');
            return;
        }
        if (formData.access.length === 0) {
            alert('Please select at least one access level');
            return;
        }
        onAddUser({
            ...formData,
            name: formData.name.trim(),
            email: formData.email.trim(),
            avatar: selectedImage || '/avatar.jpg'
        });
        setFormData({ name: '', email: '', access: [], avatar: '/avatar.jpg' });
        setSelectedImage(null);
        onClose();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file');
                return;
            }
            if (file.size > 5000000) { // 5MB limit
                alert('Image size too large. Please choose an image under 5MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setSelectedImage(result);
            };
            reader.onerror = () => {
                alert('Error reading image file');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
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
        <div className="fixed right-0 top-0 mt-16 mr-4 z-50 w-full sm:w-auto max-w-[95vw] sm:max-w-none">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full sm:w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base sm:text-lg font-semibold">Ajouter un utilisateur</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all duration-200"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-center">
                        <div className="relative inline-block">
                            <img
                                src={selectedImage || '/avatar.jpg'}
                                alt="Profile"
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover cursor-pointer border-2 border-gray-200 hover:border-blue-500 transition-colors"
                                onClick={handleImageClick}
                            />
                            <div
                                className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 sm:p-2 cursor-pointer hover:bg-blue-700 transition-colors shadow-md"
                                onClick={handleImageClick}
                            >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Nom complet
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                Accès
                            </label>
                            <div className="space-y-2">
                                {accessOptions.map((access) => (
                                    <label key={access} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.access.includes(access)}
                                            onChange={() => handleAccessChange(access)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{access}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                        Ajouter
                    </button>
                </form>
            </div>
        </div>
    );
}