// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import AppRoutes from './Routes';
import './App.css';
import { jwtDecode } from 'jwt-decode';
import { CarouselProvider } from '../src/components/Admin/CarouselProvider';

function App() {
  const [user, setUser] = useState({isAuthenticated: false, isAdmin: false});

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser({isAuthenticated: true, isAdmin: decodedToken.isAdmin || false});
    }
  };

  return (
    <Router>
      <div>
        <Navbar isAuthenticated={user.isAuthenticated} isAdmin={user.isAuthenticated && user.isAdmin} />
        <CarouselProvider>
          <AppRoutes isAdmin={user.isAuthenticated && user.isAdmin} />
        </CarouselProvider>
      </div>
    </Router>
  );
}

export default App;