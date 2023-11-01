import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../../App.css';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/public/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container">
      <h1>Produtos</h1>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            <div>
              <p>Nome: {product.productName}</p>
              <p>Preço: R$ {product.price}</p>
              {product.image_key && (
                <img
                  src={`${process.env.REACT_APP_AWS_S3_URL}${product.image_key}`}
                  alt={`Imagem de ${product.productName}`}
                  style={{ width: '200px', height: '200px' }}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
