import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface NavbarProps {
    activeUser?: {
        name: string;
        avatar: string;
        email: string;
    } | null;
}

export default function Navbar({ activeUser }: NavbarProps) {
    const [defaultImage, setDefaultImage] = useState("/profile.jpg");
    const [userName, setUserName] = useState("Florence Shaw");

    useEffect(() => {
        if (activeUser) {
            setUserName(activeUser.name);
        } else {
            // Get from localStorage if available
            const storedActiveUser = localStorage.getItem('activeManagerUser');
            if (storedActiveUser) {
                try {
                    const parsedUser = JSON.parse(storedActiveUser);
                    setUserName(parsedUser.name);
                    if (parsedUser.avatar) {
                        setDefaultImage(parsedUser.avatar);
                    }
                } catch (error) {
                    console.error("Error parsing stored user:", error);
                }
            }
        }
    }, [activeUser]);

    return (
        <nav className='flex justify-between items-center p-4 bg-white rounded-md'>
            <div className='flex items-center space-x-4'>
                <div className='ml-8'>
                    <h1 className='text-xl font-semibold'>User management</h1>
                    <p className='text-gray-500 text-sm mt-1'>Manage your team members and their account permissions here</p>
                </div>
            </div>
            <div className='flex items-center space-x-2'>
                <Image
                    src={activeUser?.avatar || defaultImage}
                    alt={userName}
                    width={40} height={40}
                    className='rounded-full object-cover'
                    style={{ width: '40px', height: '40px' }}
                />
                <span className='font-medium'>{userName}</span>
            </div>
        </nav>
    )
}
