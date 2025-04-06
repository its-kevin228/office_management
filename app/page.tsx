"use client"
import Navbar from "./components/Navbar";
import UserTable from "./components/UserTable";
import Pagination from "./components/Pagination";
import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";
import AddUserModal from './components/AddUserModal';
import Notification, { NotificationType } from './components/Notification';
import { useState, useMemo, useEffect } from "react";

interface User {
  name: string;
  email: string;
  avatar: string;
  access: string[];
  lastActive: string;
  dateAdded: string;
}

// Adjust the interface for the filter props
interface FilterUser {
  name: string;
  email: string;
  access: string[];
  avatar: string;
  lastActive: string;
  dateAdded: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<{
    access: string[],
    sortBy: string
  }>({
    access: [],
    sortBy: 'recent'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);

        // Clean up Data Import permission from existing users
        const cleanedUsers = parsedUsers.map((user: any) => ({
          ...user,
          access: user.access.filter((permission: string) => permission !== 'Data Import')
        }));

        // Save the cleaned users back to localStorage and update state
        localStorage.setItem('users', JSON.stringify(cleanedUsers));
        setUsers(cleanedUsers);
      } catch (error) {
        console.error("Error parsing users from localStorage:", error);
        setUsers([]);
      }
    }

    // Récupérer l'utilisateur actif de localStorage s'il existe
    const storedActiveUser = localStorage.getItem('activeManagerUser');
    if (storedActiveUser) {
      try {
        const parsedUser = JSON.parse(storedActiveUser);
        // Trouver l'utilisateur complet dans la liste
        const fullUser = users.find(u => u.email === parsedUser.email);
        if (fullUser) {
          setActiveUser(fullUser);
        }
      } catch (error) {
        console.error("Error parsing stored active user:", error);
      }
    }
  }, []);

  // Instead of just saving users, make sure to also filter out Data Import when saving
  useEffect(() => {
    // Filter out only Data Import from all users before saving
    const cleanUsers = users.map(user => ({
      ...user,
      access: user.access.filter((permission: string) => permission !== 'Data Import')
    }));

    localStorage.setItem('users', JSON.stringify(cleanUsers));
  }, [users]);

  const handleAddUser = (user: User) => {
    setUsers(prevUsers => [...prevUsers, user]);
    setIsModalOpen(false);
    showNotification(`L'utilisateur "${user.name}" a été ajouté avec succès.`, 'success');
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Filter by access
    if (activeFilters.access.length > 0) {
      result = result.filter(user =>
        activeFilters.access.every(filter => user.access.includes(filter))
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      result = result.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.access.some((access: string) => access.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort users
    if (activeFilters.sortBy === 'recent') {
      result = result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    } else if (activeFilters.sortBy === 'oldest') {
      result = result.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
    } else if (activeFilters.sortBy === 'alphabetical') {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [users, searchTerm, activeFilters]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const handleDeleteUser = (email: string) => {
    const userToDelete = users.find(user => user.email === email);
    setUsers(users.filter(user => user.email !== email));

    if (userToDelete) {
      showNotification(`L'utilisateur "${userToDelete.name}" a été supprimé.`, 'info');
    }
  };

  const handleUpdateUser = (email: string, updatedUser: User) => {
    const originalUser = users.find(user => user.email === email);
    setUsers(users.map(user =>
      user.email === email ? updatedUser : user
    ));

    if (originalUser && JSON.stringify(originalUser.access) !== JSON.stringify(updatedUser.access)) {
      showNotification(`Les permissions de "${updatedUser.name}" ont été mises à jour.`, 'warning');
    } else if (originalUser) {
      showNotification(`Les informations de "${updatedUser.name}" ont été mises à jour.`, 'success');
    }
  };

  const handleSetActiveUser = (user: User) => {
    setActiveUser(user);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({
      message,
      type,
      isVisible: true
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar activeUser={activeUser} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold">All users <span className="text-teal-500 ml-1">{filteredUsers.length}</span></h2>
          </div>
          <div className="flex items-center space-x-4">
            <SearchBar onSearch={handleSearch} />
            <Filters
              onAddUser={handleAddUser}
              onApplyFilters={handleApplyFilters}
              activeFilters={activeFilters}
            />

          </div>
        </div>
        <UserTable
          searchTerm={searchTerm}
          users={paginatedUsers}
          activeFilters={activeFilters}
          onDeleteUser={handleDeleteUser}
          onUpdateUser={handleUpdateUser}
          onSetActiveUser={handleSetActiveUser}
        />
        <Pagination
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={handleCloseNotification}
      />
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddUser={handleAddUser}
      />
    </div>
  );
}
