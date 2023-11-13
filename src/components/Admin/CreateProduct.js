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
  const [quantity, setQuantity] = useState('');
  const [availableImages, setAvailableImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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

// Função para lidar com a pesquisa
const handleSearch = (event) => {
  const query = event.target.value;
  setAvailableImages(setSearchQuery.filter(image => image.name.includes(query)));
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

  

  // Função para lidar com a mudança no campo de preço
const handlePriceChange = (event) => {
  let value = event.target.value;
  value = value.replace(',', '.'); // Substitua vírgulas por pontos
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

  Modal.setAppElement('#root'); // or appElement="#root"

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
          value={formData.productName}
          onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
          required // Torne o preenchimento obrigatório
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
          type="number" // Altere o tipo para number
          id="price"
          value={formData.price}
          onChange={handlePriceChange} // Use a função handlePriceChange
          required // Torne o preenchimento obrigatório
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
            required // Torne o preenchimento obrigatório
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
          <button
            type="submit"
            disabled={
              isLoading && (
                <div className="loading-animation">
                  <p>Cadastrando...</p>
                </div>
              )
            }
          >
            {' '}
            {isLoading ? 'Cadastrando...' : 'Cadastrar Produto'}{' '}
          </button>
        </div>
      </form>

      <Modal isOpen={isImageModalOpen} onRequestClose={handleCloseModal}>
        <button onClick={handlePrev}>Anterior</button>
        <button onClick={handleNext}>Próximo</button>
        <button className="modal-close" onClick={handleCloseModal}>
          Fechar
        </button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch} // Use a função handleSearch
          placeholder="Buscar imagens..."
        />
        <p>Imagens selecionadas: {selectedImages.length}</p>
        {availableImages.slice(0, 44).map(image => ( // Use slice para pegar as primeiras 44 imagens
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

export default CreateProduct;
