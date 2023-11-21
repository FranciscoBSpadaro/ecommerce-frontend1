import React, { useState, useEffect } from 'react';
import api from '../../api';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { ReactComponent as ArrowRight } from '../../Assets/right-arrow-svgrepo-com.svg';
import { ReactComponent as ArrowLeft } from '../../Assets/left-arrow-svgrepo-com.svg';
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
      top: direction === 'left' ? 'calc(46% - 15px)' : 'calc(50% - 15px)', // ajusta a posição  da seta esquerda e :  direita
      width: 40,
      height: 40,
      cursor: 'pointer',
      [direction]: direction === 'left' ? 0 : 25, // ajusta a posição horizontal da seta esquerda
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
  }

  return (
    <section>
      <h2>Ofertas do Dia</h2>

      <Carousel
        responsive={responsiveSettings}
        arrows
        showDots={true} // exibir os pontos de navegação
        infinite={false} // rolagem infinita
        slidesToSlide={5} // Adicionado para avançar/retroceder 5 itens por clique
        customLeftArrow={renderArrow('left')}
        customRightArrow={renderArrow('right')}
        rtl={''} // Adicionado explicitamente para nao dar erro no console
      >
        {products.map((product, index) => (
          <Card style={{ width: '18rem' }} key={index}>
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
