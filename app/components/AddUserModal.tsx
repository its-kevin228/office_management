'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Upload, UserCircle, X } from 'lucide-react';

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
        access: [] as string[],
    });
    const [showPassword, setShowPassword] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const accessOptions: AccessOption[] = [
        { id: 'Admin', label: 'Admin', description: 'Full access to all features' },
        { id: 'Data Export', label: 'Data Export', description: 'Can export data' },
        { id: 'User Management', label: 'User Management', description: 'Can manage users (Admin only)' },
    ];

    useEffect(() => {
        if (!formData.access.includes('Admin') && formData.access.includes('User Management')) {
            setFormData((prev) => ({
                ...prev,
                access: prev.access.filter((a) => a !== 'User Management'),
            }));
        }
    }, [formData.access]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        const newUser = {
            ...formData,
            id: Date.now(),
            avatar: previewUrl || '/default-avatar.png',
            lastActive: new Date().toLocaleDateString(),
            dateAdded: new Date().toLocaleDateString(),
        };

        onAddUser(newUser);
        setFormData({ name: '', email: '', password: '', profileImage: undefined, access: [] });
        setPreviewUrl(null);
        onClose();
    };

    const handleAccessChange = (accessId: string) => {
        if (accessId === 'User Management' && !formData.access.includes('Admin')) {
            alert('Select Admin role before enabling User Management');
            return;
        }

        if (accessId === 'Admin' && formData.access.includes('Admin') && formData.access.includes('User Management')) {
            alert('Remove User Management before removing Admin role');
            return;
        }

        setFormData((prev) => ({
            ...prev,
            access: prev.access.includes(accessId)
                ? prev.access.filter((a) => a !== accessId)
                : [...prev.access, accessId],
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prev) => ({ ...prev, profileImage: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleProfileImageClick = () => fileInputRef.current?.click();
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm animate-slideIn space-y-5 relative overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-semibold text-gray-800 text-center">Add New User</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-2">
                        <div
                            onClick={handleProfileImageClick}
                            className="w-24 h-24 rounded-full bg-gray-100 border border-dashed border-gray-300 hover:bg-gray-200 cursor-pointer flex items-center justify-center overflow-hidden transition-all hover:scale-105"
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <UserCircle className="w-12 h-12 text-gray-400" />
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <span className="text-xs text-gray-500">Tap to upload profile</span>
                    </div>

                    {/* Name */}
                    <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />

                    {/* Password */}
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Access */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Access</label>
                        <div className="mt-2 grid gap-2">
                            {accessOptions.map((option) => {
                                const isDisabled = option.id === 'User Management' && !formData.access.includes('Admin');
                                return (
                                    <label
                                        key={option.id}
                                        className={`flex items-start p-3 border rounded-lg gap-3 transition-all ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.access.includes(option.id)}
                                            disabled={isDisabled}
                                            onChange={() => handleAccessChange(option.id)}
                                            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <div>
                                            <span className="block text-sm font-medium text-gray-800">{option.label}</span>
                                            <span className="text-xs text-gray-500">{option.description}</span>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-all duration-200"
                    >
                        Add User
                    </button>
                </form>
            </div>
        </div>
    );
}
