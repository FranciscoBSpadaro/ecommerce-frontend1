import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../../App.css';
import Modal from 'react-modal';
import { useUploadImage, UploadImageProvider } from './UploadImageProvider';

export const CreateProduct = () => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: 0,
    price: '',
    description: '',
    categoryId: '',
  });

  const [errors, setErrors] = useState({
    productName: '',
    price: '',
    description: '',
    quantity: '',
  });

  const {
    searchQuery,
    page,
    searchPerformed,
    uploadedFiles,
    handleNextPage,
    handlePreviousPage,
    handleFirstPage,
    handleSearchSubmit,
    handleSearchChange,
  } = useUploadImage();

  const [categories, setCategories] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    const { name, value } = e.target;

    // Limiting the fields
    if (name === 'productName' && value.length > 50) {
      setErrors(prevErrors => ({
        ...prevErrors,
        productName: 'O nome do produto deve ter no máximo 50 caracteres.',
      }));
      return;
    } else {
      setErrors(prevErrors => ({ ...prevErrors, productName: '' }));
    }
    if (name === 'price' && value.length > 15) {
      setErrors(prevErrors => ({
        ...prevErrors,
        price: 'O preço deve ter no máximo 15 caracteres.',
      }));
      return;
    } else {
      setErrors(prevErrors => ({ ...prevErrors, price: '' }));
    }
    if (name === 'description' && value.length > 100) {
      setErrors(prevErrors => ({
        ...prevErrors,
        description: 'A descrição deve ter no máximo 100 caracteres.',
      }));
      return;
    } else {
      setErrors(prevErrors => ({ ...prevErrors, description: '' }));
    }

    setFormData({
      ...formData,
      [name]: value,
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

  const handleQuantityChange = e => {
    const value = parseInt(e.target.value);

    if (value < 0) {
      setErrors(prevErrors => ({
        ...prevErrors,
        quantity: 'A quantidade não pode ser negativa.',
      }));
      return;
    } else if (value > 999999999999999) {
      setErrors(prevErrors => ({
        ...prevErrors,
        quantity: 'A quantidade deve ter no máximo 15 dígitos.',
      }));
      return;
    } else {
      setErrors(prevErrors => ({ ...prevErrors, quantity: '' }));
    }

    setFormData({
      ...formData,
      quantity: value,
    });
  };

  const handlePriceChange = event => {
    let value = event.target.value;
    value = value.replace(',', '.');
    if (value < 0) {
      setErrors(prevErrors => ({
        ...prevErrors,
        quantity: 'A quantidade não pode ser negativa.',
      }));
      return;
    } else if (value > 999999999999999) {
      setErrors(prevErrors => ({
        ...prevErrors,
        quantity: 'A quantidade deve ter no máximo 15 dígitos.',
      }));
      return;
    } else {
      setErrors(prevErrors => ({ ...prevErrors, quantity: '' }));
    }
    setFormData({ ...formData, price: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const productData = {
      ...formData,
      image_keys: selectedImages.map(image => image.key),
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
  };

  Modal.setAppElement('#root');

  return (
    <div className="container-create-products">
      <form onSubmit={handleSubmit}>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {errors.productName && (
          <p style={{ color: 'red' }}>{errors.productName}</p>
        )}
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
          {errors.quantity && <p style={{ color: 'red' }}>{errors.quantity}</p>}
          <label htmlFor="quantity">Quantidade</label>
          <input
            type="number"
            id="quantity"
            value={formData.quantity}
            onChange={handleQuantityChange}
            required
          />
        </div>
        {errors.price && <p style={{ color: 'red' }}>{errors.price}</p>}
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
          {errors.description && (
            <p style={{ color: 'red' }}>{errors.description}</p>
          )}
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
          <button className="button" type="button" onClick={handleOpenModal}>
            Incluir Imagens
          </button>
          <button
            className="button"
            type="submit"
            disabled={
              !formData.productName ||
              !formData.categoryId ||
              !formData.quantity ||
              !formData.price
            }
          >
            Cadastrar Produto
          </button>
        </div>
      </form>
      <UploadImageProvider filesPerPage={50}>
        <Modal isOpen={isImageModalOpen} onRequestClose={handleCloseModal}>
          <button
            className="button"
            onClick={handleFirstPage}
            disabled={page === 1 && !searchPerformed}
          >
            Inicio
          </button>
          <p>Página {page}</p>
          <button className="" onClick={handlePreviousPage}>
            Anterior
          </button>
          <button className="" onClick={handleNextPage}>
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
      </UploadImageProvider>
      <h2 className="center-title">Imagens selecionadas:</h2>
      {!!selectedImages.length && (
        <div className="product-images">
          {selectedImages.map(image => (
            <div key={image.key}>
              <img className="selected-image" src={image.url} alt={image.key} />
              <button
                className="button-remove-produdct"
                onClick={() => handleRemoveImage(image.key)}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
