import React, { useState, useEffect } from 'react';
import api from '../../api';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

const AddressForm = ({ form, onChange, onSubmit }) => {
  return (
    <div className="main-content-address">
      <h1 className="center-title">Adicionar Endereço</h1>
      <label htmlFor="street">Rua</label>
      <input
        type="text"
        id="street"
        name="street"
        placeholder="Rua"
        value={form.street}
        onChange={onChange}
      />
      <label htmlFor="city">Cidade</label>
      <input
        type="text"
        id="city"
        name="city"
        placeholder="Cidade"
        value={form.city}
        onChange={onChange}
      />
      <label htmlFor="state">Estado</label>
      <input
        type="text"
        id="state"
        name="state"
        placeholder="Estado"
        value={form.state}
        onChange={onChange}
      />
      <label htmlFor="zipCode">CEP</label>
      <input
        type="text"
        id="zipCode"
        name="zipCode"
        placeholder="CEP"
        value={form.zipCode}
        onChange={onChange}
      />
      <button type="button" onClick={onSubmit}>
        Salvar Endereço
      </button>
    </div>
  );
};

const Address = () => {
  const token = sessionStorage.getItem('token');
  const { id } = jwtDecode(token);
  const [userId] = useState(id);
  const [addresses, setAddresses] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get(`/addresses/user/${userId}`);
        setAddresses(response.data);
      } catch (error) {
        setAddresses([]);
      }
    };

    fetchAddresses();
  }, [userId, addresses.length]);

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const saveAddress = async () => {
    const { street, city, state, zipCode } = form;

    if (!street.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      toast.error('Por favor preencha todos os campos.');
      return;
    }

    if (addresses.length >= 3 && editingIndex === -1) {
      toast.error('Não é possível adicionar mais de 3 endereços.');
      return;
    }

    try {
      const endpoint =
        editingIndex !== -1
          ? `/addresses/update/${addresses[editingIndex].addressId}`
          : `/addresses/create/${userId}`;

      const method = editingIndex !== -1 ? api.put : api.post;

      const response = await method(endpoint, { street, city, state, zipCode });

      const newAddresses = [...addresses];
      if (editingIndex !== -1) {
        newAddresses[editingIndex] = response.data;
      } else {
        newAddresses.push(response.data);
      }
      setAddresses(newAddresses);
      toast.success('Endereço salvo com sucesso. 💙');
      setEditing(false);
      setForm({ street: '', city: '', state: '', zipCode: '' });
      setEditingIndex(-1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Erro ao salvar o endereço.',
      );
    }
  };

  const handleEditAddress = index => {
    const address = addresses[index];
    setForm({ ...address });
    setEditingIndex(index);
    setEditing(true);
    setIsModalOpen(true);
  };

  const handleNewAddress = () => {
    setForm({ street: '', city: '', state: '', zipCode: '' });
    setEditing(true);
  };

  const handleDeleteAddress = async index => {
    try {
      const address = addresses[index];
      await api.delete(`/addresses/delete/${address.addressId}`);
      const newAddresses = [...addresses];
      newAddresses.splice(index, 1);
      setAddresses(newAddresses);
      toast.success('Endereço excluído com sucesso.');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Erro ao excluir o endereço.',
      );
    }
  };

  Modal.setAppElement(document.body);

  return (
    <div>
      <ToastContainer />
      {addresses.map((address, index) => (
        <div key={index} className="main-content-address">
          <h1 className="center-title">Endereço {index + 1}</h1>
          <p>Rua: {address.street}</p>
          <p>Cidade: {address.city}</p>
          <p>Estado: {address.state}</p>
          <p>CEP: {address.zipCode}</p>
          <button type="button" onClick={() => handleEditAddress(index)}>
            Editar Endereço
          </button>
          <button type="button" onClick={() => handleDeleteAddress(index)}>
            Excluir Endereço
          </button>
        </div>
      ))}

      {addresses.length === 0 || editing ? (
        <AddressForm
          form={form}
          onChange={handleFormChange}
          onSubmit={saveAddress}
        />
      ) : (
        <button type="button" onClick={handleNewAddress}>
          Novo Endereço
        </button>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setForm({ street: '', city: '', state: '', zipCode: '' });
        }}
      >
        {editing && (
          <AddressForm
            form={form}
            onChange={handleFormChange}
            onSubmit={() => {
              saveAddress();
              setIsModalOpen(false);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Address;
