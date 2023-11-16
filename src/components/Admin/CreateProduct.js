import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../../App.css';
import Modal from 'react-modal';
import { useUploadImage } from './UploadImageProvider';

export const CreateProduct = () => {
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    description: '',
    categoryId: '',
  });
  const {
    searchQuery,
    page,
    searchPerformed,
    fetchUploadedFiles,
    uploadedFiles,
    handleNextPage,
    handlePreviousPage,
    handleFirstPage,
    handleSearchSubmit,
    handleSearchChange,
  } = useUploadImage();

  useEffect(() => {
    fetchUploadedFiles(page);
  }, [page, fetchUploadedFiles]);


  const [categories, setCategories] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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


  const handleRemoveImage = key => {
    setSelectedImages(selectedImages.filter(image => image.key !== key));
  };

  const handleImageSelection = image => {
    if (selectedImages.map(img => img.key).includes(image.key)) {
      setSelectedImages(selectedImages.filter(img => img.key !== image.key));
    } else {
      if (selectedImages.length >= 5) {
        setErrorMessage('O máximo de imagens por produto é 5.');
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
        return;
      }
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handlePriceChange = event => {
    let value = event.target.value;
    value = value.replace(',', '.');
    setFormData({ ...formData, price: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const productData = {
      ...formData,
      image_keys: selectedImages.map(image => image.key),
      quantity,
    };

    try {
      const response = await api.post('/admin/products', productData, {});

      if (response.status === 201) {
        setSuccessMessage('Produto cadastrado com sucesso');
        setTimeout(() => {
          setSuccessMessage('');
          window.location.reload();
        }, 5000);
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }

    setIsLoading(false);
  };

  Modal.setAppElement('#root');

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <div className="form-group">
          <h1>Cadastrar Produto</h1>
          <label htmlFor="productName">Nome do Produto</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
          />
          <label htmlFor="quantity">Quantidade</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Preço</label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={handlePriceChange}
            required
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
            required
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
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Cadastrando...' : 'Cadastrar Produto'}
          </button>
        </div>
      </form>

      <Modal isOpen={isImageModalOpen} onRequestClose={handleCloseModal}>
        <button onClick={handleFirstPage} disabled={page === 1 && !searchPerformed}>
          Inicio
        </button>
        <p>Página {page}</p>
        <button onClick={handlePreviousPage}>
          Anterior
        </button>
        <button onClick={handleNextPage}>
          Próximo
          </button>
        <button className="modal-close" onClick={handleCloseModal}>
          Fechar
        </button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchSubmit}
          placeholder="Buscar imagens: Digite o nome da imagem e pressione enter... 🔍"
        />
        <p>Imagens selecionadas: {selectedImages.length}</p>
        {Array.isArray(uploadedFiles) &&
          uploadedFiles.map(image => (
            <img
              className={`image-in-modal ${
                selectedImages.map(img => img.key).includes(image.key)
                  ? 'selected-image-modal'
                  : ''
              }`}
              key={image.key}
              src={image.url}
              alt={image.name}
              onClick={() => handleImageSelection(image)}
            />
          ))}
      </Modal>

      {!!selectedImages.length && (
        <div className="product-images">
          <h2>Imagens selecionadas:</h2>
          {selectedImages.map(image => (
            <div key={image.key}>
              <img className="selected-image" src={image.url} alt={image.key} />
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