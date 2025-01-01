import React from 'react'
import styles from '../Styles/Navbar.module.css';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  const showLogoutButton = location.pathname !== '/';


  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Travel Planner</h1>
        {showLogoutButton && (
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
