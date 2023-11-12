import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../../App.css';
import Modal from 'react-modal';

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    description: '',
    categoryId: '',
  });

  const [categories, setCategories] = useState([]);
  const [availableImages, setAvailableImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    const fetchAvailableImages = async () => {
      try {
        const response = await api.get('/admin/uploads');
        setAvailableImages(response.data);
      } catch (error) {
        console.error('Erro ao buscar as imagens disponíveis:', error);
      }
    };

    fetchAvailableImages();
  }, []);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenModal = () => {
    setIsImageModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsImageModalOpen(false);
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSearch = event => {
    setSearchQuery(event.target.value);
  };

  const handleRemoveImage = key => {
    setSelectedImages(selectedImages.filter(image => image.key !== key));
  };

  const handleImageSelection = (image) => {
    setSelectedImages([...selectedImages, image]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const productData = {
      ...formData,
      image_keys: selectedImages.map(image => image.key),
    };
  
    try {
      const response = await api.post('/admin/products', productData);
      console.log('Produto cadastrado com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao cadastrar o produto:', error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <h1>Cadastrar Produto</h1>
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
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="images">Imagens do Produto</label>
          <button type="button" onClick={handleOpenModal}>
            Incluir Imagens
          </button>
          <button type="submit">Cadastrar Produto</button>
        </div>
      </form>

      <Modal isOpen={isImageModalOpen} onRequestClose={handleCloseModal}>
        <button onClick={handlePrev}>Anterior</button>
        <button onClick={handleNext}>Próximo</button>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Buscar imagens..."
        />
        {availableImages.map(image => (
          <img
            className="image-in-modal"
            src={image.url}
            alt={image.name}
            key={image.key}
            onClick={() => handleImageSelection(image)}
          />
        ))}
        <button onClick={handleCloseModal}>Fechar</button>
      </Modal>

      {!!selectedImages.length && (
        <div className="product-images">
          <h2>Imagens selecionadas:</h2>
          {selectedImages.map(image => (
            <div key={image.key}>
              <img
               className="selected-image"
               src={image.url}
               alt={image.key} />
              <button onClick={() => handleRemoveImage(image.key)}>
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreateProduct;
