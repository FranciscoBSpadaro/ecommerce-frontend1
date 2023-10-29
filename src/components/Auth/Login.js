import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

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

        // Mostrar mensagem de login bem-sucedido
        setLoginError(null); // Limpar mensagens de erro anteriores
        setLoginError('Login bem-sucedido! Redirecionando para a página inicial.');

        // Redirecionar o usuário para a página Home após o login (após um pequeno atraso para exibir a mensagem)
        setTimeout(() => {
          window.location.replace('/'); // home
        }, 3000); // Tempo de espera em milissegundos antes do redirecionamento
      }
    } catch (error) {
      setLoginError('Erro ao fazer login. Por favor, verifique seu usuário e senha.');
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
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
