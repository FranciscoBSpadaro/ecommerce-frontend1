import React, { useState } from 'react';
import api from '../../api';
import '../../App.css';

const Signup = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = (e) => {
    // Impedir espaços no nome de usuário
    if (!e.target.value.includes(' ')) {
      if (e.target.value.length <= 25) {  // limita em 25 caracteres
        setName(e.target.value);
      } else {
        // Limitar o tamanho do nome do usuário
        setName(e.target.value.slice(0, 25));
      }
    } else {
      alert('O Apelido de usuário não pode conter espaços!');
    }
  };

  const handleEmailChange = (e) => {
    if (e.target.value.length <= 50) {
      setEmail(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/users/signup', {
        username,
        email,
        password,
      });

      alert(response.data.message); // Exibir a mensagem do backend

      // Redirecionar o usuário para a página de login
      window.location.replace('/login');
    } catch (error) {
      alert(error.response.data.message); // Exibir a mensagem de erro recebida do backend
      console.error('Erro ao cadastrar:', error);
    }
  };

  return (
    <div className="login-form">
      <h2 className="h1">📝 Cadastro ✨</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={handleNameChange}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
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
