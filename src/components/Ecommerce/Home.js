import React, { useContext } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { CarouselContext } from '../Admin/CarouselProvider';
import { Card } from 'react-bootstrap';
import Footer from '../../components/Common/Footer';

const Home = () => {
  const { products, responsiveSettings, renderArrow } =
    useContext(CarouselContext);
  // componente criado para corrigir o erro 'Warning: React does not recognize the `carouselState` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `carouselstate` instead. If you accidentally passed it from a parent component, remove it from the DOM element.'
  const ArrowFix = arrowProps => {
    const { carouselState, children, ...restArrowProps } = arrowProps;
    return <span {...restArrowProps}> {children} </span>;
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
        customLeftArrow={<ArrowFix>{renderArrow('left')}</ArrowFix>}
        customRightArrow={<ArrowFix>{renderArrow('right')}</ArrowFix>}
        rtl={''} // Adicionado explicitamente para nao dar erro no console
      >
        {products.map((product, index) => (
          <div style={{ margin: '0 25px' }} key={index}>
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
                <Card.Text>Quantidade em Estoque: {product.quantity}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Carousel>
      <Footer />
    </section>
  );
};

export default Home;
