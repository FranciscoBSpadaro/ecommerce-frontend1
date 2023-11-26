import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../../App.css';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUploadImage, UploadImageProvider } from './UploadImageProvider';
import {
  useHandleChangeProduct,
  handleChangeBrand,
  handleChangeModel,
  handleQuantityChange,
  handlePriceChange,
  handleChangeDescription,
} from './handleChangesCreateProduct';

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        const errorMessage = `Ocorreu um erro: ${
          error.response.data.message || error.response.data.error
        }`;
        toast.error(errorMessage);
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

  const handleProductChange = useHandleChangeProduct(formData, setFormData);

  const handleBrandChange = e => {
    handleChangeBrand(e, formData, setFormData);
  };

  const handleModelChange = e => {
    handleChangeModel(e, formData, setFormData);
  };

  const handleChangeQuantity = e => {
    handleQuantityChange(e, formData, setFormData);
  };

  const handleChangePrice = e => {
    handlePriceChange(e, formData, setFormData);
  };

  const handleDescriptionChange = e => {
    handleChangeDescription(e, formData, setFormData);
  };

  const handleOpenModal = () => {
    setIsImageModalOpen(true);
  };

  const handleImageSelection = image => {
    if (selectedImages.map(img => img.key).includes(image.key)) {
      setSelectedImages(selectedImages.filter(img => img.key !== image.key));
    } else {
      if (selectedImages.length >= 5) {
        const errorMessage = 'O máximo de imagens por produto é 5.';

        // Verificar se o toast com o ID errorMessage já está ativo
        if (!toast.isActive(errorMessage)) {
          toast.error(errorMessage, { toastId: errorMessage });
        }

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
    // Remover pontos usados como separadores de milhar e substituir a vírgula por um ponto
    price = price.replace(/\./g, '').replace(',', '.');

    // Se o preço for um número de 10 dígitos sem um ponto decimal, adicione um ponto antes dos últimos dois dígitos
    if (/^\d{10}$/.test(price)) {
      price = price.slice(0, -2) + '.' + price.slice(-2);
    }

    // Converter o preço para um número e formatá-lo com duas casas decimais
    price = parseFloat(price).toFixed(2);

    return price;
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const price = formatPrice(formData.price);

    if (!price) {
      return;
    }

    const productData = {
      ...formData,
      price,
      image_keys: selectedImages.map(image => image.key),
    };

    try {
      const response = await api.post('/admin/products', productData, {});

      if (response.status === 201) {
        toast.success('Produto cadastrado com sucesso!');
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    } catch (error) {
      toast.error(error.response.data.message || error.response.data.error);
    }
  };

  Modal.setAppElement('#root');

  return (
    <div className="container-create-products" style={{ position: 'relative' }}>
      <ToastContainer limit={5} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <h1 className='h1-a'>Cadastrar Produto</h1>
          <label htmlFor="productName">Nome do Produto</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleProductChange}
            required
          />
          <label htmlFor="brand">Marca</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleBrandChange}
            required
          />

          <label htmlFor="model">Modelo</label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleModelChange}
            required
          />

          <label htmlFor="quantity">Quantidade</label>
          <input
            type="number"
            id="quantity"
            value={formData.quantity}
            onChange={handleChangeQuantity}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Preço</label>
          <input
            type="text"
            id="price"
            value={formData.price}
            onChange={handleChangePrice}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleDescriptionChange}
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
        <ToastContainer limit={5} />
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
