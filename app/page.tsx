"use client";
import Navbar from "./components/Navbar";
import UserTable from "./components/UserTable";
import Pagination from "./components/Pagination";
import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";

export default function Home() {
  const handleSearch = (query: string) => {
    console.log("Recherche pour :", query);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold">All users 44</h2>
          </div>
          <div className="flex items-center space-x-4">
            <SearchBar  onSearchAction={handleSearch}/>
            <Filters />
          </div>
        </div>
        <UserTable />
        <Pagination />
      </div>
    </div>
  );
}
