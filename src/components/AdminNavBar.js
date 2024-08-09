import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, Button } from 'reactstrap';
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
    <Navbar color="secondary" light expand="md">
      <NavbarBrand tag={Link} to="/admin">
        <img src={logo_rs} alt="Logo" style={{ height: '40px' }}/>
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto" navbar>
          <NavItem>
            <Link to="/admin" className="nav-link nav-link-custom text-xs">
              <span className=" btn-custom text-border-black">Home</span>
            </Link>
          </NavItem>
        </Nav>
        <Nav className="ms-auto" navbar>
          <NavItem>
            <Button className='btn-custom' onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );

};

export default AdminNavBar
