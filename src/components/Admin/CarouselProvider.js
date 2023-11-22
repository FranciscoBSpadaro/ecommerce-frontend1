import React, { useState, useEffect, createContext } from 'react';
import api from '../../api';
import { ReactComponent as ArrowRight } from '../../Assets/right-arrow-svgrepo-com.svg';
import { ReactComponent as ArrowLeft } from '../../Assets/left-arrow-svgrepo-com.svg';

export const CarouselContext = createContext();

export const CarouselProvider = ({ children }) => {
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
    
  const responsiveSettings = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
      draggable: false,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      draggable: false,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      draggable: true,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      draggable: true,
    },
  };

  const renderArrow = (direction, onClickHandler, isDisabled = false) => {
    const arrowStyle = {
      position: 'absolute',
      zIndex: 2,
      top: direction === 'left' ? 'calc(50% - 15px)' : 'calc(50% - 15px)',
      width: 40,
      height: 40,
      cursor: 'pointer',
      [direction]: direction === 'left' ? 0 : 25,
      opacity: isDisabled ? 0.5 : 1,
      pointerEvents: isDisabled ? 'none' : 'auto',
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
    <CarouselContext.Provider value={{ products, setProducts, responsiveSettings, renderArrow }}>
      {children}
    </CarouselContext.Provider>
  );
};