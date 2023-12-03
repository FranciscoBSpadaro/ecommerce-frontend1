// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import AppRoutes from './Routes';
import './App.css';
import { jwtDecode } from 'jwt-decode';
import UserContext from '../src/components/Common/UserContext';

function App() {
  const [user, setUser] = useState({ isAuthenticated: false, isAdmin: false, username: '' });

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const isAdmin = decodedToken.isAdmin || false;
      sessionStorage.setItem('isAdmin', isAdmin); // Armazene isAdmin no sessionStorage
      setUser({
        isAuthenticated: true,
        isAdmin: isAdmin,
        username: decodedToken.username || '',
      });
    }
  };

  return (
    <Router>
      <UserContext.Provider value={{ username: user.username, setUsername: setUser }}>
        <div>
          <Navbar
            isAuthenticated={user.isAuthenticated}
            isAdmin={user.isAuthenticated && user.isAdmin}
          />
          <AppRoutes isAdmin={user.isAuthenticated && user.isAdmin} />
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;