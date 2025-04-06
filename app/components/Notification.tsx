"use client"
import React, { useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
    message: string;
    type: NotificationType;
    isVisible: boolean;
    onClose: () => void;
}

const Notification = ({ message, type, isVisible, onClose }: NotificationProps) => {
    // Auto-close notification after 5 seconds
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isVisible) {
            timer = setTimeout(() => {
                onClose();
            }, 5000);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    // Define styles based on notification type
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    let iconColor = 'text-gray-500';
    let borderColor = 'border-gray-300';
    let icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    switch (type) {
        case 'success':
            bgColor = 'bg-green-50';
            textColor = 'text-green-800';
            iconColor = 'text-green-500';
            borderColor = 'border-green-300';
            icon = (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
            break;
        case 'error':
            bgColor = 'bg-red-50';
            textColor = 'text-red-800';
            iconColor = 'text-red-500';
            borderColor = 'border-red-300';
            icon = (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
            break;
        case 'warning':
            bgColor = 'bg-yellow-50';
            textColor = 'text-yellow-800';
            iconColor = 'text-yellow-500';
            borderColor = 'border-yellow-300';
            icon = (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            );
            break;
        case 'info':
            bgColor = 'bg-blue-50';
            textColor = 'text-blue-800';
            iconColor = 'text-blue-500';
            borderColor = 'border-blue-300';
            icon = (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
            break;
    }

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div className={`flex items-center p-4 mb-4 border rounded-md shadow-md ${bgColor} ${borderColor}`}>
                <div className={`flex-shrink-0 ${iconColor}`}>
                    {icon}
                </div>
                <div className={`ml-3 ${textColor} font-medium`}>
                    {message}
                </div>
                <button
                    type="button"
                    className={`ml-auto -mx-1.5 -my-1.5 ${bgColor} ${textColor} rounded-lg focus:ring-2 focus:ring-${type === 'info' ? 'blue' : type === 'success' ? 'green' : type === 'error' ? 'red' : 'yellow'}-400 p-1.5 inline-flex h-8 w-8 hover:bg-opacity-80`}
                    onClick={onClose}
                    aria-label="Close"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Notification; 