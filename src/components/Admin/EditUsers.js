import React, { useState, useEffect } from 'react';
import api from '../../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const EditUser = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [role, setRole] = useState('Cliente'); // Inicializar o estado role como 'Cliente'
  const [initialRole, setInitialRole] = useState('Cliente'); // Inicializar o estado initialRole como 'Cliente'
  const [isSaveDisabled, setIsSaveDisabled] = useState(true); // Inicializar o estado isSaveDisabled como true

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

  const handleEditMode = () => {
    setEditMode(true);
  };

  const handleEdit = async event => {
    event.preventDefault();

    confirmAlert({
      title: 'Alteração de usuário',
      message: `Deseja alterar o papel de ${user.username} para ${role}?`,
      buttons: [
        {
          label: 'Sim',
          onClick: async () => {
            try {
              const updateResult = await api.put(`/admin/users/roles`, {
                isAdmin: role === 'Administrador',
                isMod: role === 'Moderador',
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
          },
        },
        {
          label: 'Não',
          onClick: () => {},
        },
      ],
    });
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

  const handleDelete = async () => {
    confirmAlert({
      title: 'Exclusão de usuário',
      message: `Deseja excluir o usuário ${user.username}?`,
      buttons: [
        {
          label: 'Sim',
          onClick: async () => {
            try {
              const deleteResult = await api.delete(`/admin/users/delete`, {
                data: { username: user.username },
              });

              toast.success('Usuário excluído com sucesso!');
              setEditMode(false);
              setUser(null);

              console.log(deleteResult.data);
            } catch (error) {
              console.error('Erro na exclusão do usuário:', error);
              toast.error('Não é possível excluir um usuário se houver um perfil Associado a ele ou se for Administrador.');
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

  useEffect(() => {
    if (user) {
      const emailInput = document.querySelector(`input[name="email"]`);
      const usernameInput = document.querySelector(`input[name="username"]`);
      const isEmailValidatedInput = document.querySelector(
        `input[name="isEmailValidated"]`,
      );
      const verificationCodeInput = document.querySelector(
        `input[name="verificationCode"]`,
      );

      emailInput && (emailInput.value = user.email ?? '');
      usernameInput && (usernameInput.value = user.username ?? '');

      isEmailValidatedInput &&
        (isEmailValidatedInput.checked =
          user.userDetail.isEmailValidated ?? false);

      verificationCodeInput &&
        (verificationCodeInput.value = user.userDetail.verificationCode ?? '');

      const userRole = user.userDetail.isAdmin
        ? 'Administrador'
        : user.userDetail.isMod
        ? 'Moderador'
        : !user.userDetail.isAdmin && !user.userDetail.isMod
        ? 'Cliente'
        : '';

      setRole(userRole);
      setInitialRole(userRole); // Atualizar o estado initialRole com o papel do usuário
    }
  }, [user]);

  useEffect(() => {
    // Atualizar o estado isSaveDisabled com base na comparação entre o papel atual e o papel inicial
    setIsSaveDisabled(role === initialRole);
  }, [role, initialRole]);

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
              <label htmlFor="role">Papel:</label>
              <select
                name="role"
                value={role}
                onChange={e => setRole(e.target.value)}
                disabled={!editMode}
              >
                <option value="Cliente">Cliente</option>
                <option value="Administrador">Administrador</option>
                <option value="Moderador">Moderador</option>
              </select>
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
                <button
                  className="button-edit-user"
                  type="submit"
                  disabled={isSaveDisabled}
                >
                  Salvar
                </button>
                <button
                  className="button-edit-user"
                  type="button"
                  onClick={handleResetPassword}
                >
                  Redefinir Senha
                </button>
                <button
                  className="button-remove-produdct"
                  type="button"
                  onClick={handleDelete}
                >
                  Excluir
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
