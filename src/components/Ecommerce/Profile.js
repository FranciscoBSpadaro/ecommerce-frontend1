import React, { useState, useEffect } from 'react';
import api from '../../api';

const Profile = () => {
    const [currentUserProfile, setCurrentUserProfile] = useState(null);
    const [creationSuccessMessage, setCreationSuccessMessage] = useState('');
    const [creationErrorMessage, setCreationErrorMessage] = useState('');
    const [form, setForm] = useState({
        nome: '',
        nomeMeio: '',
        ultimoNome: '',
        telefone: '',
        celular: '',
    });
    const [isUpdating, setIsUpdating] = useState(false); // Adiciona estado para controlar a atualização

    useEffect(() => {
        // Busca o perfil do usuário quando o componente é montado
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
                    setCurrentUserProfile(null); // Define o perfil como nulo se não for encontrado
                } else {
                    setCurrentUserProfile(null); // Outros erros - Reinicia o perfil
                    setCreationErrorMessage('Erro ao carregar o perfil.');
                }
            }
        };

        fetchProfile();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
    
        // Verifica se os campos telefone e celular contêm apenas números e os demais se possuem letras , mas o campo de celular está bugado , é possivel solicitar o envio do formulario sem preencher celular.
        if ((name === 'telefone' || name === 'celular') && !/^\d*$/.test(value)) {  // A expressão regular ^\d*$ garante que a string pode ter zero ou mais dígitos numéricos, o que permitirá a exclusão do primeiro dígito
            setCreationErrorMessage('Por favor, preencha os campos de telefone e celular com números apenas.');
        } else if ((name === 'nome' || name === 'nomeMeio' || name === 'ultimoNome') && !/^[a-zA-Z\s]*$/.test(value)) {
            setCreationErrorMessage('Por favor, preencha os campos de nome apenas com letras.');
        } else {
            setForm({
                ...form,
                [name]: value,
            });
            setCreationErrorMessage(''); // Limpa a mensagem de erro se os campos estiverem corretos
        }
    };

    const createProfile = async () => {
        // Cria um novo perfil
        const token = sessionStorage.getItem('token');
        if (!form.nome || !form.ultimoNome || !form.telefone) {
            setCreationErrorMessage('Por favor preencha os campos obrigatórios.');
            return;
        }
        try {
            const response = await api.post('/profiles', form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCurrentUserProfile(response.data);
            setCreationSuccessMessage('Perfil criado com sucesso.');
            setCreationErrorMessage('');
            setTimeout(() => {
                window.location.reload(); // Recarrega a página após 3 segundos
            }, 3000);
        } catch (error) {
            setCreationErrorMessage(error.response.data.message || 'Erro ao criar o perfil.');
            setCreationSuccessMessage('');
        }
    };

    const updateProfile = async () => {
        // Atualiza o perfil existente
        const token = sessionStorage.getItem('token');
        try {
            const response = await api.put('/profiles', form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCurrentUserProfile(response.data);
            setIsUpdating(false); // Atualização realizada com sucesso, agora não estamos mais atualizando
        } catch (error) {
            setCreationErrorMessage(error.response.data.message || 'Erro ao atualizar o perfil.');
            setCreationSuccessMessage('');
        }
    };

    return (
        <div className="txtcenter">
            <h1>Perfil</h1>
            {currentUserProfile ? (
                <div>
                    <p>Nome completo: {currentUserProfile.nome} {currentUserProfile.nomeMeio} {currentUserProfile.ultimoNome}</p>
                    <p>Telefone: {currentUserProfile.telefone}</p>
                    <p>Celular: {currentUserProfile.celular}</p>
                    {!isUpdating ? ( // Mostra o botão para atualizar somente se não estiver atualizando
                        <button type="button" onClick={() => setIsUpdating(true)}>
                            Atualizar Perfil
                        </button>
                    ) : (
                        <form>
                            <input
                                type="text"
                                name="nome"
                                value={form.nome}
                                onChange={handleFormChange}
                                placeholder="Nome"
                                required
                                maxLength={30}
                            />
                            <input
                                type="text"
                                name="nomeMeio"
                                value={form.nomeMeio}
                                onChange={handleFormChange}
                                placeholder="Nome do meio"
                                maxLength={30}
                            />
                            <input
                                type="text"
                                name="ultimoNome"
                                value={form.ultimoNome}
                                onChange={handleFormChange}
                                placeholder="Sobrenome"
                                required
                                maxLength={30}
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
                            <button type="button" onClick={updateProfile}>Atualizar Perfil</button>
                        </form>
                    )}
                </div>
            ) : (
                <div className="h1">
                    <p>Você ainda não possui um perfil.</p>
                    <p>📝Crie um agora!😉</p>
                    <form>
                        <input
                            type="text"
                            name="nome"
                            value={form.nome}
                            onChange={handleFormChange}
                            placeholder="Nome"
                            required
                            maxLength={30}
                        />
                        <input
                            type="text"
                            name="nomeMeio"
                            value={form.nomeMeio}
                            onChange={handleFormChange}
                            placeholder="Nome do meio"
                            maxLength={30}
                        />
                        <input
                            type="text"
                            name="ultimoNome"
                            value={form.ultimoNome}
                            onChange={handleFormChange}
                            placeholder="Sobrenome"
                            required
                            maxLength={30}
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
                        <button type="button" onClick={createProfile}>Criar Perfil</button>
                    </form>
                </div>
            )}
            {creationSuccessMessage && <p style={{ color: 'green' }}>{creationSuccessMessage}</p>}
            {creationErrorMessage && <p style={{ color: 'red' }}>{creationErrorMessage}</p>}
        </div>
    );
};

export default Profile;
