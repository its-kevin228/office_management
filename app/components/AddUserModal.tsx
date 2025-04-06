"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Upload, UserCircle } from 'lucide-react';

interface AccessOption {
    id: string;
    label: string;
    description: string;
}

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddUser: (user: any) => void;
}

export default function AddUserModal({ isOpen, onClose, onAddUser }: AddUserModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        profileImage: undefined as File | undefined,
        access: [] as string[]
    });
    const [showPassword, setShowPassword] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const accessOptions: AccessOption[] = [
        { id: 'Admin', label: 'Admin', description: 'Full access to all features' },
        { id: 'Data Export', label: 'Data Export', description: 'Can export data' },
        { id: 'User Management', label: 'User Management', description: 'Can manage users (Admin only)' }
    ];

    useEffect(() => {
        if (!formData.access.includes('Admin') && formData.access.includes('User Management')) {
            setFormData(prev => ({
                ...prev,
                access: prev.access.filter(a => a !== 'User Management')
            }));
        }
    }, [formData.access]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Vérifier que les champs obligatoires sont remplis
        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
            alert("Veuillez remplir tous les champs obligatoires (nom, email, mot de passe).");
            return;
        }

        const newUser = {
            ...formData,
            id: Date.now(),
            avatar: previewUrl || '/default-avatar.png',
            lastActive: new Date().toLocaleDateString(),
            dateAdded: new Date().toLocaleDateString()
        };

        onAddUser(newUser);

        setFormData({
            name: '',
            email: '',
            password: '',
            profileImage: undefined,
            access: []
        });
        setPreviewUrl(null);

        onClose();
    };

    const handleAccessChange = (accessId: string) => {
        if (accessId === 'User Management' && !formData.access.includes('Admin')) {
            alert("You must select Admin role first before enabling User Management");
            return;
        }

        if (accessId === 'Admin' && formData.access.includes('Admin') && formData.access.includes('User Management')) {
            alert("You must remove User Management before removing Admin role");
            return;
        }

        setFormData(prev => ({
            ...prev,
            access: prev.access.includes(accessId)
                ? prev.access.filter(a => a !== accessId)
                : [...prev.access, accessId]
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                profileImage: file
            }));

            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleProfileImageClick = () => {
        fileInputRef.current?.click();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed right-0 top-0 mt-16 mr-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Add User</h2>
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
                    <div className="mb-4 flex flex-col items-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2 self-start">
                            Profile Picture
                        </label>
                        <div
                            onClick={handleProfileImageClick}
                            className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer border border-dashed border-gray-300 hover:bg-gray-50 transition-colors overflow-hidden"
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                    <UserCircle className="w-12 h-12" />
                                    <span className="text-xs mt-1">Add</span>
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
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
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Access
                        </label>
                        <div className="space-y-2">
                            {accessOptions.map((option) => (
                                <div key={option.id} className={`p-3 border rounded-lg hover:bg-gray-50 ${option.id === 'User Management' && !formData.access.includes('Admin')
                                    ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                    }`}>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`access-${option.id}`}
                                            checked={formData.access.includes(option.id)}
                                            onChange={() => handleAccessChange(option.id)}
                                            className={`h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${option.id === 'User Management' && !formData.access.includes('Admin')
                                                ? 'cursor-not-allowed' : 'cursor-pointer'
                                                }`}
                                            disabled={option.id === 'User Management' && !formData.access.includes('Admin')}
                                        />
                                        <label htmlFor={`access-${option.id}`} className="ml-2 text-sm font-medium text-gray-700 cursor-pointer flex-1">
                                            {option.label}
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 ml-7">{option.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Add User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}