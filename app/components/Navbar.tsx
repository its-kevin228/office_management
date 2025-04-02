import React from 'react'
import Image from 'next/image'

export default function Navbar() {
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
                    src="/profile.jpg"
                    alt="Florence Shaw"
                    width={40} height={40}
                    className='rounded-full'
                />
                <span className='font-medium'>Florence Shaw</span>
            </div>
        </nav>
    )
}
