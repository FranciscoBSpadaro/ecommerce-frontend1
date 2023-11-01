import React, { useState, useEffect } from 'react';
import api from '../../api';

const EditUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await api.get('/admin/users');
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Erro ao buscar os usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Lista de Usuários</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <p>{user.name}</p>
            {/* Adicione mais detalhes dos usuários se necessário */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditUsers;
