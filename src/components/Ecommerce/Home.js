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
        {products.map((product, index) => (  // Adicionando um índice como a chave única
          <li key={index}> 
            <div>
              <p>Nome: {product.productName}</p>
              <p>Preço: R$ {product.price}</p>
              {product.image_url && ( // Verificando se a URL da imagem está presente
                <img src={product.image_url} alt={`Imagem de ${product.productName}`} style={{ width: '200px', height: '200px' }} />  // image_url definido no modelo Product.js no backend
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
