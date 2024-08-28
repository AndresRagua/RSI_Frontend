import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo_rs from '../static/img/Logos/Logo_RS/logo_rs.svg';

const AdminNavBar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 px-4 py-1 sm:py-4 md:py-3 lg:py-1">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/admin">
          <img src={logo_rs} alt="Logo" className="h-10 lg:h-8" />
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={toggle}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Navigation links */}
        <div className={`flex flex-col md:flex-row md:items-center md:space-x-4 absolute md:relative inset-x-0 top-16 md:top-0 bg-gray-800 md:bg-transparent p-4 md:p-0 ${isOpen ? 'block' : 'hidden'} md:flex`}>
          <Link
            to="/admin"
            className="text-white text-sm font-medium py-2 lg:py-1 hover:text-yellow-500 transition duration-300"
            onClick={toggle}
          >
            Home
          </Link>
          <button
            onClick={handleLogout}
            className="bg-yellow-500 text-white text-sm font-medium py-2 lg:py-1 px-4 lg:px-3 mt-2 md:mt-0 rounded hover:bg-yellow-600 transition duration-300"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavBar;
