import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import AppRoutes from './Routes'; // Importando o componente AppRoutes de Routes.js
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se o token está presente no sessionStorage
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // Se houver um token, definir isAuthenticated como verdadeiro
    }
  }, []);

  return (
    <Router>
      <div>
        <Navbar isAuthenticated={isAuthenticated} />
        <AppRoutes /> {/* Utilizando as rotas definidas em AppRoutes */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
