import React, { useState } from 'react';
import api from '../../api';

const Password = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async () => {
    const token = sessionStorage.getItem('token');
    try {
      await api.put('/password',
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Senha alterada com sucesso.');
      setError('');
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError('Erro na requisição.');
      } else {
        setError('Erro interno.');
      }
      setSuccess('');
    }
  };

  return ( // TODO implementar codigo de validação , apos usuario digitar nova senha tem que enviar um codigo de validação
    <div>
      <h1>Alterar Senha</h1>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handlePasswordChange}>Salvar</button>
    </div>
  );
};

export default Password;
