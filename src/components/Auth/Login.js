import React, { useState } from 'react';
import api from '../../api';
import { toast, ToastContainer } from 'react-toastify';
import Lottie from 'lottie-react';
import animationData from '../../Assets/Animation-login.json';
import {
  handleIdentifierChange as handleIdentifierChangeImported,
  handlePasswordChange as handlePasswordChangeImported,
} from './handleChangesLogin';

const authenticateUser = async (identifier, password, setIsLoading) => {
  const payload = {
    // Preparando os dados para a requisição de login
    username: identifier.includes('@') ? '' : identifier,
    email: identifier.includes('@') ? identifier : '',
    password,
  };
  // Fazendo a requisição de login
  const response = await api.post('/users/login', payload);
  const { token } = response.data;

  if (token) {
    // Se o login for bem-sucedido recebe um token de acesso
    setIsLoading(true);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    sessionStorage.setItem('token', token);
    toast.success('💚 Login Realizado 💚');
    setTimeout(() => {
      window.location.replace('/');
      setIsLoading(false);
    }, 2000);
  }
};

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleIdentifierChange = handleIdentifierChangeImported(setIdentifier);
  const handlePasswordChange = handlePasswordChangeImported(setPassword);

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      // Limpar a mensagem de erro antes de tentar autenticar
      setErrorMessage(null);
      await authenticateUser(identifier, password, setIsLoading);
    } catch (error) {
      const errorMessage = 'Usuário ou Senha Invalidos';
      if (!toast.isActive(errorMessage)) {
        toast.error(errorMessage, { toastId: errorMessage, autoClose: 5000 });
      }
      console.error(error.response?.data?.message);
      // Definir a mensagem de erro quando ocorrer um erro
      setErrorMessage(errorMessage);
      // Limpar a mensagem de erro após 5 segundos (a mesma duração do toast)
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  return (
    <div className="center-container-login">
      <ToastContainer limit={5} />
      {isLoading && (
        <div className="loading-animation">
          <p> Entrando na loja 🛒</p>
        </div>
      )}
      <h1>🛒 Entrar 🛒</h1>
      <Lottie
        animationData={animationData}
        style={{ height: 400, width: 400 }}
      />
      <form className="form-group" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuário ou E-mail"
          value={identifier}
          onChange={handleIdentifierChange}
          minLength={5}
          maxLength={50}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={handlePasswordChange}
          minLength={8}
          maxLength={60}
        />
        <button
          className="button-login"
          type="submit"
          disabled={
            identifier.length < 5 || password.length < 8 || errorMessage
          }
        >
          Login
        </button>
      </form>
      <div style={{ textAlign: 'center' }}>
        <button
          className="button-login-a"
          onClick={() => (window.location.href = '/signup')}
        >
          Não possui Cadastro?
        </button>
        <button
          className="button-login-a"
          onClick={() => (window.location.href = '/forgotpassword')}
        >
          Esqueceu sua Senha?
        </button>
        <button
          className="button-login-a"
          onClick={() => (window.location.href = '/forgotusername')}
        >
          Esqueceu seu Usuário?
        </button>
      </div>
    </div>
  );
};

export default Login;
