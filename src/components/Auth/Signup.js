import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/users/signup', {
        username,
        email,
        password,
      });

      console.log('Cadastro bem-sucedido:', response.data);
      // Lógica para lidar com a resposta do backend após o cadastro ser bem-sucedido

      // Redirecionar o usuário para a página de login, por exemplo
      window.location.replace('/login');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      // Lógica para lidar com erros, como exibir mensagens para o usuário
    }
  };

  return (
    <div>
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Crie um Login de Usuário"
          value={username}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Signup;
