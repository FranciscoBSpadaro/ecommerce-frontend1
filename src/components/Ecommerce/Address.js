import React, { useState, useEffect } from 'react';
import api from '../../api';

const Address = () => {
    const [currentAddress, setCurrentAddress] = useState(null);
    const [creationSuccessMessage, setCreationSuccessMessage] = useState('');
    const [creationErrorMessage, setCreationErrorMessage] = useState('');
    const [form, setForm] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
    });

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const fetchAddress = async () => {
            try {
                const response = await api.get('/addresses', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCurrentAddress(response.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setCurrentAddress(null);
                } else {
                    setCurrentAddress(null);
                    setCreationErrorMessage('Erro ao carregar o endereço.');
                }
            }
        };

        fetchAddress();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
        setCreationErrorMessage('');
    };

    const createAddress = async () => {
        const token = sessionStorage.getItem('token');
        if (!form.street || !form.city || !form.state || !form.zipCode) {
            setCreationErrorMessage('Por favor preencha todos os campos.');
            return;
        }
        try {
            const { street, city, state, zipCode } = form;
            const response = await api.post('/addresses', { street, city, state, zipCode }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCurrentAddress(response.data);
            setCreationSuccessMessage('Endereço criado com sucesso. 💚');
            setCreationErrorMessage('');
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            setCreationErrorMessage(error.response.data.message || 'Erro ao criar o endereço.');
            setCreationSuccessMessage('');
        }
    };

    const updateAddress = async () => {
        const token = sessionStorage.getItem('token');
        try {
            const { street, city, state, zipCode } = form;
            const response = await api.put('/addresses', { street, city, state, zipCode }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCurrentAddress(response.data);
            setCreationSuccessMessage('Endereço atualizado com sucesso. 💚');
            setTimeout(() => {
                setCreationSuccessMessage('');
            }, 5000);
        } catch (error) {
            setCreationErrorMessage(error.response.data.message || 'Erro ao atualizar o endereço.');
            setCreationSuccessMessage('');
        }
    };

    return (
        <div className="center-container">
            {currentAddress ? (
                <div className="main-content">
                    <h1 className="center-title">Endereço</h1>
                    <p>Rua: {currentAddress.street}</p>
                    <p>Cidade: {currentAddress.city}</p>
                    <p>Estado: {currentAddress.state}</p>
                    <p>CEP: {currentAddress.zipCode}</p>
                    <button type="button" onClick={updateAddress}>Atualizar Endereço</button>
                    </div>
            ) : (
                <div className="main-content">
                    <h1 className="center-title">Adicionar Endereço</h1>
                    <input
                        type="text"
                        name="street"
                        placeholder="Rua"
                        value={form.street}
                        onChange={handleFormChange}
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="Cidade"
                        value={form.city}
                        onChange={handleFormChange}
                    />
                    <input
                        type="text"
                        name="state"
                        placeholder="Estado"
                        value={form.state}
                        onChange={handleFormChange}
                    />
                    <input
                        type="text"
                        name="zipCode"
                        placeholder="CEP"
                        value={form.zipCode}
                        onChange={handleFormChange}
                    />
                    <button type="button" onClick={createAddress}>Criar Endereço</button>
                </div>
            )}
            {creationSuccessMessage && <p className="success-message">{creationSuccessMessage}</p>}
            {creationErrorMessage && <p className="error-message">{creationErrorMessage}</p>}
        </div>
    );
};

export default Address;