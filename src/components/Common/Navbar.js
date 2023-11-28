import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import UserContext from './UserContext';
import logo from '../../Assets/ecommercelogo.png';
import '../../App.css';

const Navbar = ({ isAuthenticated, isAdmin }) => {
  const location = useLocation();
  const { username } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = (isOpen, event) => {
    if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
      setDropdownOpen(!dropdownOpen);
    } else {
      setDropdownOpen(isOpen);
    }
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo do Ecommerce" />
      </div>
      {location.pathname !== '/' && (
        <ul className="left-menu">
          <li>
            <button
              className="button-login-a"
              onClick={() => (window.location.href = '/')}
            >
              Home
            </button>
          </li>
        </ul>
      )}
      {isAuthenticated && (
        <ul className="center-menu">
          <li>
            <button
              className="button-login-a"
              onClick={() => (window.location.href = '/cart')}
            >
              🛒
            </button>
          </li>
          <li>
            <button
              className="button-login-a"
              onClick={() => (window.location.href = '/order')}
            >
              Compras
            </button>
          </li>
        </ul>
      )}
      <ul className="right-menu">
        {isAuthenticated ? (
          <>
            {isAdmin && (
              <li>
                <button
                  className="button-login-a"
                  onClick={() => (window.location.href = '/admin')}
                >
                  Administrador
                </button>
              </li>
            )}
            <li ref={dropdownRef}>
              <Dropdown show={dropdownOpen} onToggle={handleToggle}>
                <Dropdown.Toggle as="div">
                  <abbr className="avatar-elem">
                    {username && username[0].toUpperCase()}
                  </abbr>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    Perfil
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/password">
                    Alterar Senha
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/logoff">
                    Sair
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </>
        ) : (
          <li>
            <button
              className="button-login-a"
              onClick={() => (window.location.href = '/login')}
            >
              Entrar
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
