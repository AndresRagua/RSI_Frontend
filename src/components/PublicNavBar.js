import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import logo_rs from '../static/img/Logos/Logo_RS/logo_rs.svg';
import axios from 'axios';

// URL del backend (puede cambiar según el entorno)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const NavBarPublic = ({ selectedRadio, setSelectedRadio }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [radios, setRadios] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    fetchRadios();
  }, []);

  const fetchRadios = async () => {
    try {
      const res = await axios.get(`${API_URL}/radio/obtener`);
      setRadios(res.data);
    } catch (error) {
      console.error("Error fetching radios:", error);
    }
  };

  // Función para hacer scroll a la sección deseada
  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Navbar color="dark" dark expand="md" className="navbar-custom">
      <NavbarBrand tag={Link} to="/" className="px-4">
        <img src={logo_rs} alt="Logo" style={{ height: '40px' }} />
      </NavbarBrand>
      <div className="radio-dropdown">
        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} direction="down">
          <DropdownToggle caret className="btn-secondary">
            {radios.find(radio => radio.id === selectedRadio)?.nombre || 'Seleccionar Radio'}
          </DropdownToggle>
          <DropdownMenu>
            {radios.length > 0 ? (
              radios.map(radio => (
                <DropdownItem key={radio.id} onClick={() => setSelectedRadio(radio.id)}>
                  {radio.nombre}
                </DropdownItem>
              ))
            ) : (
              <DropdownItem disabled>No hay radios disponibles</DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </div>
      <NavbarToggler onClick={toggle} className="ms-auto" />
      <Collapse isOpen={isOpen} navbar className="justify-content-start">
        <Nav navbar>
          <NavItem>
            <Link to="/" className="nav-link text-white btn-custom">
              INICIO
            </Link>
          </NavItem>
          <NavItem>
            <span
              className="nav-link text-white"
              style={{ cursor: 'pointer' }}
              onClick={() => handleScrollToSection('servicios')}
            >
              SERVICIO
            </span>
          </NavItem>
          <NavItem>
            <span
              className="nav-link text-white"
              style={{ cursor: 'pointer' }}
              onClick={() => handleScrollToSection('artistas')}
            >
              ARTISTAS
            </span>
          </NavItem>
          <NavItem>
            <span
              className="nav-link text-white"
              style={{ cursor: 'pointer' }}
              onClick={() => handleScrollToSection('publicidades')}
            >
              PUBLICIDAD
            </span>
          </NavItem>
          <NavItem>
            <span
              className="nav-link text-white"
              style={{ cursor: 'pointer' }}
              onClick={() => handleScrollToSection('programas')}
            >
              PROGRAMAS
            </span>
          </NavItem>
          <NavItem>
            <span
              className="nav-link text-white"
              style={{ cursor: 'pointer' }}
              onClick={() => handleScrollToSection('contacto')}
            >
              CONTACTO
            </span>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default NavBarPublic;
