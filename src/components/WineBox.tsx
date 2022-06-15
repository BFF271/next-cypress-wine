import { AppContext } from 'contexts/AppProvider';
import { ProductCart } from 'contexts/types';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { CardProduct, BackContainer, Body, Container, Footer, Header, NoProducts } from 'styles/WineBox';
import { ArrowBack, Close } from './icons';

const Cart = () => {
  const { setViewCart, removeFromWineBox } = useContext(AppContext);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const removeItem = (id: number, price: number) => {
    const updateWinebox = cart.filter((product: ProductCart) => product.id !== id);
    setCart(updateWinebox);
    const convertNoBugTotalPrice = Number((total - price).toFixed(2))
    setTotal(convertNoBugTotalPrice);
    removeFromWineBox(updateWinebox, convertNoBugTotalPrice);
  };

  useEffect(() => {
    const data = localStorage.getItem('winebox');

    if (data) {
      const { items, totalPrice } = JSON.parse(data);
      setCart(items);
      setTotal(totalPrice);
    }
  }, []);

  if (cart.length === 0) {
    return (
      <>
        <BackContainer onClick={ () => setViewCart(false) } />

        <Container data-cy="winebox-container">
          <Header data-cy="winebox-header">
            <span  onClick={ () => setViewCart(false) } data-cy="winebox-btn-back">
              <ArrowBack />
              <span>WineBox ({ cart.length })</span>
            </span>
          </Header>

          <NoProducts data-cy="winebox-body">
            <span>
              Você ainda não escolheu seus produtos
            </span>
          </NoProducts>
        </Container>
      </>
    );
  };

  return (
    <>
      <BackContainer onClick={ () => setViewCart(false) } />

      <Container>
        <Header data-cy="winebox-header">
          <span  onClick={ () => setViewCart(false) } data-cy="winebox-btn-back">
            <ArrowBack />
            <span>WineBox ({ cart.length })</span>
          </span>
        </Header>

        <Body data-cy="winebox-body">
          {
            cart.map((product: ProductCart, i: number) => (
              <CardProduct key={ i } data-cy={`winebox-card-product-${i}`}>
                <div>
                  <Image
                    src={ product.image }
                    alt="Landscape picture"
                    width="100%" height="100%" layout="responsive" objectFit="contain"
                  />
                </div> 
                <div>
                  <h3>{ product.name }</h3>
                  <span>
                    <h4>{ `R$ ${product.priceMember.toFixed(2).replace(/\./, ',')} x  ${ product.quantity }` }</h4>
                    <h2>{ `R$ ${
                      (product.priceMember*product.quantity).toFixed(2).replace(/\./, ',')
                    }` }</h2>
                  </span>
                  <button onClick={ () => {
                    const finalPrice = Number((product.priceMember*product.quantity).toFixed(2));
                    removeItem(product.id, finalPrice);
                  } }>
                    <Close />
                  </button>
                </div>
              </CardProduct>
            ))
          }
        </Body>

        <Footer data-cy="winebox-footer">
          <div>
            <span>Total</span>
            <span>
              R$ { total.toFixed(2).replace(/\./, ',') }
            </span>
          </div>

          <button>
            Finalizar pedido
          </button>
        </Footer>
      </Container>
    </>
  );
};

export default Cart;
