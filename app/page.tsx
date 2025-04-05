"use client";
import Navbar from "./components/Navbar";
import UserTable from "./components/UserTable";
import Pagination from "./components/Pagination";
import Filters from "./components/Filters";
import { useState } from 'react';

interface Filters {
  name: string;
  access: string[];
  dateRange: {
    start: string;
    end: string;
  };
}

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    name: '',
    access: [],
    dateRange: { start: '', end: '' }
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold">All users 44</h2>
          </div>
          <div className="flex items-center space-x-4">
            <Filters onFilterChange={setFilters} />
          </div>
        </div>
        <UserTable filters={filters} />
        <Pagination />
      </div>
    </div>
  );
}
