import React, { useEffect, useState } from 'react';
import api from '../../api';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import Lottie from 'lottie-react';
import createCartAnimation from '../../Assets/create-cart.json';
import cartCreatedAnimation from '../../Assets/cart-created.json';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import Modal from 'react-modal';
import { CardPayment, initMercadoPago } from '@mercadopago/sdk-react';

const CartContainer = () => {
  const [order, setOrder] = useState(null);
  const [animationData, setAnimationData] = useState(createCartAnimation);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productQuantities, setProductQuantities] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const [showCardPayment, setShowCardPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userId = jwtDecode(sessionStorage.getItem('token')).id;

  initMercadoPago(`${process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY}`);

  const initialization = {
    amount: totalValue,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/orders/user/${userId}`);
        if (response.data.length > 0) {
          // Verifique se o status do pedido não é 'confirmado' antes de definir o estado
          const pendingOrder = response.data.find(
            order => order.status !== 'Confirmado',
          );
          if (pendingOrder) {
            setOrder(pendingOrder);
            // Inicialize productQuantities e totalValue
            let initialQuantities = {};
            let initialTotalValue = 0;
            pendingOrder.products.forEach(product => {
              initialQuantities[product.productId] = product.orderQuantity; // Use a quantidade real do pedido
              initialTotalValue += product.price * product.orderQuantity; // Multiplique o preço pelo quantidade do pedido
            });
            setProductQuantities(initialQuantities);
            setTotalValue(initialTotalValue);
          }
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
      try {
        const response = await api.get(`/addresses/user/${userId}`);
        setAddresses(response.data);
      } catch (error) {
        console.error('Erro ao buscar endereços', error);
        if (error.response && error.response.status === 404) {
          confirmAlert({
            title: 'Cadastre seu Endereço',
            message: 'Você ainda não cadastrou um endereço, cadastre e começe a comprar.',
            buttons: [
              {
                label: 'Ok',
                onClick: () => window.location.href = '/address'
              }
            ]
          });
        }
      }
    };
    fetchAddresses();
  }, [userId]);

  const handleAnimationClick = () => {
    setAnimationData(cartCreatedAnimation);
    setTimeout(() => {
      setSelectedAddressId(addresses[0]?.addressId);
    }, 2000); // delay para visualizar a animação
  };

  useEffect(() => {
    const createOrder = async () => {
      if (!selectedAddressId) {
        return;
      }
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

  const handleRemoveProduct = async productId => {
    try {
      const response = await api.post(
        `/orders/removeproduct/${order.orderId}`,
        {
          productId,
        },
      );

      if (response.status === 200) {
        toast.success('Produto removido com sucesso do pedido');
        // Atualize o estado do pedido para refletir a remoção do produto
        setOrder(prevOrder => ({
          ...prevOrder,
          products: prevOrder.products.filter(
            product => product.productId !== productId,
          ),
        }));
      }
    } catch (error) {
      console.error('Erro ao remover produto do pedido', error);
    }
  };

  const onSubmit = async formData => {
    setIsLoading(true);
    return new Promise(async (resolve, reject) => {
      try {
        setShowCardPayment(true);
        // Atualizar a quantidade de cada produto no pedido antes do checkout
        const productUpdates = Object.entries(productQuantities).map(
          ([productId, quantity]) => ({
            productId,
            orderQuantity: quantity,
          }),
        );

        await api.put(
          `/orders/updatequantity/${order.orderId}`,
          productUpdates,
        );

        const response = await api.get(`/orders/checkout/${order.orderId}`);

        if (response.status === 200) {
          // Prossiga com o processamento do pagamento
          const paymentResponse = await fetch(
            'http://localhost:3000/orders/process_payment',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              },
              body: JSON.stringify({
                ...formData,
                orderId: order.orderId,
                description: `Descrição do produto: ${order.products
                  .map(product => product.description)
                  .join(', ')}`,
              }),
            },
          );

          if (paymentResponse.ok) {
            const paymentData = await paymentResponse.json();
            console.log(paymentData);
            toast.success('Pagamento bem-sucedido');
            window.location.replace('/order');
            resolve();
          } else {
            toast.error('Ocorreu um erro, tente novamente');
            reject();
          }
        }
      } catch (error) {
        console.error('Erro ao fazer checkout do pedido', error);
        toast.error('Ocorreu um erro, tente novamente');
        reject();
      }
    });
  };

  const onError = async error => {
    console.log(error);
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
        <ToastContainer limit={5} />
        <div className="center-container-cart">
          <h2>Você ainda não possui um Carrinho...</h2>
          <Lottie
            animationData={animationData}
            style={{ height: 400, width: 400 }}
            onClick={handleAnimationClick}
          />
          <h3>Clique no carrinho para criar </h3>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer limit={5} />
      <div>
        <h2 className="center-title">
          {hasProducts
            ? 'Carrinho de Compras'
            : 'Seu carrinho de compras está vazio 🛒'}
        </h2>
        {hasProducts && (
          <div className="product-container">
            {order.products.map((product, index) => (
              <div key={index} className="product-item">
                <div>
                  <img
                    src={`${process.env.REACT_APP_AWS_S3_URL}${product.image_keys[0]}`}
                    alt={product.productName}
                    className="product-image"
                  />
                  <p>{product.productName}</p>
                  <p>{product.description}</p>
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
                    />
                    <button
                      onClick={() => handleRemoveProduct(product.productId)}
                    >
                      Remover produto
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
        <button onClick={onSubmit} disabled={!selectedAddress || !hasProducts}>
          Confirmar compra
        </button>
        {showCardPayment && (
          <Modal
            isOpen={showCardPayment}
            onRequestClose={() => setShowCardPayment(false)}
          >
            <button onClick={() => setShowCardPayment(false)}>Fechar</button>
            {isLoading && (
              <div className="loading-animation">Carregando...</div>
            )}
            <CardPayment
              initialization={initialization}
              onSubmit={onSubmit}
              onReady={() => setIsLoading(false)}
              onError={onError}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default CartContainer;
