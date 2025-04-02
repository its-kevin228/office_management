"use client"
import React, { useState } from 'react'
import Image from 'next/image'

export default function UserTable() {
    interface User {
        name: string;
        email: string;
        avatar: string;
        access: string[];
        lastActive: string;
        dateAdded: string;
        selected?: boolean;
    }

    const users: User[] = [
        { name: "Florence Shaw", email: "florence@untitledui.com", avatar: "/avatar.jpg", access: ["Admin", "Data Export", "Data Import"], lastActive: "Mar 4, 2024", dateAdded: "July 4, 2022" },
        { name: "Amélie Laurent", email: "amelie@untitledui.com", avatar: "/avatar.jpg", access: ["Admin", "Data Export", "Data Import"], lastActive: "Mar 4, 2024", dateAdded: "July 4, 2022" },
        { name: "Ammar Foley", email: "ammar@untitledui.com", avatar: "/avatar.jpg", access: ["Data Export", "Data Import"], lastActive: "Mar 2, 2024", dateAdded: "July 4, 2022" },
        { name: "Caitlyn King", email: "caitlyn@untitledui.com", avatar: "/avatar.jpg", access: ["Data Export", "Data Import"], lastActive: "Mar 6, 2024", dateAdded: "July 4, 2022" },
        { name: "Marcus Chen", email: "marcus@untitledui.com", avatar: "/avatar.jpg", access: ["Admin"], lastActive: "Mar 7, 2024", dateAdded: "Aug 15, 2022" },
        { name: "Sofia Rodriguez", email: "sofia@untitledui.com", avatar: "/avatar.jpg", access: ["Data Export"], lastActive: "Mar 5, 2024", dateAdded: "Sep 1, 2022" },
        { name: "Lucas Kim", email: "lucas@untitledui.com", avatar: "/avatar.jpg", access: ["Data Import", "Data Export"], lastActive: "Mar 3, 2024", dateAdded: "Oct 12, 2022" },
        { name: "Emma Thompson", email: "emma@untitledui.com", avatar: "/avatar.jpg", access: ["Admin", "Data Export"], lastActive: "Mar 1, 2024", dateAdded: "Nov 20, 2022" },
        { name: "Aiden Patel", email: "aiden@untitledui.com", avatar: "/avatar.jpg", access: ["Data Import"], lastActive: "Mar 7, 2024", dateAdded: "Dec 5, 2022" },
        { name: "Olivia Wilson", email: "olivia@untitledui.com", avatar: "/avatar.jpg", access: ["Admin", "Data Import"], lastActive: "Mar 6, 2024", dateAdded: "Jan 15, 2023" }
    ];

    const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
    const [selectAll, setSelectAll] = useState(false);

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(users.map((_, index) => index)));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectUser = (index: number) => {
        const newSelected = new Set(selectedUsers);
        if (selectedUsers.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedUsers(newSelected);
        setSelectAll(newSelected.size === users.length);
    };

    return (
        <div className='p-6 bg-white rounded-xl shadow-md'>
            <table className='w-full text-left text-sm border-collapse'>
                <thead>
                    <tr className='border-b'>
                        <th className='py-3 px-4 font-medium text-gray-500'>
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all duration-200 ease-in-out cursor-pointer"
                                checked={selectAll}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th className='py-3 px-4 font-medium text-gray-500'>User</th>
                        <th className='py-3 px-4 font-medium text-gray-500'>Access</th>
                        <th className='py-3 px-4 font-medium text-gray-500'>Last Active</th>
                        <th className='py-3 px-4 font-medium text-gray-500'>Date Added</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index} className='border-b hover:bg-gray-50 transition-colors duration-150 ease-in-out'>
                            <td className='py-3 px-4'>
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all duration-200 ease-in-out cursor-pointer"
                                    checked={selectedUsers.has(index)}
                                    onChange={() => handleSelectUser(index)}
                                />
                            </td>
                            <td className='py-3 px-4'>
                                <div className='flex items-center gap-3'>
                                    <Image
                                        src={user.avatar}
                                        width={40} height={40}
                                        className='rounded-full'
                                        alt={user.name}
                                    />
                                    <div>
                                        <div className='font-medium text-gray-900'>{user.name}</div>
                                        <div className='text-sm text-gray-500'>{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className='py-3 px-4'>
                                <div className='flex flex-wrap gap-2'>
                                    {user.access.map((access, index) => {
                                        let badgeColor = "bg-gray-200 text-gray-700";
                                        if (access === "Admin") badgeColor = "bg-green-100 text-green-700";
                                        if (access === "Data Export") badgeColor = "bg-blue-100 text-blue-700";
                                        if (access === "Data Import") badgeColor = "bg-purple-100 text-purple-700";
                                        return (
                                            <span key={index} className={`inline-flex items-center ${badgeColor} rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200 ease-in-out hover:opacity-80`}>
                                                {access}
                                            </span>
                                        );
                                    })}
                                </div>
                            </td>
                            <td className='py-3 px-4 text-gray-500'>{user.lastActive}</td>
                            <td className='py-3 px-4 text-gray-500'>{user.dateAdded}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
