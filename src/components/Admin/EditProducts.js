import React, { useState, useEffect } from 'react';
import api from '../../api';

const EditProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await api.get('/public/products');
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Lista de Produtos</h1>
      <ul>
        {products.map((product) => (
          <li key={product.productId}>
            <p>{product.productName}</p>
            <p>Preço: R$ {product.price}</p>
            {/* Adicione mais detalhes dos produtos se necessário */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditProducts;
