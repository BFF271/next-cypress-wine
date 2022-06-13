import type { NextPage } from 'next';
import Header from 'components/layout/Header';
import { Main, SectionCenter } from 'styles/Containers';
import ProductInformation from 'components/ProductInformation';
import { BtnGoBack } from 'styles/pages/product/Informations';
import Router from 'next/router';
import Cart from 'components/Cart';
import { useContext } from 'react';
import { AppContext } from 'contexts/AppProvider';

const Product: NextPage = () => {
  const { viewCart } = useContext(AppContext);

  return (
    <Main>
      <Header />
      <SectionCenter>
        <BtnGoBack onClick={ () => Router.push('/') }>
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"></path></svg>
           Voltar
        </BtnGoBack>
        <ProductInformation />

      </SectionCenter>
      
      { viewCart ? <Cart /> : '' }
    </Main>
  );
};

export default Product;
