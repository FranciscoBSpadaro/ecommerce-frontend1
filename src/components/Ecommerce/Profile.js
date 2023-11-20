import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [creationSuccessMessage, setCreationSuccessMessage] = useState('');
  const [creationErrorMessage, setCreationErrorMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [form, setForm] = useState({
    nomeCompleto: '',
    telefone: '',
    celular: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profiles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUserProfile(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setCurrentUserProfile(null);
        } else {
          setCurrentUserProfile(null);
          setCreationErrorMessage('Erro ao carregar o perfil.');
        }
      }
    };

    fetchProfile();
  }, []);

  const handleFormChange = e => {
    const { name, value } = e.target;
  
    if ((name === 'telefone' || name === 'celular') && !/^\d*$/.test(value)) {
      setCreationErrorMessage(
        'Por favor, preencha os campos de telefone e celular com números.',
      );
    } else if (name === 'nomeCompleto' && !/^[a-zA-Z\s]*$/.test(value)) {
      setCreationErrorMessage(
        'Por favor, preencha o campo de nome completo apenas com letras.',
      );
    } else if (
      name === 'nomeCompleto' &&
      value.replace(/\s/g, '').length > 60
    ) {
      setCreationErrorMessage(
        'O campo "Nome Completo" deve ter no máximo 60 caracteres no total.',
      );
    } else if (
      name === 'nomeCompleto' &&
      value.split(' ').some(part => part.length > 20)
    ) {
      setCreationErrorMessage(
        'Formato do Nome inválido, Máximo 20 letras para cada parte do seu nome, Adicione um Espaço.',
      );
    } else if (
      name === 'nomeCompleto' &&
      value.split(' ').length > 6
    ) {
      setCreationErrorMessage(
        'Formato do Nome inválido, Máximo de 5 espaços permitidos.',
      );
    } else {
      setForm({
        ...form,
        [name]: value,
      });
      setCreationErrorMessage('');
    }
  
    // Verifique se todos os campos estão preenchidos corretamente
    const isFormValid = form.nomeCompleto && form.telefone && form.celular && !creationErrorMessage && value !== '';
  
    // Atualize o estado isFormValid
    setIsFormValid(isFormValid);
  };

  const createProfile = async () => {
    const token = sessionStorage.getItem('token');
    if (!form.nomeCompleto || !form.telefone) {
      setCreationErrorMessage('Por favor preencha os campos obrigatórios.');
      return;
    }
    try {
      const { nomeCompleto, telefone, celular } = form;
      const fullName = nomeCompleto.split(' ');
      const nome = fullName.shift();
      const ultimoNome = fullName.pop() || '❌';
      const nomeMeio = fullName.join(' ') || '❌';
      const response = await api.post(
        '/profiles',
        { nome, nomeMeio, ultimoNome, telefone, celular },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCurrentUserProfile(response.data);
      setCreationSuccessMessage('Perfil Criado com Sucesso. 💚');
      setCreationErrorMessage('');
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      setCreationErrorMessage(
        error.response.data.message || 'Erro ao criar o perfil.',
      );
      setCreationSuccessMessage('');
    }
  };

  const updateProfile = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const { nomeCompleto, telefone, celular } = form;
      const fullName = nomeCompleto.split(' ');
      const nome = fullName.shift();
      const ultimoNome = fullName.pop() || '❌';
      const nomeMeio = fullName.join(' ') || '❌';
      const response = await api.put(
        '/profiles',
        { nome, nomeMeio, ultimoNome, telefone, celular },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCurrentUserProfile(response.data);
      setIsUpdating(false);
      setCreationSuccessMessage('Perfil Atualizado com Sucesso. 💚');
      setTimeout(() => {
        setCreationSuccessMessage('');
      }, 5000);
    } catch (error) {
      setCreationErrorMessage(
        error.response.data.message || 'Erro ao atualizar o perfil.',
      );
      setCreationSuccessMessage('');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCreationErrorMessage('');
      setCreationSuccessMessage('');
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [creationErrorMessage, creationSuccessMessage]);

  return (
    <div className="center-container">
      {currentUserProfile ? (
        <div className="main-content">
          <h1 className="center-title">Perfil</h1>
          <p>
            Nome completo: {currentUserProfile.nome}{' '}
            {currentUserProfile.nomeMeio} {currentUserProfile.ultimoNome}
          </p>
          <p>Telefone: {currentUserProfile.telefone}</p>
          <p>Celular: {currentUserProfile.celular}</p>
          {!isUpdating ? (
            <button type="button" onClick={() => setIsUpdating(true)}>
              Atualizar Perfil
            </button>
          ) : (
            <form>
              <input
                type="text"
                name="nomeCompleto"
                value={form.nomeCompleto}
                onChange={handleFormChange}
                placeholder="Nome Completo"
                required
                maxLength={90}
              />
              <input
                type="tel"
                name="telefone"
                value={form.telefone}
                onChange={handleFormChange}
                placeholder="Telefone (apenas números)"
                required
                pattern="[0-9]{8,}"
                maxLength={10}
              />
              <input
                type="tel"
                name="celular"
                value={form.celular}
                onChange={handleFormChange}
                placeholder="Celular (apenas números)"
                pattern="[0-9]{8,}"
                maxLength={11}
              />
              <button type="button" onClick={updateProfile} disabled={!isFormValid}>
                Atualizar Perfil
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="center-title">
          <h3>Você ainda não possui um perfil.</h3>
          <h4>📝Crie um agora!😉</h4>
          <form>
            <input
              type="text"
              name="nomeCompleto"
              value={form.nomeCompleto}
              onChange={handleFormChange}
              placeholder="Nome Completo"
              required
              maxLength={90}
            />
            <input
              type="text"
              name="telefone"
              value={form.telefone}
              onChange={handleFormChange}
              placeholder="Telefone (apenas números)"
              required
              pattern="[0-9]{8,}"
              maxLength={10}
            />
            <input
              type="text"
              name="celular"
              value={form.celular}
              onChange={handleFormChange}
              placeholder="Celular (apenas números)"
              pattern="[0-9]{8,}"
              maxLength={11}
            />
          </form>
          <button className="button" type="button" onClick={createProfile} disabled={!isFormValid}>
            Criar Perfil
          </button>
        </div>
      )}
      <div className="error-messages">
        {creationErrorMessage && <div>{creationErrorMessage}</div>}
      </div>
      <div className="success-messages">
        {creationSuccessMessage && <div>{creationSuccessMessage}</div>}
      </div>
      <h4> Clique no Botão abaixo e cadastre seu Endereço</h4>
      <Link to="/address" className="button">
        Endereços
      </Link>
    </div>
  );
};

export default Profile;
