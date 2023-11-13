import React, { useState, useEffect } from 'react';
import api from '../../api';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { ReactComponent as ArrowRight } from '../../Assets/right-arrow.svg';
import { ReactComponent as ArrowLeft } from '../../Assets/left-arrow.svg';

const responsiveSettings = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
    draggable: false
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    draggable: false
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    draggable: true
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    draggable: true
  }
};

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/public/products');
        setProducts(data);
      } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
      }
    };

    fetchProducts();
  }, []);

  const renderArrow = (direction, onClickHandler, isDisabled = false) => {
    const arrowStyle = {
      position: 'absolute',
      zIndex: 2,
      top: 'calc(50% - 15px)',
      width: 30,
      height: 30,
      cursor: 'pointer',
      [direction]: 25,
      opacity: isDisabled ? 0.5 : 1,
      pointerEvents: isDisabled ? 'none' : 'auto'
    };

    const ArrowComponent = direction === 'left' ? ArrowLeft : ArrowRight;
    const label = direction === 'left' ? 'Anterior' : 'Próximo';

    return (
      <ArrowComponent
        onClick={onClickHandler}
        title={label}
        style={arrowStyle}
      />
    );
  };

  return (
    <section>
      <h2>Ofertas do Dia</h2>
      {products && products.length > 0 ? (
        <Carousel
          responsive={responsiveSettings}
          arrows
          showDots={true}
          infinite={true}
          renderArrowPrev={(onClickHandler, hasPrev) => renderArrow('left', onClickHandler, !hasPrev)}
          renderArrowNext={(onClickHandler, hasNext) => renderArrow('right', onClickHandler, !hasNext)}
        >
          {products.map(({ id, productName, price, image_keys }) => (
            <div key={id}>
              <p>Nome: {productName}</p>
              <p>Preço: R$ {price.toFixed(2)}</p>
              {image_keys && image_keys.length > 0 && (
                <img
                  src={`${process.env.REACT_APP_AWS_S3_URL}${image_keys[0]}`}
                  alt={`Imagem de ${productName}`}
                  style={{ width: '200px', height: '200px' }}
                />
              )}
            </div>
          ))}
        </Carousel>
      ) : (
        <p>Carregando ofertas...</p>
      )}
    </section>
  );
};

export default Home;
