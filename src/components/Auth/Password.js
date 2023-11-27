import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { toast, ToastContainer } from 'react-toastify';
import Lottie from 'lottie-react';
import animationData from '../../Assets/change-password.json';

const Password = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPasswordField, setShowNewPasswordField] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const verifyCurrentPassword = async () => {
    try {
      const response = await api.post('/password/verify', {
        password: currentPassword,
      });
      if (response.status === 200) {
        if (!toast.isActive('successToast')) {
          toast.success(response.data.message, { toastId: 'successToast' });
          setShowNewPasswordField(true);
          setIsButtonDisabled(true);
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
      setIsButtonDisabled(false);
    }
  };

  const navigate = useNavigate();

  const handlePasswordChange = async () => {
    try {
      if (
        newPassword.length < 8 ||
        !/[A-Z]/.test(newPassword) ||
        !/[a-z]/.test(newPassword) ||
        !/[0-9]/.test(newPassword)
      ) {
        toast.error(
          'A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas e números.',
        );
        return;
      }
      await api.put('/password', { password: newPassword });
      toast.success('Senha alterada com sucesso.');
      // Redirecionar para a página inicial após 5 segundos
      setTimeout(() => {
        navigate('/');
      }, 5000);
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
        type="password"
        value={currentPassword}
        onChange={e => setCurrentPassword(e.target.value)}
        placeholder="Senha Atual"
      />
      <button
        className="button-login-a"
        onClick={verifyCurrentPassword}
        disabled={isButtonDisabled}
      >
        Verificar Senha Atual
      </button>
      {showNewPasswordField && (
        <>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Nova senha"
          />
          <button className="button-login-a" onClick={handlePasswordChange}>
            Salvar
          </button>
        </>
      )}
    </div>
  );
};

export default Password;
