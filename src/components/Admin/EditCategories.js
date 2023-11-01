import React, { useState, useEffect } from 'react';
import api from '../../api';

const EditCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await api.get('/categories');
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Erro ao buscar as categorias:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Lista de Categorias</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <p>{category.categoryName}</p>
            {/* Adicione mais detalhes das categorias se necessário */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditCategories;
