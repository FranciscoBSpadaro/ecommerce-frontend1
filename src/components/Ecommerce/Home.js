import React, { useState, useEffect } from 'react';
import api from '../../api';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { ReactComponent as ArrowRight } from '../../Assets/right-arrow.svg';
import { ReactComponent as ArrowLeft } from '../../Assets/left-arrow.svg';
import { Card } from 'react-bootstrap';
import Footer from '../../components/Common/Footer';

const responsiveSettings = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
    draggable: false,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    draggable: false, // Adicionado para não permitir arrastar o carrossel
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
      pointerEvents: isDisabled ? 'none' : 'auto', // Adicionado para não permitir clicar no botão quando estiver desabilitado
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

      <Carousel
        responsive={responsiveSettings}
        arrows
        showDots={true} // exibir os pontos de navegação
        infinite={false} // rolagem infinita
        slidesToSlide={5} // Adicionado para avançar/retroceder 5 itens por clique
        renderArrowPrev={(onClickHandler, hasPrev) =>
          renderArrow('left', onClickHandler, !hasPrev)
        }
        renderArrowNext={(onClickHandler, hasNext) =>
          renderArrow('right', onClickHandler, !hasNext) // Adicionado para desabilitar o botão quando não houver mais itens para avançar
        }
      >
        {products.map((product, index) => (
          <Card style={{ width: '18rem' }} key={index}>
            <Card.Img
              variant="top"
              src={`${process.env.REACT_APP_AWS_S3_URL}${product.image_keys[0]}`} // concatenando a url da imagem do bucket s3 com a key da imagem 
            />
            <Card.Body>
              <Card.Title>{product.productName}</Card.Title>
              <Card.Text>Preço: {Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Card.Text>  { /* adicionado para formatar o preço na moeda brasileira */ }
              <Card.Text>Descrição: {product.description}</Card.Text>
              <Card.Text>Quantidade em Estoque: {product.quantity}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </Carousel>
      <Footer />
    </section>
  );
};

export default Home;
