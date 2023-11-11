import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api';
import '../../App.css';

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
        const response = await api.get('/admin/uploads', {
          params: { limit: 20, page: currentPage, search: searchQuery },
        });
        setAvailableImages(response.data);
      } catch (error) {
        console.error('Erro ao buscar imagens:', error);
      }
    };

    fetchAvailableImages();
  }, [currentPage, searchQuery]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handleImageSelection = useCallback(
    (image) => {
      if (selectedImages.length < 5 && !selectedImages.includes(image.key)) {
        setSelectedImages((prevSelectedImages) => [
          ...prevSelectedImages,
          image,
        ]);
      }
    },
    [selectedImages]
  );

  const handleRemoveImage = useCallback(
    (imageKey) => {
      setSelectedImages((prevSelectedImages) =>
        prevSelectedImages.filter((image) => image.key !== imageKey)
      );
    },
    []
  );

  const handleImageModalToggle = () => {
    setIsImageModalOpen(!isImageModalOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset page when the search query changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Mapeie apenas as chaves das imagens
    const imageKeys = selectedImages.map((image) => image);
  
    const productData = {
      ...formData,
      image_keys: imageKeys,
    };
  
    try {
      const response = await api.post('/admin/products', productData);
      console.log('Produto cadastrado com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao cadastrar o produto:', error);
    }
  };
  

  return (
    <div>
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
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="images">Imagens do Produto</label>
          <button type="button" onClick={handleImageModalToggle}>
            Incluir Imagens
          </button>
          <button type="submit">Cadastrar Produto</button>
          {!!selectedImages.length && (
            <div>
              <p>Imagens selecionadas:</p>
              <ul>
                {selectedImages.map((image) => (
                  <li key={image}>
                    {image}{' '}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image)}
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </form>

      {isImageModalOpen && (
        <div className="container">
          <div>
            <label htmlFor="search">Buscar Imagens: </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="image-list">
            {availableImages.map((image) => (
              <div key={image.key}>
                <img
                  src={image.url}
                  alt={`Imagem ${image.key}`}
                  onClick={() => handleImageSelection(image.key)}
                />
              </div>
            ))}
          </div>
          <div className="pagination">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span>{currentPage}</span>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Próxima
            </button>
          </div>
          <button type="button" onClick={handleImageModalToggle}>
            Fechar
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateProduct;
