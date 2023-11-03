import React, { useState } from 'react';
import api from '../../api'; // Importa o arquivo de configuração do Axios

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/users/login', {
        username,
        password,
      });

      const { token } = response.data;

      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Configura o cabeçalho Authorization globalmente
        sessionStorage.setItem('token', token);
        setLoginError('Login bem-sucedido! Redirecionando para a página inicial.');
        setIsSuccess(true);

        setTimeout(() => {
          window.location.replace('/');
        }, 3000);
      }
    } catch (error) {
      setLoginError('Erro ao fazer login. Por favor, verifique seu usuário e senha.');
      setIsSuccess(false);
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div className="login-form"> {/* Aplica a classe para adicionar os estilos */}
      <h2 className="h1">🛒Acessar🤩</h2>
      {loginError && <p style={{ color: isSuccess ? 'green' : 'red' }}>{loginError}</p>}
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
      <p style={{ textAlign: 'center' }}>
         <a href="/signup">Não possui Cadastro?</a>.
      </p>
      <p style={{ textAlign: 'center' }}>
        <a href="/forgotpassword">Esqueceu sua Senha?</a>
      </p>
      <p style={{ textAlign: 'center' }}>
        <a href="/forgotusername">Esqueceu seu Usuário?</a>
      </p>
    </div>
  );
};

export default Login;
