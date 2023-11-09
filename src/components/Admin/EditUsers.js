import React, { useState, useEffect } from "react";
import api from '../../api';

const EditUser = () => {
  const [user, setUser] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    const searchQuery = event.target.elements.searchQuery.value.trim();
    const searchField = event.target.elements.searchField.value.trim();

    if (searchQuery && searchField) {
      try {
        const result = await api.get(`/admin/users/edit`, {
          params: {
            [searchField]: searchQuery
          }
        });

        if (result.data) {
          setUser(result.data);
          setSearchError('');
          setServerSuccess('');
          setEditMode(false);
        } else {
          setUser(null);
          setSearchError('Usuário não encontrado.');
          setServerSuccess('');
        }
      } catch (error) {
        console.error("Erro na busca:", error);
        setSearchError('Ocorreu um erro na busca. Tente novamente.');
        setServerSuccess('');
        setUser(null);

        setTimeout(() => {
          setSearchError('');
        }, 5000);
      }
    }
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    const isAdmin = event.target.elements.isAdmin.checked;
    const isMod = event.target.elements.isMod.checked;

    try {
      const updateResult = await api.put(`/admin/users/roles`, {
        isAdmin,
        isMod,
        username: user.username
      });

      setServerSuccess('Alterações salvas com sucesso!');
      setSearchError('');
      setEditMode(false);
      setUser(null);

      setTimeout(() => {
        setServerSuccess('');
        const emailInput = document.querySelector(`input[name="email"]`);
        const usernameInput = document.querySelector(`input[name="username"]`);
        const isAdminInput = document.querySelector(`input[name="isAdmin"]`);
        const isModInput = document.querySelector(`input[name="isMod"]`);

        emailInput && (emailInput.value = '');
        usernameInput && (usernameInput.value = '');
        isAdminInput && (isAdminInput.checked = false);
        isModInput && (isModInput.checked = false);
      }, 5000);

      console.log(updateResult.data);
    } catch (error) {
      console.error("Erro na edição do usuário:", error);
      setSearchError('Erro ao salvar as alterações.');
      setServerSuccess('');

      setTimeout(() => {
        setSearchError('');
      }, 5000);
    }
  };

  const handleEditMode = () => {
    setEditMode(true);
  };

  useEffect(() => {
    if (user) {
      document.querySelector(`input[name="email"]`).value = user.email ?? '';
      document.querySelector(`input[name="username"]`).value = user.username ?? '';
      document.querySelector(`input[name="isAdmin"]`).checked = user.isAdmin ?? false;
      document.querySelector(`input[name="isMod"]`).checked = user.isMod ?? false;
    }
  }, [user]);

  return (
    <>
    <div className="center-container-edit">
      <h2>Editar Usuários</h2>
      <form onSubmit={handleSearch}>
        <input type="text" name="searchQuery" placeholder="Buscar por Username ou E-mail" />
        <select name="searchField">
          <option value="email">E-mail</option>
          <option value="username">Username</option>
        </select>
        <button type="submit">Buscar</button>
      </form>
      </div>

      {searchError && <p style={{ color: 'red' }}>{searchError}</p>}
      {serverSuccess && <p style={{ color: 'green' }}>{serverSuccess}</p>}

      {user && (
        <form onSubmit={handleEdit} className="center-container-edit">
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" defaultValue={user.email ?? ''} readOnly disabled />
          </div>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" name="username" defaultValue={user.username ?? ''} readOnly disabled />
          </div>
          <div>
            <label htmlFor="isAdmin">Admin:</label>
            <input
              type="checkbox"
              name="isAdmin"
              defaultChecked={user.isAdmin ?? false}
              disabled={!editMode}
            />
          </div>
          <div>
            <label htmlFor="isMod">Moderador:</label>
            <input
              type="checkbox"
              name="isMod"
              defaultChecked={user.isMod ?? false}
              disabled={!editMode}
            />
          </div>
          <button type="button" onClick={handleEditMode} disabled={!!serverSuccess}>
            Editar
          </button>
          {editMode && (
            <button type="submit" disabled={!!serverSuccess}>
              Salvar
            </button>
          )}
        </form>
      )}
    </>
  );
};

export default EditUser;
