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
            Authorization: `Bearer ${token}`,
          },
        });

        if (!checkToken.isAdmin) {
          throw new Error();
        }
      } catch (error) {
        if (error.status === 401) {
          // apresentar um erro 404 se o usuário não for um admin
          console.log('O usuário não é um admin!');
        }
      }
    };

    authenticateUser();
  }, []);

  return (
    <div>
      <section className="center-container">
        <h1>Admin Dashboard</h1>

        <Link to="/admin/editUsers" className="button">
          Listar Usuários
        </Link>

        <Link to="/admin/createProduct" className="button">
          Adicionar Novo Produto
        </Link>

        <Link to="/admin/uploads" className="button">
          Imagens De Produtos
        </Link>
      </section>
    </div>
  );
};

export default AdminDashboard;
