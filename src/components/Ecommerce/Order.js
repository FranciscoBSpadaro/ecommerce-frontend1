import React, { useEffect, useState } from 'react';
import api from '../../api';

const Order = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/user');
        setOrders(response.data);
      } catch (error) {
        console.error('Erro ao buscar pedidos', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
        <div className="center-container">
      <h1>Registro De Compras</h1>
      {orders.length === 0 ? (
        <h2>Você ainda não possui compras</h2>
      ) : (
        orders.map(order => (
          <div key={order.id}>
            <h2>Pedido {order.id}</h2>
            <p>Status: {order.status}</p>
            {order.Products.map(product => (
              <div key={product.id}>
                <h3>{product.name}</h3>
                <p>Quantidade: {product.OrderProduct.quantity}</p>
              </div>
            ))}
          </div>
        ))
      )}
      </div>
    </div>
  );
};

export default Order;