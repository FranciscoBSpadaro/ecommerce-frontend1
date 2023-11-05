import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../../App.css';

const CreateProduct = () => {
  // Define o estado para os dados do formulário
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    description: '',
    image: null,
    categoryId: '',
  });

  // Define o estado para armazenar as categorias
  const [categories, setCategories] = useState([]);

  // Busca as categorias disponíveis ao carregar a página
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Erro ao buscar as categorias:', error);
      }
    };

    fetchCategories();
  }, []);

  // Atualiza o estado dos campos do formulário ao serem preenchidos
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Se o campo alterado for o de imagem, atualiza o estado com o arquivo selecionado
    if (name === 'image') {
      setFormData({
        ...formData,
        image: files[0],
      });
    } else {
      // Atualiza o estado com os outros campos do formulário
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Envia os dados do formulário para criar um novo produto
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cria um objeto FormData para armazenar os dados do formulário
    const productData = new FormData();
    productData.append('productName', formData.productName);
    productData.append('price', formData.price);
    productData.append('description', formData.description);
    productData.append('categoryId', formData.categoryId);
    productData.append('image', formData.image);

    try {
      // Faz uma requisição para criar um novo produto enviando o FormData
      const response = await api.post('/admin/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Produto cadastrado com sucesso:', response.data);
      // Aqui seria possível redirecionar o usuário ou executar outra ação desejada
    } catch (error) {
      console.error('Erro ao cadastrar o produto:', error);
    }
  };

  return (
    <div className="container">
      <h1>Cadastrar Produto</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productName">Nome do Produto</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Preço</label>
          <input
            type="text"
            name="price"
            value={formData.price}
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
        <div className="form-group">
          <label htmlFor="categoryId">Categoria</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image">Imagem do Produto</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
          />
        </div>
        <button type="submit">Cadastrar Produto</button>
      </form>
    </div>
  );
};

export default CreateProduct;
