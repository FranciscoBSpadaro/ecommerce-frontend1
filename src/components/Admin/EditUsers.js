import React, { useState, useEffect } from 'react';
import api from '../../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const EditUser = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleSearch = async event => {
    event.preventDefault();
    const searchQuery = event.target.elements.searchQuery.value.trim();
    // Determinar se a consulta de pesquisa é um email ou um username
    const searchField = searchQuery.includes('@') ? 'email' : 'username';

    if (searchQuery) {
      try {
        const result = await api.get(`/admin/users/edit`, {
          params: {
            [searchField]: searchQuery,
          },
        });

        if (result.data) {
          setUser(result.data);
          toast.dismiss();
          setEditMode(false);
        }
      } catch (error) {
        toast.error(error.response.data.message);
        setUser(null);
      }
    }
  };

  const handleEdit = async event => {
    event.preventDefault();
    const isAdmin = event.target.elements.isAdmin.checked;
    const isMod = event.target.elements.isMod.checked;

    try {
      const updateResult = await api.put(`/admin/users/roles`, {
        isAdmin,
        isMod,
        id: user.id,
      });

      toast.success('Alterações salvas com sucesso!');
      setEditMode(false);
      setUser(null);

      console.log(updateResult.data);
    } catch (error) {
      console.error('Erro na edição do usuário:', error);
      toast.error('Erro ao salvar as alterações.');
    }
  };

  const handleResetPassword = async () => {
    confirmAlert({
      title: 'Redefinição de Senha',
      message:
        'Essa ação ira enviar um e-mail com uma nova senha para o Usuário, Deseja Continuar ?',
      buttons: [
        {
          label: 'Sim',
          onClick: async () => {
            try {
              const resetResult = await api.post(
                `/admin/email/requestNewPassword`,
                {
                  id: user.id,
                },
              );
              if (resetResult.status === 200) {
                if (!toast.isActive('successToast')) {
                  toast.success(resetResult.data.message, {
                    toastId: 'successToast',
                  });
                }
                console.log(resetResult.data);
              }
            } catch (error) {
              toast.error(error.response.data.message);
              console.error('Erro ao redefinir a senha:', error);
            }
          },
        },
        {
          label: 'Não',
          onClick: () => {},
        },
      ],
    });
  };

  const handleEditMode = () => {
    setEditMode(true);
  };

  useEffect(() => {
    if (user) {
      const emailInput = document.querySelector(`input[name="email"]`);
      const usernameInput = document.querySelector(`input[name="username"]`);
      const isAdminInput = document.querySelector(`input[name="isAdmin"]`);
      const isModInput = document.querySelector(`input[name="isMod"]`);
      const isEmailValidatedInput = document.querySelector(
        `input[name="isEmailValidated"]`,
      );
      const verificationCodeInput = document.querySelector(
        `input[name="verificationCode"]`,
      );

      emailInput && (emailInput.value = user.email ?? '');
      usernameInput && (usernameInput.value = user.username ?? '');
      isAdminInput && (isAdminInput.checked = user.userDetail.isAdmin ?? false);
      isModInput && (isModInput.checked = user.userDetail.isMod ?? false);
      isEmailValidatedInput &&
        (isEmailValidatedInput.checked =
          user.userDetail.isEmailValidated ?? false);
      verificationCodeInput &&
        (verificationCodeInput.value = user.userDetail.verificationCode ?? '');
    }
  }, [user]);

  return (
    <>
      <div className="center-container-login">
        <ToastContainer />
        <h1>Editar Usuários</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="searchQuery"
            placeholder="Buscar por Username ou E-mail"
          />
          <button className="button-edit-user" type="submit">
            Buscar
          </button>
        </form>

        {user && (
          <form onSubmit={handleEdit}>
            <div>
              <label htmlFor="email">Email:</label>
              <input type="email" name="email" readOnly disabled />
            </div>
            <div>
              <label htmlFor="isEmailValid">Status E-mail</label>
              <input
                type="text"
                name="isEmailValid"
                disabled={true}
                value={
                  user.userDetail.isEmailValidated
                    ? 'Verificado ✔'
                    : 'Não-Verificado ❌'
                }
              />
            </div>
            <div>
              <label htmlFor="username">Username:</label>
              <input type="text" name="username" readOnly disabled />
            </div>
            <div>
              <label htmlFor="verificationCode">Código de Verificação:</label>
              <input type="text" name="verificationCode" disabled={true} />
            </div>
            <div>
              <label htmlFor="isCodeValid">Status do Código:</label>
              <input
                type="text"
                name="isCodeValid"
                disabled={true}
                value={user.userDetail.isCodeValid ? 'Ativado' : 'Desativado'}
              />
            </div>
            <div>
              <label htmlFor="isAdmin">Admin:</label>
              <input type="checkbox" name="isAdmin" disabled={!editMode} />
            </div>
            <div>
              <label htmlFor="isMod">Moderador:</label>
              <input type="checkbox" name="isMod" disabled={!editMode} />
            </div>
            <button
              className="button-edit-user"
              type="button"
              onClick={handleEditMode}
              style={{ display: editMode ? 'none' : 'block' }}
            >
              Editar
            </button>
            {editMode && (
              <>
                <button className="button-edit-user" type="submit">
                  Salvar
                </button>
                <button
                  className="button-edit-user"
                  type="button"
                  onClick={handleResetPassword}
                >
                  Redefinir Senha
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </>
  );
};

export default EditUser;
