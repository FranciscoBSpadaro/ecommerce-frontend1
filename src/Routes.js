import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './components/Ecommerce/Home';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
// Importe outros componentes conforme necessário...

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* Defina outras rotas aqui */}
    </Routes>
  );
};

export default AppRoutes;
