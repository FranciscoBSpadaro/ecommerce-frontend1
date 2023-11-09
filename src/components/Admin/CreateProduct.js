import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../../App.css';

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    description: '',
    images: [],
    categoryId: '',
  });

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isEditProductMode, setIsEditProductMode] = useState(false);
  const [isEditCategoryMode, setIsEditCategoryMode] = useState(false);
  const [productIdToEdit, setProductIdToEdit] = useState(null);
  const [categoryIdToEdit, setCategoryIdToEdit] = useState(null);

  // Carregar categorias e produtos ao montar o componente
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar as categorias:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/public/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar os produtos:', error);
    }
  };

  const handleEditProduct = (productId) => {
    setIsEditProductMode(true);
    setProductIdToEdit(productId);

    const productToEdit = products.find((product) => product.productId === productId);
    if (productToEdit) {
      setFormData({
        productName: productToEdit.productName,
        price: productToEdit.price,
        description: productToEdit.description,
        categoryId: productToEdit.categoryId,
        images: productToEdit.images,
      });
    }
  };

  const handleEditCategory = (categoryId) => {
    setIsEditCategoryMode(true);
    setCategoryIdToEdit(categoryId);

    const categoryToEdit = categories.find((category) => category.categoryId === categoryId);
    if (categoryToEdit) {
      setFormData({
        categoryName: categoryToEdit.categoryName,
        description: categoryToEdit.description,
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditProductMode(false);
    setIsEditCategoryMode(false);
    setProductIdToEdit(null);
    setCategoryIdToEdit(null);
    setFormData({
      productName: '',
      price: '',
      description: '',
      images: [],
      categoryId: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditProductMode) {
      try {
        const response = await api.put(`/admin/products/${productIdToEdit}`, formData);
        console.log('Produto atualizado com sucesso:', response.data);
        handleCancelEdit();
        fetchProducts();
      } catch (error) {
        console.error('Erro ao atualizar o produto:', error);
      }
    } else {
      try {
        const response = await api.post('/admin/products', formData);
        console.log('Produto cadastrado com sucesso:', response.data);
        setFormData({
          productName: '',
          price: '',
          description: '',
          images: [],
          categoryId: '',
        });
        fetchProducts();
      } catch (error) {
        console.error('Erro ao cadastrar o produto:', error);
      }
    }
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();

    if (isEditCategoryMode) {
      try {
        const response = await api.put(`/admin/categories/${categoryIdToEdit}`, formData);
        console.log('Categoria atualizada com sucesso:', response.data);
        handleCancelEdit();
        fetchCategories();
      } catch (error) {
        console.error('Erro ao atualizar a categoria:', error);
      }
    } else {
      try {
        const response = await api.post('/admin/categories', formData);
        console.log('Categoria cadastrada com sucesso:', response.data);
        setFormData({
          categoryName: '',
          description: '',
        });
        fetchCategories();
      } catch (error) {
        console.error('Erro ao cadastrar a categoria:', error);
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Deseja realmente excluir este produto?')) {
      try {
        const response = await api.delete(`/admin/products/${productId}`);
        console.log('Produto excluído com sucesso:', response.data);
        fetchProducts();
      } catch (error) {
        console.error('Erro ao excluir o produto:', error);
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Deseja realmente excluir esta categoria?')) {
      try {
        const response = await api.delete(`/admin/categories/${categoryId}`);
        console.log('Categoria excluída com sucesso:', response.data);
        fetchCategories();
      } catch (error) {
        console.error('Erro ao excluir a categoria:', error);
      }
    }
  };

  return (
    <div className="container">
      <div className="side-menu">
        <h3>Criar Categoria</h3>
        <form onSubmit={handleSubmitCategory}>
          <div className="form-group">
            <label htmlFor="categoryName">Nome da Categoria</label>
            <input
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <button type="submit">{isEditCategoryMode ? 'Editar Categoria' : 'Criar Categoria'}</button>
        </form>
      </div>

      <div className="main-content">
        <h1>{isEditProductMode ? 'Editar Produto' : isEditCategoryMode ? 'Editar Categoria' : 'Cadastrar Produto'}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="productName">Nome do Produto</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Preço</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="categoryId">Categoria</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
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
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            />
          </div>
          <button type="submit">{isEditProductMode ? 'Editar Produto' : 'Cadastrar Produto'}</button>
          {isEditProductMode && (
            <button type="button" onClick={handleCancelEdit}>
              Cancelar Edição
            </button>
          )}
        </form>
      </div>

      <div className="right-menu">
        <h3>Total de produtos cadastrados: {products.length}</h3>
        <h3>Total de categorias cadastradas: {categories.length}</h3>
        <h3>Categorias</h3>
        <ul>
          {categories.map((category) => (
            <li key={category.categoryId}>
              {/* Detalhes das categorias */}
              <button onClick={() => handleEditCategory(category.categoryId)}>Editar</button>
              <button onClick={() => handleDeleteCategory(category.categoryId)}>Excluir</button>
            </li>
          ))}
        </ul>
        <h2 >Produtos Cadastrados</h2>
        <ul>
          {products.map((product) => (
            <li key={product.productId}>
              {/* Detalhes dos produtos, incluindo as imagens */}
              <button onClick={() => handleEditProduct(product.productId)}>Editar</button>
              <button onClick={() => handleDeleteProduct(product.productId)}>Excluir</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreateProduct;
