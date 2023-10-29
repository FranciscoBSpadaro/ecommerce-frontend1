import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/users/login', {
        username,
        password,
      });

      // Lógica para lidar com a resposta do backend, como armazenar o token, etc.
      const { token } = response.data;

      if (token) {
        // Armazenar o token na sessionStorage
        sessionStorage.setItem('token', token);

        // Redirecionar o usuário para a página Home após o login
        window.location.replace('/'); // home
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      // Lógica para lidar com erros, como exibir mensagens para o usuário
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
