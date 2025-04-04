"use client";
import { useState } from "react";

export default function SearchBar({ onSearchAction }: { onSearchAction: (query: string) => void }) {
    const [query, setQuery] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        onSearchAction(newQuery);
    };

    return (
        <div className="flex items-center space-x-2">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search"
                className="border rounded-lg px-4 py-2 w-full"
            />
        </div>
    );
}
