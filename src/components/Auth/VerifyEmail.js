import React, { useState } from 'react';
import api from '../../api';

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [verifyError, setVerifyError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Enviar o código de verificação para o servidor
      const response = await api.post('/email/verifyEmail', {
        verificationCode,
      });

    if (response.status === 200) {
      setVerifyError('Email verificado com sucesso!.');
      setIsSuccess(true);
      setTimeout(() => {
        window.location.replace('/');
      }, 3000);
    } else {
      setVerifyError('Erro ao verificar o email. Por favor, tente novamente.');
      setIsSuccess(false);
    }
  } catch (error) {
    setVerifyError('Erro ao verificar o email. Por favor, tente novamente.');
    setIsSuccess(false);
    console.error('Erro ao verificar o email:', error);
  }
};

  return (
    <div className="verification-form">
      <h2 className="h1">Verificação de Email</h2>
      {verifyError && <p style={{ color: isSuccess ? 'green' : 'red' }}>{verifyError}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Código de Verificação"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button type="submit">Verificar Email</button>
      </form>
    </div>
  );
};

export default VerifyEmail;
