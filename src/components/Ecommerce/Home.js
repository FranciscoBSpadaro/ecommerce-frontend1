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
              {product.image_keys && product.image_keys.length > 0 && (
                <div>
                  <img
                    src={`${process.env.REACT_APP_AWS_S3_URL}${product.image_keys[0]}`}
                    alt={`Imagem de ${product.productName}`}
                    style={{ width: '200px', height: '200px' }}
                  />
                  {product.image_keys.length > 1 && (
                    <div>
                      <p>Outras Imagens:</p>
                      <ul>
                        {product.image_keys.slice(1).map((image, imageIndex) => (
                          <li key={imageIndex}>
                            <img
                              src={`${process.env.REACT_APP_AWS_S3_URL}${image}`}
                              alt={`Imagem de ${product.productName}`}
                              style={{ width: '100px', height: '100px' }}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
