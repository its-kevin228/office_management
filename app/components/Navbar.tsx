import React from 'react'
import Image from 'next/image'

export default function Navbar() {
    return (
        <nav className='flex justify-between items-center p-4 bg-white rounded-md'>
            <div className='flex items-center space-x-4'>
                <div className='flex items-center space-x-2'>
                    <div className='w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center'>
                        <svg className='w-5 h-5 text-pink-600' viewBox='0 0 24 24' fill='currentColor'>
                            <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/>
                        </svg>
                    </div>
                    <span className='font-semibold text-lg'>Sisyphus Ventures</span>
                </div>
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
