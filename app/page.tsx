"use client"
import Navbar from "./components/Navbar";
import UserTable from "./components/UserTable";
import Pagination from "./components/Pagination";
import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";
import { useState, useMemo, useEffect } from "react";

interface User {
  name: string;
  email: string;
  avatar: string;
  access: string[];
  lastActive: string;
  dateAdded: string;
}

interface SortFilters {
  filters: string[];
  sortOrder: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [users, setUsers] = useState<User[]>(defaultUsers);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUsers = localStorage.getItem('users');
      try {
        if (savedUsers) {
          const parsedUsers = JSON.parse(savedUsers);
          if (Array.isArray(parsedUsers) && parsedUsers.every(user =>
            typeof user === 'object' &&
            typeof user.name === 'string' &&
            typeof user.email === 'string' &&
            Array.isArray(user.access) &&
            typeof user.lastActive === 'string' &&
            typeof user.dateAdded === 'string'
          )) {
            setUsers(parsedUsers);
          } else {
            console.error('Invalid user data structure in localStorage');
          }
        }
      } catch (error) {
        console.error('Error parsing users from localStorage:', error);
      }
    }
  }, []);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const compareResult = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? compareResult : -compareResult;
    });
  }, [users, sortOrder]);

  const filteredUsers = useMemo(() => {
    return sortedUsers.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" ||
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);

      const matchesFilters = activeFilters.length === 0 ||
        activeFilters.every(filter => user.access.includes(filter));

      return matchesSearch && matchesFilters;
    });
  }, [sortedUsers, searchTerm, activeFilters]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('users', JSON.stringify(users));
      } catch (error) {
        console.error('Error saving users to localStorage:', error);
      }
    }
  }, [users]);

  const handleAddUser = (newUser: { name: string; email: string; access: string[] }) => {
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const nameLower = newUser.name.toLowerCase();
    const emailLower = newUser.email.toLowerCase();

    const isDuplicateName = users.some(user => user.name.toLowerCase() === nameLower);
    const isDuplicateEmail = users.some(user => user.email.toLowerCase() === emailLower);

    if (isDuplicateName) {
      alert('A user with this name already exists.');
      return;
    }

    if (isDuplicateEmail) {
      alert('A user with this email already exists.');
      return;
    }

    setUsers(prevUsers => [...prevUsers, {
      ...newUser,
      avatar: "/avatar.jpg",
      lastActive: currentDate,
      dateAdded: currentDate
    }]);
  };

  const onApplyFilters = (selectedFilters: SortFilters): void => {
    setActiveFilters(selectedFilters.filters);
    setSortOrder(selectedFilters.sortOrder);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold">All users <span className="text-gray-500">{filteredUsers.length}</span></h2>
          </div>
          <div className="flex items-center space-x-4">
            <SearchBar onSearch={handleSearch} />
            <Filters
              onAddUser={handleAddUser}
              onApplyFilters={onApplyFilters}
              activeFilters={activeFilters}
            />
          </div>
        </div>
        <UserTable searchTerm={searchTerm} users={paginatedUsers} activeFilters={activeFilters} />
        <Pagination
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

const defaultUsers = [
  { name: "Florence Shaw", email: "florence@untitledui.com", avatar: "/avatar.jpg", access: ["Admin", "Data Export", "Data Import"], lastActive: "Mar 4, 2024", dateAdded: "July 4, 2022" },
  { name: "Amélie Laurent", email: "amelie@untitledui.com", avatar: "/avatar.jpg", access: ["Admin", "Data Export", "Data Import"], lastActive: "Mar 4, 2024", dateAdded: "July 4, 2022" },
  { name: "Ammar Foley", email: "ammar@untitledui.com", avatar: "/avatar.jpg", access: ["Data Export", "Data Import"], lastActive: "Mar 2, 2024", dateAdded: "July 4, 2022" },
  { name: "Caitlyn King", email: "caitlyn@untitledui.com", avatar: "/avatar.jpg", access: ["Data Export", "Data Import"], lastActive: "Mar 6, 2024", dateAdded: "July 4, 2022" },
  { name: "Marcus Chen", email: "marcus@untitledui.com", avatar: "/avatar.jpg", access: ["Admin"], lastActive: "Mar 7, 2024", dateAdded: "Aug 15, 2022" },
  { name: "Sofia Rodriguez", email: "sofia@untitledui.com", avatar: "/avatar.jpg", access: ["Data Export"], lastActive: "Mar 5, 2024", dateAdded: "Sep 1, 2022" },
  { name: "Lucas Kim", email: "lucas@untitledui.com", avatar: "/avatar.jpg", access: ["Data Import", "Data Export"], lastActive: "Mar 3, 2024", dateAdded: "Oct 12, 2022" },
  { name: "Emma Thompson", email: "emma@untitledui.com", avatar: "/avatar.jpg", access: ["Admin", "Data Export"], lastActive: "Mar 1, 2024", dateAdded: "Nov 20, 2022" },
  { name: "Aiden Patel", email: "aiden@untitledui.com", avatar: "/avatar.jpg", access: ["Data Import"], lastActive: "Mar 7, 2024", dateAdded: "Dec 5, 2022" },
  { name: "Olivia Wilson", email: "olivia@untitledui.com", avatar: "/avatar.jpg", access: ["Admin", "Data Import"], lastActive: "Mar 6, 2024", dateAdded: "Jan 15, 2023" },
  { name: "Liam Johnson", email: "liam@untitledui.com", avatar: "/avatar.jpg", access: ["Admin", "Data Export"], lastActive: "Mar 8, 2024", dateAdded: "Feb 1, 2023" },
  { name: "Sophia Martinez", email: "sophia@untitledui.com", avatar: "/avatar.jpg", access: ["Data Import"], lastActive: "Mar 7, 2024", dateAdded: "Mar 15, 2023" },
  { name: "Noah Williams", email: "noah@untitledui.com", avatar: "/avatar.jpg", access: ["Admin", "Data Export", "Data Import"], lastActive: "Mar 6, 2024", dateAdded: "Apr 20, 2023" },
  { name: "Isabella Brown", email: "isabella@untitledui.com", avatar: "/avatar.jpg", access: ["Data Export"], lastActive: "Mar 5, 2024", dateAdded: "May 10, 2023" },
  { name: "Ethan Davis", email: "ethan@untitledui.com", avatar: "/avatar.jpg", access: ["Data Import"], lastActive: "Mar 4, 2024", dateAdded: "Jun 25, 2023" },
  { name: "Mia Garcia", email: "mia@untitledui.com", avatar: "/avatar.jpg", access: ["Admin", "Data Export"], lastActive: "Mar 3, 2024", dateAdded: "Jul 15, 2023" },
  { name: "Alexander Rodriguez", email: "alexander@untitledui.com", avatar: "/avatar.jpg", access: ["Data Import", "Data Export"], lastActive: "Mar 2, 2024", dateAdded: "Aug 30, 2023" },
  { name: "Charlotte Wilson", email: "charlotte@untitledui.com", avatar: "/avatar.jpg", access: ["Admin"], lastActive: "Mar 1, 2024", dateAdded: "Sep 10, 2023" },
  { name: "Benjamin Anderson", email: "benjamin@untitledui.com", avatar: "/avatar.jpg", access: ["Data Export", "Data Import"], lastActive: "Mar 8, 2024", dateAdded: "Oct 5, 2023" },
  { name: "Amelia Thomas", email: "amelia@untitledui.com", avatar: "/avatar.jpg", access: ["Admin", "Data Import"], lastActive: "Mar 7, 2024", dateAdded: "Nov 20, 2023" },
  { name: "William Moore", email: "william@untitledui.com", avatar: "/avatar.jpg", access: ["Data Export"], lastActive: "Mar 6, 2024", dateAdded: "Dec 15, 2023" },
  { name: "Harper Taylor", email: "harper@untitledui.com", avatar: "/avatar.jpg", access: ["Admin", "Data Export", "Data Import"], lastActive: "Mar 5, 2024", dateAdded: "Jan 5, 2024" },
  { name: "James Jackson", email: "james@untitledui.com", avatar: "/avatar.jpg", access: ["Data Import"], lastActive: "Mar 4, 2024", dateAdded: "Feb 10, 2024" },
  { name: "Evelyn White", email: "evelyn@untitledui.com", avatar: "/avatar.jpg", access: ["Admin", "Data Export"], lastActive: "Mar 3, 2024", dateAdded: "Mar 1, 2024" }
] as const;
