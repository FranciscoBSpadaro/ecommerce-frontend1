import React from 'react';
import '../../App.css';

const Navbar = ({ isAuthenticated, isAdmin }) => {
  return (
    <nav className="navbar">
      <ul className="left-menu">
        <li><a href="/">Home</a></li>
      </ul>
      {isAuthenticated && (
        <ul className="center-menu">
          <li><a href="/cart">🛒</a></li>
          <li><a href="/order">Compras</a></li>
        </ul>
      )}
      <ul className="right-menu">
        {isAuthenticated ? (
          <>
            {isAdmin && (
              <li className="center-menu">
                <a href="/admin">Administrador</a>
              </li>
            )}
            <li className="submenu">
              <h4>Configurações</h4>
              <ul className="submenu-content">
                <li><a href="/profile">Perfil</a></li>
                <li><a href="/password">Alterar Senha</a></li>
                <li><a href="/logoff">Sair</a></li>
              </ul>
            </li>
          </>
        ) : (
          <li><a href="/login">Entrar</a></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
