import React, { useEffect, useState } from 'react';
import api from '../../api';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

const CartContainer = () => {
  const [order, setOrder] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = jwtDecode(sessionStorage.getItem('token')).id;
      try {
        const response = await api.get(`/orders/user/${userId}`);
        if (response.data.length > 0) {
          setOrder(response.data[0]);
        }
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          console.error('Erro ao buscar pedidos', error);
        }
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      const userId = jwtDecode(sessionStorage.getItem('token')).id;
      const response = await api.get(`/addresses/user/${userId}`);
      setAddresses(response.data);
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    const createOrder = async () => {
      if (!selectedAddressId) return;

      try {
        const response = await api.post('/orders/create', {
          shipping_address: selectedAddressId,
          userId: jwtDecode(sessionStorage.getItem('token')).id,
        });

        if (response.status === 201) {
          setOrder(response.data.order);
          toast.success('Carrinho criado com sucesso');
        }
      } catch (error) {
        console.error('Erro ao criar nova ordem', error);
      }
    };

    if (!order) {
      createOrder();
    }
  }, [selectedAddressId, order]);

  const checkoutOrder = async () => {
    try {
      const response = await api.get(`/orders/checkout/${order.orderId}`);

      if (response.status === 200) {
        navigate(`/checkout/${order.orderId}`);
      }
    } catch (error) {
      console.error('Erro ao fazer checkout do pedido', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const changeAddress = addressId => {
    setSelectedAddressId(addressId);
    closeModal();
  };

  Modal.setAppElement('#root');

  const selectedAddress = addresses.find(
    address => address.id === selectedAddressId,
  );

  // Verifique se há produtos no carrinho
  const hasProducts = order && order.products && order.products.length > 0;

  if (!order) {
    return (
      <div>
        <div className="center-container">
          <h2>Você ainda não criou um carrinho de compras</h2>
          <button onClick={() => setSelectedAddressId(addresses[0]?.addressId)}>
            Clique aqui para criar um agora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="center-container">
        <h2>Seu carrinho de compras está vazio 🛒</h2>
        <p>Status: {order.status}</p>
        <p>Valor total: {order.total_value}</p>
        <p>
          Endereço de entrega:{' '}
          {selectedAddress
            ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}`
            : 'Nenhum endereço selecionado'}
        </p>
        <button onClick={openModal}>Alterar endereço</button>
        <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
  <h2 style={{ textAlign: 'center' }}>Endereços cadastrados</h2>
  {addresses.map((address, index) => (
    <div key={index}>
      <p>{`${address.street}, ${address.city}, ${address.state}`}</p>
      <button onClick={() => changeAddress(address.id)}>
        Selecionar este endereço
      </button>
    </div>
  ))}
  <button onClick={closeModal} style={{ display: 'block', margin: '0 auto' }}>
    Fechar
  </button>
</Modal>
        <button
          onClick={checkoutOrder}
          disabled={!selectedAddress || !hasProducts}
        >
          Confirmar compra
        </button>
      </div>
    </div>
  );
};

export default CartContainer;
