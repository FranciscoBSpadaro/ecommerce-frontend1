import React, { useState } from 'react';
import api from '../../api';
import { toast, ToastContainer } from 'react-toastify';
import Lottie from 'lottie-react';
import animationData from '../../Assets/Forgot-Password.json';

const Password = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [showNewPasswordField, setShowNewPasswordField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleRequesVerification = async () => {
    setIsLoading(true);
    setIsButtonDisabled(true);
    try {
      await api.post('/email/code', { email });
      toast.success('Código de verificação enviado para o e-mail.');
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error('Erro na requisição.');
      } else {
        toast.error('Erro interno.');
      }
    }
    setTimeout(() => setIsLoading(false), 5000);
    setTimeout(() => setIsButtonDisabled(false), 150000); // 150000 = 2.5 minutos
  };

  const verifyCode = async () => {
    try {
      if (verificationCode) {
        const response = await api.post('/checkcode', {
          verificationCode,
          email,
        });
        if (response.status === 200) {
          toast.success('Código Válido digite sua nova senha');
          setShowNewPasswordField(true);
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error('Erro na requisição.');
      } else {
        toast.error('Erro interno.');
      }
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password)
      ) {
        toast.error(
          'A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas e números.',
        );
        return;
      }
      await api.put('/forgotpassword', { email, verificationCode, password });
      toast.success('Senha alterada com sucesso.');
      // Limpar todos os campos do formulário
      setEmail('');
      setVerificationCode('');
      setPassword('');
      setShowNewPasswordField(false);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error('Erro na requisição.');
      } else {
        toast.error('Erro interno.');
      }
    }
  };

  return (
    <div className="center-container-login">
      <ToastContainer limit={5} />
      <h1>Alterar Senha</h1>
      <Lottie
        animationData={animationData}
        style={{ height: 400, width: 400 }}
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email de cadastro"
      />
      {isLoading && (
        <div className="loading-animation">
          <p> Verificando Seu E-mail... </p>
        </div>
      )}
      <button onClick={handleRequesVerification} disabled={isButtonDisabled}>
        Solicitar código de verificação
      </button>
      <input
        type="text"
        value={verificationCode}
        onChange={e => setVerificationCode(e.target.value)}
        placeholder="Código de verificação"
      />
      <button onClick={verifyCode}>Validar código</button>
      {showNewPasswordField && (
        <>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Nova senha"
          />
          <button onClick={handlePasswordChange}>Salvar</button>
        </>
      )}
    </div>
  );
};

export default Password;
