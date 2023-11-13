import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../../App.css';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ReactComponent as ArrowRight } from '../../Assets/right-arrow.svg';
import { ReactComponent as ArrowLeft } from '../../Assets/left-arrow.svg';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/public/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
      }
    };

    fetchProducts();
  }, []);

  const arrowStyles = {
    position: 'absolute',
    zIndex: 2,
    top: 'calc(50% - 15px)',
    width: 30,
    height: 30,
    cursor: 'pointer',
  };

  const ArrowPrev = (onClickHandler, hasPrev, label) => 
    hasPrev && (
      <ArrowLeft onClick={onClickHandler} title={label} style={{ ...arrowStyles, left: 25 }} />
    );

  const ArrowNext = (onClickHandler, hasNext, label) => 
    hasNext && (
      <ArrowRight onClick={onClickHandler} title={label} style={{ ...arrowStyles, right: 25 }} />
    );

  return (
    <div className="container">
      <h2>Ofertas Do Dia</h2>
      <Carousel 
        showThumbs={false} 
        showStatus={false} 
        showIndicators={false} 
        infiniteLoop 
        useKeyboardArrows
        renderArrowPrev={ArrowPrev}
        renderArrowNext={ArrowNext}
      >
        {products.map((product, index) => (
          <div key={index}>
            <p>Nome: {product.productName}</p>
            <p>Preço: R$ {product.price}</p>
            {product.image_keys && product.image_keys.length > 0 && (
              <img
                src={`${process.env.REACT_APP_AWS_S3_URL}${product.image_keys[0]}`}
                alt={`Imagem de ${product.productName}`}
                style={{ width: '200px', height: '200px' }}
              />
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Home;