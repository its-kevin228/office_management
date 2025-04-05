"use client"
import React from 'react';
import Image from 'next/image';

interface User {
    name: string;
    email: string;
    avatar: string;
    access: string[];
    lastActive: string;
    dateAdded: string;
}

interface ViewProfileModalProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ViewProfileModal({ user, isOpen, onClose }: ViewProfileModalProps) {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Profile Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-24 h-24 mb-4">
                        <Image
                            src={user.avatar}
                            alt={user.name}
                            fill
                            className="rounded-full object-cover"
                        />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                    <p className="text-gray-500">{user.email}</p>
                </div>
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Access Levels</h4>
                        <div className="flex flex-wrap gap-2">
                            {user.access.map((access) => (
                                <span
                                    key={access}
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        access === 'Admin' ? 'bg-purple-100 text-purple-800' :
                                        access === 'Data Export' ? 'bg-green-100 text-green-800' :
                                        'bg-orange-100 text-orange-800'
                                    }`}
                                >
                                    {access}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Last Active</h4>
                            <p className="text-sm text-gray-500">{user.lastActive}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Date Added</h4>
                            <p className="text-sm text-gray-500">{user.dateAdded}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}