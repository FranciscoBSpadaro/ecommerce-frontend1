import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = (e) => {
    // Limitando o número de caracteres do username
    if (e.target.value.length <= 25) {
      setName(e.target.value);
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
          onChange={handleNameChange} // Atribui a função handleNameChange para lidar com a mudança de valor
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
