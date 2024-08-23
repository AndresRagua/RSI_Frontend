import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo_rs from '../static/img/Logos/Logo_RS/logo_rs.svg';

const NavBarPublic = ({ selectedRadio, setSelectedRadio, radios }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-gray-800 fixed w-full z-10 top-0 shadow">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-2">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo_rs} alt="Logo" className="h-10" />
          </Link>
        </div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="bg-secondary text-white font-semibold py-2 px-4 rounded inline-flex items-center"
          >
            <span>{radios.find(radio => radio.id === selectedRadio)?.nombre || 'Seleccionar Radio'}</span>
            <svg
              className="fill-current h-4 w-4 ml-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293l4.707 4.707 4.707-4.707L15.293 6 10 11.293 4.707 6z" />
            </svg>
          </button>
          {dropdownOpen && (
            <ul className="absolute text-gray-700 pt-1">
              {radios.length > 0 ? (
                radios.map(radio => (
                  <li key={radio.id}>
                    <span
                      className="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap cursor-pointer"
                      onClick={() => {
                        setSelectedRadio(radio.id);
                        setDropdownOpen(false);
                      }}
                    >
                      {radio.nombre}
                    </span>
                  </li>
                ))
              ) : (
                <li>
                  <span className="bg-gray-200 py-2 px-4 block whitespace-no-wrap cursor-not-allowed">
                    No hay radios disponibles
                  </span>
                </li>
              )}
            </ul>
          )}
        </div>
        <div className="block lg:hidden">
          <button
            onClick={toggleMenu}
            className="flex items-center px-3 py-2 border rounded text-gray-200 border-gray-400 hover:text-white hover:border-white"
          >
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div className={`${isOpen ? 'block' : 'hidden'} w-full lg:flex lg:items-center lg:w-auto`}>
          <ul className="text-sm lg:flex-grow flex flex-col lg:flex-row lg:justify-end">
            <li className="nav-item">
              <Link
                to="/"
                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4"
                onClick={() => setIsOpen(false)}
              >
                INICIO
              </Link>
            </li>
            <li className="nav-item">
              <span
                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4 cursor-pointer"
                onClick={() => {
                  handleScrollToSection('servicios');
                  setIsOpen(false);
                }}
              >
                SERVICIO
              </span>
            </li>
            <li className="nav-item">
              <span
                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4 cursor-pointer"
                onClick={() => {
                  handleScrollToSection('publicidades');
                  setIsOpen(false);
                }}
              >
                PUBLICIDAD
              </span>
            </li>
            <li className="nav-item">
              <span
                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4 cursor-pointer"
                onClick={() => {
                  handleScrollToSection('programas');
                  setIsOpen(false);
                }}
              >
                PROGRAMAS
              </span>
            </li>
            <li className="nav-item">
              <span
                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4 cursor-pointer"
                onClick={() => {
                  handleScrollToSection('artistas');
                  setIsOpen(false);
                }}
              >
                ARTISTAS
              </span>
            </li>
            <li className="nav-item">
              <span
                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 cursor-pointer"
                onClick={() => {
                  handleScrollToSection('contacto');
                  setIsOpen(false);
                }}
              >
                CONTACTO
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBarPublic;
