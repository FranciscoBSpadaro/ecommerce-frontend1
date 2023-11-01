import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link to="/admin/editUsers">Listar Usuários</Link>
          </li>
          <li>
            <Link to="/admin/editCategories">Listar Categorias</Link>
          </li>
          <li>
            <Link to="/admin/editProducts">Listar Produtos</Link>
          </li>
          <li>
            <Link to="/CreateProduct">Adicionar Novo Produto</Link>
          </li>
          <li>
            <Link to="/CreateCategory">Adicionar Nova Categoria</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;
