import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {

  useEffect(() => {
    // Busca o perfil do usuário quando o componente é montado
    const token = sessionStorage.getItem('token');

    const authenticateUser = async () => {
      try {
        const checkToken = await fetch('/admin', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!checkToken.isAdmin) {
          throw new Error();
        }

      } catch (error) {
        if (error.status === 401) {
          // apresentar um erro 404 se o usuário não for um admin
          console.log("O usuário não é um admin!");
        }
      }
    }

    authenticateUser();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link to="/admin/editUsers">Listar Usuários</Link>
          </li>
          <Link to="/admin/CreateProduct">Adicionar Novo Produto</Link>
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;
