import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../../api';
import { toast, ToastContainer } from 'react-toastify';


const ProductDetails = ({ user }) => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [showTextField, setShowTextField] = useState(false);
  const [technicalDetailsText, setTechnicalDetailsText] = useState('');

  // Obtenha os valores de isAdmin e isMod do sessionStorage
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  const isMod = sessionStorage.getItem('isMod') === 'true';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Erro ao buscar o produto:', error);
      }
    };

    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/productdetails/${productId}`);
        setProductDetails(response.data);
      } catch (error) {
        console.error('Erro ao buscar os detalhes técnicos do produto:', error);
      }
    };

    fetchProduct();
    fetchProductDetails();
  }, [productId]);

  const handleAddOrEditDetails = async () => {
    try {
      let response;
      if (productDetails) {
        response = await api.put(`/admin/productdetails/${productId}`, {
          technicalDetails: technicalDetailsText,
        });
      } else {
        response = await api.post('/admin/productdetails/create', {
          productId,
          technicalDetails: technicalDetailsText,
        });
      }
      setProductDetails(response.data);
      setShowTextField(false);
      setTechnicalDetailsText('');
    } catch (error) {
      console.error('Erro ao adicionar ou editar detalhes técnicos:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      const userId = jwtDecode(sessionStorage.getItem('token')).id;
      const response = await api.get(`/orders/user/${userId}`);
  
      if (response.data.length > 0) {
        // Ordena os pedidos por data em ordem decrescente
        const sortedOrders = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        // Seleciona o pedido mais recente que não está confirmado
        const pendingOrder = sortedOrders.find(order => order.status !== 'Confirmado');
        if (pendingOrder) {
          const orderId = pendingOrder.orderId;
          await api.post(`/orders/addProduct/${orderId}`, {
            productId,
            quantity: 1,
          });
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
      toast.error('Você ainda não possui um carrinho de compras.');
    } finally {
      setTimeout(() => {
        navigate('/cart'); // Redireciona para a página do carrinho após um pequeno atraso
      }, 2000); // Ajuste o atraso conforme necessário
    }
  };

  if (!product) {
    return <div>Carregando...</div>; // mudar para isloading
  }


  return (
    <div>
      <ToastContainer limit={5} />
    <div className="center-container-productdetails">
      <h1>{product.productName}</h1>
      <p>Preço: {product.price}</p>
      <p>Descrição: {product.description}</p>
      <p>Quantidade em Estoque: {product.quantity}</p>
      <button className="button" onClick={handleAddToCart}>
        Comprar
      </button>
      <div className="product-images-productdetails">
        {product.image_keys.map((imageKey, index) => (
          <img
            key={index}
            src={`${process.env.REACT_APP_AWS_S3_URL}${imageKey}`}
            alt={product.productName}
          />
        ))}
      </div>
      <h2>Detalhes Técnicos</h2>
      {productDetails ? (
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '18px' }}>
          {productDetails.technicalDetails}
        </pre>
      ) : (
        <p>Detalhes técnicos indisponíveis</p>
      )}
      {(isAdmin || isMod) && (
        <button onClick={() => setShowTextField(true)}>
          {productDetails
            ? 'Editar detalhes técnicos'
            : 'Adicionar detalhes técnicos'}
        </button>
      )}
      {showTextField && (
        <div>
          <textarea
            value={technicalDetailsText}
            onChange={e => setTechnicalDetailsText(e.target.value)}
          />
          <button onClick={handleAddOrEditDetails}>Salvar</button>
        </div>
      )}
    </div>
    </div>
  );
};
export default ProductDetails;
