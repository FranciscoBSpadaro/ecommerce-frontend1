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
  const [productQuantities, setProductQuantities] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const navigate = useNavigate();

  const userId = jwtDecode(sessionStorage.getItem('token')).id;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/orders/user/${userId}`);
        if (response.data.length > 0) {
          setOrder(response.data[0]);
          // Inicialize productQuantities e totalValue
          let initialQuantities = {};
          let initialTotalValue = 0;
          response.data[0].products.forEach(product => {
            initialQuantities[product.productId] = 1;
            initialTotalValue += product.price;
          });
          setProductQuantities(initialQuantities);
          setTotalValue(initialTotalValue);
        }
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          console.error('Erro ao buscar pedidos', error);
        }
      }
    };
    fetchOrders();
  }, [userId]);

  useEffect(() => {
    const fetchAddresses = async () => {
      const response = await api.get(`/addresses/user/${userId}`);
      setAddresses(response.data);
    };
    fetchAddresses();
  }, [userId]);

  useEffect(() => {
    const createOrder = async () => {
      if (!selectedAddressId) return;

      try {
        const response = await api.post('/orders/create', {
          shipping_address: selectedAddressId,
          userId,
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
  }, [selectedAddressId, order, userId]);

  const handleQuantityChange = (productId, orderQuantity) => {
    setProductQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: orderQuantity,
    }));
  };

  useEffect(() => {
    if (order && order.products) {
      let newTotalValue = 0;
      order.products.forEach(product => {
        newTotalValue +=
          product.price * (productQuantities[product.productId] || 0);
      });
      setTotalValue(newTotalValue);
    }
  }, [productQuantities, order]);

  const checkoutOrder = async () => {
    try {
      // Atualizar a quantidade de cada produto no pedido antes do checkout
      for (const [productId, quantity] of Object.entries(productQuantities)) {
        await api.put(`/orders/updatequantity/${order.orderId}`, {
          productId,
          orderQuantity: quantity,
        });
      }
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

  const hasProducts = order && order.products && order.products.length > 0;

  if (!order) {
    return (
      <div>
        <div className="center-container">
          <h2>Você ainda não possui um Carrinho...</h2>
          <button onClick={() => setSelectedAddressId(addresses[0]?.addressId)}>
            🛒 Clique aqui para criar 🛒
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="center-container">
        <h2>
          {hasProducts
            ? 'Carrinho de Compras'
            : 'Seu carrinho de compras está vazio 🛒'}
        </h2>
        {hasProducts &&
          order.products.map((product, index) => (
            <div key={index}>
              <img src={product.image} alt={product.name} />
              <p>{product.name}</p>
              <div>
                <label htmlFor={`quantity-${product.productId}`}>
                  Quantidade:
                </label>
                <input
                  type="number"
                  id={`quantity-${product.productId}`} // use productId instead of id
                  value={productQuantities[product.productId]} // valor inicial definido para 1
                  min="1"
                  max={product.quantity}
                  onChange={event => {
                    const newQuantity = Number(event.target.value);
                    setProductQuantities(prevQuantities => ({
                      ...prevQuantities,
                      [product.productId]: newQuantity, // use productId instead of id
                    }));
                    handleQuantityChange(product.productId, newQuantity); // use productId instead of id
                  }}
                  className="form-control"
                />
              </div>
            </div>
          ))}
        <p>Status: {order.status}</p>
        <p>Valor total: {totalValue}</p>
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
          <button
            onClick={closeModal}
            style={{ display: 'block', margin: '0 auto' }}
          >
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
