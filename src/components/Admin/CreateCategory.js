import React, { useState } from 'react';
import api from '../../api';
import '../../App.css';

const CreateCategory = () => {
  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/admin/categories', formData);
      console.log('Categoria cadastrada com sucesso:', response.data);
      // Redirecionar o usuário para a página de categorias ou outra ação desejada
    } catch (error) {
      console.error('Erro ao cadastrar a categoria:', error);
    }
  };

  return (
    <div className="container">
      <h1>Cadastrar Categoria</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="categoryName">Nome da Categoria</label>
          <input
            type="text"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Cadastrar Categoria</button>
      </form>
    </div>
  );
};

export default CreateCategory;
