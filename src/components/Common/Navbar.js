import React from 'react';
import '../../App.css';

const Navbar = ({ isAuthenticated }) => {
  return (
    <nav className="navbar">
      <ul>
        <li><a href="/">Home</a></li>
        {isAuthenticated ? (
          <>
            <li><a href="/profile">Configurações</a></li>
            <li><a href="/cart">Carrinho</a></li>
            <li><a href="/orders">Pedidos</a></li>
          </>
        ) : (
          <li><a href="/login">Login</a></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
