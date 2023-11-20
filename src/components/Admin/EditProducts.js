import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import '../../App.css';
import Modal from 'react-modal';
import { useUploadImage, UploadImageProvider } from './UploadImageProvider';

const EditProduct = () => {
  const { id } = useParams();

  return (
    <UploadImageProvider filesPerPage={44}>
      <EditProductContent productId={id} />
    </UploadImageProvider>
  );
};

const EditProductContent = ({ productId }) => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: 0,
    price: '',
    description: '',
    categoryId: '',
  });

  const {
    searchQuery,
    page,
    hasMore,
    searchPerformed,
    uploadedFiles,
    handleImageSelection,
    handleRemoveImage,
    handleNextPage,
    handlePreviousPage,
    handleFirstPage,
    handleSearchSubmit,
    handleSearchChange,
  } = useUploadImage();

  const [categories, setCategories] = useState([]);
  const [selectedImages] = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [imageSelectionError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        setErrorMessage(
          error.response?.data.message ||
            error.response?.data.error ||
            'Ocorreu um erro',
        );
        setTimeout(() => setErrorMessage(''), 5000);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get('/public/products');
        const productData = response.data;

        setFormData({
          productName: productData.productName,
          quantity: productData.quantity,
          price: productData.price.toString(), // Convert to string for controlled input
          description: productData.description,
          categoryId: productData.categoryId,
        });

        // Set selected images if needed
        // setSelectedImages(productData.images);
      } catch (error) {
        setErrorMessage(
          error.response?.data.message ||
            error.response?.data.error ||
            'Ocorreu um erro',
        );
        setTimeout(() => setErrorMessage(''), 5000);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  

  const handleSubmit = async event => {
    event.preventDefault();

    // Format price if needed
    // const price = formatPrice(formData.price);

    const productData = {
      ...formData,
      // price,
      image_keys: selectedImages.map(image => image.key),
    };

    try {
      const response = await api.put(
        `/admin/products/${productId}`,
        productData,
      );

      if (response.status === 200) {
        setSuccessMessage('Produto atualizado com sucesso');
        setTimeout(() => setSuccessMessage(''), 5000);
        // Redirect to product details or product list
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data.message ||
          error.response?.data.error ||
          'Ocorreu um erro',
      );
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleCloseModal = () => setIsImageModalOpen(false);

  return (
    <>
      <div className="container-edit-products">
        <h1>Editar Produto</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="productName">Nome do Produto:</label>
          <input
            type="text"
            name="productName"
            id="productName"
            value={formData.productName}
            onChange={handleChange}
            required
          />

          <label htmlFor="quantity">Quantidade:</label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <label htmlFor="price">Preço:</label>
          <input
            type="text"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Descrição:</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <label htmlFor="categoryId">Categoria:</label>
          <select
            name="categoryId"
            id="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma opção</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <label>
            É oferta?
            <input
              type="checkbox"
              name="isOffer"
              checked={formData.isOffer}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Atualizar Produto</button>
        </form>

        <button onClick={() => setIsImageModalOpen(true)}>
          Selecionar Imagens
        </button>

        {/* Render a success message if the product was updated successfully */}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        {/* Render an error message if an error occurs */}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        {/* Render a modal to select images */}
        <Modal isOpen={isImageModalOpen} onRequestClose={handleCloseModal}>
          {imageSelectionError && (
            <p style={{ color: 'red' }}>{imageSelectionError}</p>
          )}
          <button
            className="button"
            onClick={handleFirstPage}
            disabled={page === 1 && !searchPerformed}
          >
            Inicio
          </button>
          <button
            className="button"
            onClick={handlePreviousPage}
            disabled={page === 1}
          >
            Voltar
          </button>
          <button
            className="button"
            onClick={handleNextPage}
            disabled={!hasMore}
          >
            Avançar
          </button>
          <button className="modal-close" onClick={handleCloseModal}>
            Fechar
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
            placeholder="Buscar imagens: Digite o nome da imagem e pressione enter... 🔍"
          />
          <p>Página {page}</p>
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

        {/* Render selected images */}
        {selectedImages.length > 0 && (
          <>
            <h2 className="center-title">Imagens selecionadas:</h2>
            <div className="product-images">
              {selectedImages.map(image => (
                <div key={image.key}>
                  <img
                    className="selected-image"
                    src={image.url}
                    alt={image.key}
                  />
                  <button onClick={() => handleRemoveImage(image)}>
                    Remover imagem
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EditProduct;
