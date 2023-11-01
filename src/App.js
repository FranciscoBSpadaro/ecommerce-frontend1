import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import AppRoutes from './Routes';
import './App.css';
import { jwtDecode } from 'jwt-decode';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verificar se o token está presente no sessionStorage
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsAuthenticated(true);
      console.log(decodedToken); // Se houver um token, definir isAuthenticated como verdadeiro para usuario padrão
      if (decodedToken.isAdmin === true) {
        setIsAdmin(true); // Definir isAdmin como verdadeiro se o usuário for um administrador
      }
    }
  }, []);

  return (
    <Router>
      <div>
        <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
        <AppRoutes />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
