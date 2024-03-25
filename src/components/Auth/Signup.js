import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import api from '../../api';
import '../../App.css';
import Lottie from 'lottie-react';
import animationData from '../../Assets/Animation-signup.json';
import {
  handleNameChange,
  handleNameBlur,
  handleEmailChange,
  handlePasswordChange,
} from './handleChangesSignup';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*!])[A-Za-z\d@#$%&*!]{8,}$/;
    if (password && !passwordRegex.test(password)) {
      setPasswordIsValid(false);
      const errorMessage =
        'A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas , números e caracteres especiais por exemplo : @, #, $, %, &, *, ! ';
      if (!toast.isActive(errorMessage)) {
        toast.error(errorMessage, { toastId: errorMessage, autoClose: 10000 });
      }
    } else {
      setPasswordIsValid(true);
    }
  }, [password]);

  const registerUser = async (username, email, password, setIsLoading) => {
    try {
      const response = await api.post('/users/signup', {
        username,
        email,
        password,
      });
      if (response.data.message) {
        setIsLoading(true);
        toast.success(response.data.message);
        setUsername('');
        setEmail('');
        setPassword('');
        setTimeout(() => {
          window.location.replace('/login');
          setIsLoading(false);
        }, 5000);
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setIsSubmitting(true);
        toast.error(
          'Muitas solicitações, Por favor, tente novamente em 5 minutos ou verifique se você ja recebeu seu e-mail de cadastro e faça o login.',
        );
        setTimeout(() => {
          window.location.replace('/login');
          setIsLoading(false);
        }, 5500);
      } else {
        setIsSubmitting(false);
        const errorMessage = error.response.data.message;
        if (!toast.isActive(errorMessage)) {
          toast.error(errorMessage);
        }
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      toast.success('Cadastrando...');
      if (username && email && password && passwordIsValid) {
        await registerUser(username, email, password, setIsLoading);
      } else {
        setIsSubmitting(false);
        const errorMessage =
          'Por favor, preencha todos os campos corretamente.';
        if (!toast.isActive(errorMessage)) {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      const errorMessage = error.response.data.message;
      if (!toast.isActive(errorMessage)) {
        toast.error(errorMessage);
        console.error('Erro ao cadastrar:', error);
      }
    }
  };

  const isButtonDisabled =
    username.length < 5 ||
    email.length < 5 ||
    password.length < 8 ||
    !passwordIsValid ||
    isSubmitting;

  return (
    <div className="center-container-login">
      <ToastContainer limit={5} />
      {isLoading && (
        <div className="loading-animation">
          <p>Aguarde...</p>
        </div>
      )}
      <h1>Cadastro</h1>
      <Lottie
        animationData={animationData}
        style={{ height: 400, width: 400 }}
      />
      <form className="form-group" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          minLength={5}
          maxLength={20}
          onChange={handleNameChange(setUsername)}
          onBlur={handleNameBlur(setUsername)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          minLength={5}
          maxLength={50}
          onChange={handleEmailChange(setEmail)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          minLength={8}
          maxLength={60}
          onChange={handlePasswordChange(setPassword)}
        />
        <button
          className="button-login"
          type="submit"
          disabled={isButtonDisabled}
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default Signup;
