import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import Home from './components/Ecommerce/Home';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import './App.css';

function App() {
  // Defina o estado de autenticação aqui ou use um gerenciador de estado
  const isAuthenticated = false; // Defina com base no estado de autenticação do usuário

  return (
    <Router>
      <div>
        <Navbar isAuthenticated={isAuthenticated} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Outras rotas e componentes aqui */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
