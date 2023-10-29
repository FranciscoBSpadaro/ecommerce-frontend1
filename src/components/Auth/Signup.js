import React, { useState } from 'react';
import axios from 'axios';
import '../../App.css';

const Signup = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = (e) => {
    if (e.target.value.length <= 25) {  // limitar username a 25 caracteres
      setName(e.target.value);
    }
  };

  const handleEmailChange = (e) => {
    if (e.target.value.length <= 50) {  // limitar email a 50 caracteres
      setEmail(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/users/signup', {
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
    <div>
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Crie um Login de Usuário"
          value={username}
          onChange={handleNameChange}  // Adiciona a função handleNameChange para limitar a quantidade de Caracteres
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange} // Adiciona a função handleEmailChange para limitar a quantidade de Caracteres
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
