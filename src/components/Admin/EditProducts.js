import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import '../../App.css';
import Modal from 'react-modal';
import { useUploadImage, UploadImageProvider } from './UploadImageProvider';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { CarouselContext, CarouselProvider } from '../Admin/CarouselProvider';
import { Card } from 'react-bootstrap';

const EditProduct = () => {
  const { id } = useParams();

  return (
    <UploadImageProvider filesPerPage={44}>
      <EditProductContent productId={id} />
    </UploadImageProvider>
  );
};

const EditProductContent = ({ productId }) => {
  const { products, responsiveSettings, renderArrow } =
    useContext(CarouselContext);
  const ArrowFix = arrowProps => {
    const { carouselState, children, ...restArrowProps } = arrowProps;
    return <span {...restArrowProps}> {children} </span>;
  };

  const [formData, setFormData] = useState({
    productName: '',
    quantity: 0,
    price: '',
    description: '',
    categoryId: '',
    discountPrice: '', // novo atributo
    isOffer: false, // novo estado para controlar se o produto é uma oferta
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
  const [productName, setProductName] = useState('');

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
    if (name === 'isOffer') {
      setFormData({
        ...formData,
        [name]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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

  const handleProductSelection = product => {
    setFormData({
      productName: product.productName,
      quantity: product.quantity,
      price: product.price,
      description: product.description,
      categoryId: product.categoryId,
      discountPrice: product.discountPrice,
      isOffer: product.isOffer,
    });
    setProductName(product.productName);

    // Atualize selectedImages com as image_keys do produto, ou um array vazio se image_keys for undefined
    setSelectedImages(product.image_keys || []);
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

  const handleCloseModal = () => setIsImageModalOpen(false);

  Modal.setAppElement(document.body);

  return (
    <>
      <CarouselProvider>
        <div className="container-edit-products">
          <h1>Editar Produto</h1>
          <Carousel
            responsive={responsiveSettings}
            arrows
            showDots={true} // exibir os pontos de navegação
            infinite={false} // rolagem infinita
            slidesToSlide={5} // Adicionado para avançar/retroceder 5 itens por clique
            customLeftArrow={<ArrowFix>{renderArrow('left')}</ArrowFix>}
            customRightArrow={<ArrowFix>{renderArrow('right')}</ArrowFix>}
            rtl={''} // Adicionado explicitamente para nao dar erro no console
          >
            {products.map((product, index) => (
              <div
                style={{ margin: '0 25px' }}
                key={index}
                onClick={() => handleProductSelection(product)}
              >
                <Card style={{ width: '18rem' }}>
                  <Card.Img
                    variant="top"
                    src={`${process.env.REACT_APP_AWS_S3_URL}${product.image_keys[0]}`} // concatenando a url da imagem do bucket s3 com a key da imagem
                  />
                  <Card.Body>
                    <Card.Title>{product.productName}</Card.Title>
                    <Card.Text>
                      Preço:{' '}
                      {Number(product.price).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </Card.Text>{' '}
                    {/* adicionado para formatar o preço na moeda brasileira */}
                    <Card.Text>Descrição: {product.description}</Card.Text>
                    <Card.Text>
                      Quantidade em Estoque: {product.quantity}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Carousel>
          <form onSubmit={handleSubmit}>
            <label htmlFor="productName">Nome do Produto:</label>
            <input
              type="text"
              name="productName"
              id="productName"
              value={productName}
              onChange={e => setProductName(e.target.value)}
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
            <label>
              Criar Oferta
              <input
                type="checkbox"
                name="isOffer"
                checked={formData.isOffer}
                onChange={handleChange}
              />
            </label>
            {formData.isOffer && (
              <>
                <div>
                  <label htmlFor="discountPrice">Preço de Desconto:</label>
                  <input
                    type="text"
                    name="discountPrice"
                    id="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            <div>
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
            </div>

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
                {selectedImages.map((image, index) => (
                  <div key={index}>
                    <img
                      key={image.key || index}
                      src={image.url}
                      alt="Product"
                    />
                    <button
                      className="button-remove-produdct"
                      onClick={() => handleRemoveImage(image.key)}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CarouselProvider>
    </>
  );
};

export default EditProduct;
