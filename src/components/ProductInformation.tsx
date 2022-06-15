import Image from 'next/image';
import { useContext, useState } from 'react';
import { AppContext } from 'contexts/AppProvider';
import { SectionFlexProduct } from 'styles/Containers';
import { useMediaQuery } from 'hooks/useMediaQuery';
import StarsAvaliations from './StarsAvaliations';
import {
  BtnContainer,
  BtnGoBack,
  ContainerPainelFloat,
  Description,
  ImageContainer,
  InfoContainer,
  LinksNavigate,
  ProductComment,
  ProductDetail,
  ProductName,
  ProductPrice
} from 'styles/pages/product/Informations';
import { ArrowBack } from './icons';
import Router from 'next/router';

const ProductInformation = () => {
  const { productFocus, saveInCart } = useContext(AppContext);
  const [count, setCount] = useState(1);
  const inMobile = useMediaQuery('(max-width: 900px)');

  const increment = () => {
    setCount(count + 1);
  };
  
  const decrement = () => {
    setCount(count - 1);
  };
  
  if (!productFocus) {
    return (
      <h1>Erro inesperado!</h1>
    );
  };
  
  const { name, image, id, priceMember, priceNonMember  } = productFocus;

  if (inMobile) {
    return (
      <SectionFlexProduct>
        <InfoContainer>
          <LinksNavigate>
            <a href="">Vinhos</a> &gt; <a href="">{ productFocus.country }</a> &gt; { productFocus.region }
          </LinksNavigate>
          <ProductName>{ productFocus.name }</ProductName>
            <ProductDetail>
              <Image
                src={ productFocus.flag }
                alt="Flag"
                width={ 20 }
                height={ 20 }
              />
              <span>{ productFocus.country }</span>
              <span>{ productFocus.type }</span>
              <span>{ productFocus.classification }</span>
              <span>{ productFocus.volume }</span>
            </ProductDetail>
        </InfoContainer>

        <ImageContainer>
          <Image
            src={ productFocus.image }
            alt="Product"
            width="100%" height="100%" layout="responsive" objectFit="contain"
          />
        </ImageContainer>

        <Description>
          <h4>Descrição</h4>

          <ProductComment>
            { productFocus.sommelierComment }
          </ProductComment>
        </Description>

        <ContainerPainelFloat>
          <div>
            <span>{ `${productFocus.discount}% OFF` }</span>
            <span>{ `R$ ${productFocus.price.toFixed(2).replace(/\./, ',')}` }</span>
            <span>R$ <span>{
              productFocus.priceMember.toFixed(2).replace(/\./, ',')  
            }</span></span>
            <span>
              { `PREÇO NÃO-SÓCIO R$ ${productFocus.priceNonMember
                  .toFixed(2).replace(/\./, ',')}` }
            </span>
          </div>

          <div>
            <button onClick={ () => saveInCart({ name, image, id, priceMember, priceNonMember }, count) }>
              Adicionar
            </button>
          </div>
        </ContainerPainelFloat>
      </SectionFlexProduct>
    );
  };
    
  return (
    <>
      <BtnGoBack onClick={ () => Router.push('/') }>
        <ArrowBack />
        Voltar
      </BtnGoBack>
      <SectionFlexProduct>
        <ImageContainer>
          <Image
            src={ productFocus.image }
            alt="Product"
            width="100%" height="100%" layout="responsive" objectFit="contain"
          />
        </ImageContainer>
        <InfoContainer>
          <LinksNavigate>
            <a href="">Vinhos</a> &gt; <a href="">{ productFocus.country }</a> &gt; { productFocus.region }
          </LinksNavigate>
          <ProductName>{ productFocus.name }</ProductName>
          <ProductDetail>
            <Image
              src={ productFocus.flag }
              alt="Flag"
              width={ 20 }
              height={ 20 }
            />
            <span>{ productFocus.country }</span>
            <span>{ productFocus.type }</span>
            <span>{ productFocus.classification }</span>
            <span>{ productFocus.volume }</span>
            <StarsAvaliations avaliation={ productFocus.rating } />
            <span>({ productFocus.avaliations || 0 })</span>
          </ProductDetail>
          <ProductPrice>
            { `R$ ${ productFocus.priceMember
              .toFixed(2).replace(/\./, ',') }` }
          </ProductPrice>
          <h3>
            { `NÃO SÓCIO R$ ${ productFocus.priceNonMember
                .toFixed(2).replace(/\./, ',') }/un.` }
          </h3>

          <h4>Comentário do Sommelier</h4>

          <ProductComment>
            { productFocus.sommelierComment }
          </ProductComment>
          <BtnContainer>
            <div>
              <button
                disabled={ count === 1 ? true : false }
                onClick={ decrement }
              >
                -
              </button>
              <span>{ count }</span>
              <button onClick={ increment }>+</button>
            </div>
            <button onClick={ () => saveInCart({ name, image, id, priceMember, priceNonMember }, count) }>
              Adicionar
            </button>
          </BtnContainer>
        </InfoContainer>
      </SectionFlexProduct>
    </>
  );
};

export default ProductInformation;
