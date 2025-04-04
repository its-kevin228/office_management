import React, { useState } from 'react';
import { UserPlus, Search, Calendar } from 'lucide-react';

export default function Filters() {
    const [isNameFilterOpen, setIsNameFilterOpen] = useState(false);
    const [isAccessFilterOpen, setIsAccessFilterOpen] = useState(false);
    const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
    const [nameFilter, setNameFilter] = useState('');
    const [selectedAccess, setSelectedAccess] = useState([]);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const accessLevels = ['Admin', 'Data Export', 'Data Import'];

    return (
        <div className="flex items-center space-x-4">
            {/* Name Filter */}
            <div className="relative">
                <button
                    onClick={() => setIsNameFilterOpen(!isNameFilterOpen)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <div className="flex items-center">
                        <Search className="w-5 h-5 mr-2" />
                        Name Filter
                    </div>
                </button>
                {isNameFilterOpen && (
                    <div className="absolute z-10 w-64 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            className="w-full p-2 text-sm border-b border-gray-300"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {/* Access Level Filter */}
            <div className="relative">
                <button
                    onClick={() => setIsAccessFilterOpen(!isAccessFilterOpen)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Access Filter
                    </div>
                </button>
                {isAccessFilterOpen && (
                    <div className="absolute z-10 w-64 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {accessLevels.map((level) => (
                            <label key={level} className="flex items-center p-2 hover:bg-gray-100">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedAccess.includes(level)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedAccess([...selectedAccess, level]);
                                        } else {
                                            setSelectedAccess(selectedAccess.filter(item => item !== level));
                                        }
                                    }}
                                />
                                {level}
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Date Filter */}
            <div className="relative">
                <button
                    onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Date Filter
                    </div>
                </button>
                {isDateFilterOpen && (
                    <div className="absolute z-10 w-64 mt-2 p-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <div className="space-y-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                    type="date"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                <input
                                    type="date"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button className="btn btn-primary w-48 flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <UserPlus className="w-5 h-5 mr-2" />
                Add user
            </button>
        </div>
    );
}