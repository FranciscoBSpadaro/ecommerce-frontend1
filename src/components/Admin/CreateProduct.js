import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../../App.css';
import Modal from 'react-modal';
import { useUploadImage, UploadImageProvider } from './UploadImageProvider';

export const CreateProduct = () => {
  return (
    <UploadImageProvider filesPerPage={44}>
      <CreateProductContent />
    </UploadImageProvider>
  );
};

const CreateProductContent = () => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: 0,
    price: '',
    description: '',
    categoryId: '',
    model: '',
    brand: '',
  });

  const {
    searchQuery,
    page,
    hasMore,
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
  const [imageSelectionError, setImageSelectionError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        setErrorMessage(
          `Ocorreu um erro: ${
            error.response.data.message || error.response.data.error
          }`,
        );
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeProduct = e => {
    const { name, value } = e.target;

    if (name === 'productName' && value.length > 50) {
      setErrorMessage(prevErrors => ({
        ...prevErrors,
        productName: 'O nome do produto deve ter no máximo 50 caracteres.',
      }));
      setTimeout(() => {
        setErrorMessage(prevErrors => ({ ...prevErrors, productName: '' }));
      }, 5000);
      return;
    } else {
      setErrorMessage(prevErrors => ({ ...prevErrors, productName: '' }));
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleQuantityChange = e => {
    const value = parseInt(e.target.value);

    if (value < 0) {
      return;
    } else if (value > 999999999) {
      setErrorMessage(prevErrors => ({
        ...prevErrors,
        quantity: 'A quantidade deve ter no máximo 9 dígitos.',
      }));
      setTimeout(() => {
        setErrorMessage(prevErrors => ({ ...prevErrors, quantity: '' }));
      }, 5000);
      return;
    }

    setFormData({
      ...formData,
      quantity: value,
    });
  };

  const handlePriceChange = event => {
    let value = event.target.value;

    // Permitir que o valor do campo seja vazio
    if (value === '') {
      setFormData({
        ...formData,
        price: value,
      });
      return;
    }

    // Permitir apenas números, pontos e vírgulas
    const regex = /^[0-9.,]+$/;
    if (!regex.test(value)) {
      return;
    }
    // Verificar se o valor tem mais de uma vírgula
    const commaCount = (value.match(/,/g) || []).length;
    if (commaCount > 1) {
      // Exibir uma mensagem de erro
      setErrorMessage(
        'Atenção, respeite as casas decimais. Use apenas 1 vírgula depois de colocar pontos.',
      );
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
      return;
    }

    // Verificar se o número total de dígitos excede 10 e se os dígitos após a vírgula excedem 2
    const digitCount = value.replace(/[^0-9]/g, '').length;
    const decimalCount = value.split(',')[1]?.length || 0;
    if (digitCount > 10 || decimalCount > 2) {
      // Exibir uma mensagem de erro
      setErrorMessage(
        'Atenção, a quantidade total de digitos deve ser 12,  no padrão decimal 99.999.999,99 ou 10 digitos no formato 9999999999',
      );
      setTimeout(() => {
        setErrorMessage('');
      }, 6000);
      return;
    }

    // Verificar se o valor tem mais de duas casas decimais
    const parts = value.split(',');
    if (parts.length > 1 && parts[1].length > 2) {
      // Remover os dígitos extras
      value = parts[0] + ',' + parts[1].substring(0, 2);

      // Exibir uma mensagem de erro
      setErrorMessage(
        'Atenção, respeite as casas decimais. Use ponto antes de vírgulas.',
      );
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }

    setFormData({
      ...formData,
      price: value,
    });
  };

  const handleChangeDescription = e => {
    const { name, value } = e.target;
    if (name === 'description' && value.length > 55) {
      setErrorMessage(prevErrors => ({
        ...prevErrors,
        description: 'A descrição curta deve ter no máximo 55 caracteres.',
      }));
      setTimeout(() => {
        setErrorMessage(prevErrors => ({ ...prevErrors, description: '' }));
      }, 5000);
      return;
    } else {
      setErrorMessage(prevErrors => ({ ...prevErrors, description: '' }));
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOpenModal = () => {
    setIsImageModalOpen(true);
  };

  const handleImageSelection = image => {
    if (selectedImages.map(img => img.key).includes(image.key)) {
      setSelectedImages(selectedImages.filter(img => img.key !== image.key));
    } else {
      if (selectedImages.length >= 5) {
        setImageSelectionError('O máximo de imagens por produto é 5.');
        setTimeout(() => {
          setImageSelectionError('');
        }, 5000);
        return;
      }
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handleRemoveImage = key => {
    setSelectedImages(selectedImages.filter(image => image.key !== key));
  };

  const handleCloseModal = () => {
    setIsImageModalOpen(false);
  };

  const formatPrice = price => {
    let parts = price.split('.');
    if (parts.length > 2) {
      let lastPart = parts.pop();
      let formattedPrice = parts.join('') + '.' + lastPart;
      return formattedPrice;
    } else {
      price = price.replace(',', '.');
      const digitCount = price.replace(/[^0-9]/g, '').length;
      if (digitCount === 10) {
        price = price.slice(0, -2) + '.' + price.slice(-2);
      }
      return price;
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const price = formatPrice(formData.price);

    const productData = {
      ...formData,
      price,
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
      setErrorMessage(error.response.data.message || error.response.data.error);
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };

  Modal.setAppElement('#root');

  return (
    <div className="container-create-products">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <h1>Cadastrar Produto</h1>
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          {typeof errorMessage === 'string' ? (
            <p style={{ color: 'red' }}>{errorMessage}</p>
          ) : (
            Object.values(errorMessage).filter(Boolean).join(' ') && (
              <p style={{ color: 'red' }}>
                {Object.values(errorMessage).filter(Boolean).join(' ')}
              </p>
            )
          )}

          <label htmlFor="productName">Nome do Produto</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChangeProduct}
            required
          />
          <label htmlFor="model">Modelo</label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          />

          <label htmlFor="brand">Marca</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />

          <label htmlFor="quantity">Quantidade</label>
          <input
            type="number"
            id="quantity"
            value={formData.quantity}
            onChange={handleQuantityChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Preço</label>
          <input
            type="text"
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
            onChange={handleChangeDescription}
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
        <button className="button" onClick={handleNextPage} disabled={!hasMore}>
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
