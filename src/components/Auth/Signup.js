import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../../App.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage]);

  const handleNameChange = (e) => {
    if (!e.target.value.includes(' ')) {
      if (e.target.value.length <= 20) {
        setUsername(e.target.value);
      } else {
        setUsername(e.target.value.slice(0, 20));
      }
    } else {
      setErrorMessage('O Apelido de usuário não pode conter espaços!');
    }
  };

  const handleEmailBlur = (e) => {
    const value = e.target.value;
    if (value.length > 50) {
      setErrorMessage('O Email deve ter no máximo 50 caracteres.');
    } else if (!value.includes('@') || value.includes(' ')) {
      setErrorMessage('O Email não pode conter espaços e precisa ter um "@"');
    } else {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (username && email && password) {
        setSuccessMessage('Cadastrando...');
        const response = await api.post('/users/signup', {
          username,
          email,
          password,
        });

        setSuccessMessage(response.data.message);
        setErrorMessage('');
        setUsername('');
        setEmail('');
        setPassword('');
        setTimeout(() => {
          setSuccessMessage('');
          setIsLoading(false);
          window.location.replace('/login');
        }, 5000);
      } else {
        setErrorMessage('Por favor, preencha todos os campos corretamente.');
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setIsLoading(false);
      console.error('Erro ao cadastrar:', error);
    }
  };

  useEffect(() => {
    setIsButtonDisabled(!(username && email && password));
  }, [username, email, password]);

  return (
    <div className="login-form">
      <h2 className="h1">📝 Cadastro ✨</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleEmailBlur}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={isButtonDisabled}>
          Cadastrar
        </button>
        {isLoading && <div className="loading-animation"><p>Cadastrando...</p></div>}
      </form>
    </div>
  );
};

export default Signup;
