import React, { useState } from 'react';
import api from '../../api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const requestVerification = async () => {
    try {
      if (email) {
        const response = await api.post('/email/code', { email });

        if (response.status === 200) {
          setShowSuccessMessage(true);
          setRequestSent(true);
        }
      } else {
        setErrorMessage('O e-mail é obrigatório.');
        setShowErrorMessage(true);
        setTimeout(() => setShowErrorMessage(false), 5000);
      }
    } catch (error) {
      setErrorMessage('E-mail inválido ou não cadastrado');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
    }
  };

  const verifyCode = async () => {
    try {
      if (verificationCode) {
        const response = await api.post('/email/verifyEmail', { verificationCode, email });

        if (response.status === 200) {
          setIsCodeValid(true);

          const newPasswordResponse = await api.post('/email/requestNewPassword', {
            verificationCode,
            email,
          });

          if (newPasswordResponse.status === 200) {
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 5000);
            setTimeout(() => window.location.replace('/login'), 5000);
          }
        }
      } else {
        setErrorMessage('O código de verificação é obrigatório.');
        setShowErrorMessage(true);
        setTimeout(() => setShowErrorMessage(false), 5000);
      }
    } catch (error) {
      setErrorMessage('Código de verificação inválido.');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
    }
  };

  return (
    <div className="forgot-password-form">
      <h2 className="h1">Recuperar Senha</h2>
      {!isCodeValid ? (
        <>
          {!requestSent ? (
            <>
              <input
                type="email"
                placeholder="E-mail de Cadastro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={requestVerification}>
                Solicitar Código de Verificação
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Digite o Código de Validação"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button onClick={verifyCode}>Validar</button>
            </>
          )}
        </>
      ) : null}
      {showSuccessMessage && !isCodeValid && (
        <p style={{ color: 'green' }}>
          Foi enviado um código de verificação para o seu e-mail, digite o código e receba sua nova senha.
        </p>
      )}
      {showSuccessMessage && isCodeValid && (
        <p style={{ color: 'green' }}>
          Foi enviado uma senha temporária para seu e-mail. Redirecionando para o login em 5 segundos...
        </p>
      )}
      {showErrorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default ForgotPassword;
