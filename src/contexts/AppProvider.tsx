import { createContext, useEffect, useState } from 'react';
import { getProductsInit, loadByFilterForPage, loadMoreProducts, loadMoreProductsForPage, loadProductsByFilter } from 'services/apiWine';
import { AppContextType, DEFAULT_VALUE, Product, ProductCart, propsProvider } from './types';

export const AppContext = createContext<AppContextType>(DEFAULT_VALUE);

export const AppProvider = ({ children }: propsProvider) => {
  const [products, setProducts] = useState([]);
  const [details, setDetails] = useState(DEFAULT_VALUE.details);
  const [productFocus, setProdFocus] = useState(DEFAULT_VALUE.productFocus);
  const [cartCount, setCartCount] = useState(0);
  const [limit, setLimit] = useState(12);
  const [loadingData, setLoadingData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewCart, setViewCart] = useState(false);
  const [filter, setFilter] = useState('');

  const getInitInfo = async () => {
    setFilter('');
    setLoading(true);
    setLoadingData(true);

    const { items, page, totalPages, itemsPerPage, totalItems } = await getProductsInit();
    
    setProducts(items);

    let arrayPages = [];

    for (let index = 1; index <= totalPages; index++) {
      arrayPages.push(index);
    }

    setDetails({ page, totalPages, itemsPerPage, totalItems, pagination: arrayPages });
    setLoading(false);
    setLoadingData(false);
  };

  const defineFocusProduct = (id: number) => {
    setProdFocus(products.find((product: Product) => product.id === id));
  };

  const saveInCart = (product: Product, quantity: number) => {
    const cartData = localStorage.getItem('winebox');

    if (cartData && JSON.parse(cartData).items.length) {
      let updateCart = []; 
      let { items, totalPrice } = JSON.parse(cartData);

      const productInUpdate = items.find((Obj: Product) => Obj.id === product.id);

      if (productInUpdate) {
        productInUpdate['quantity'] += quantity;
        const allProductsinCart = items.filter((Obj: Product) => Obj.id !== product.id);
        updateCart = [...allProductsinCart, productInUpdate];
      } else {
        updateCart = [...items, { ...product, quantity }];
      }

      localStorage.setItem('winebox', JSON.stringify({
        items: updateCart,
        totalPrice: Number((totalPrice + product.priceMember * quantity).toFixed(2)),
      }));
      
      setCartCount(updateCart.length);
    } else {
      localStorage.setItem('winebox', JSON.stringify({
        items: [{ ...product, quantity }],
        totalPrice: Number((product.priceMember * quantity).toFixed(2)),
      }));
      setCartCount(1);
    };

    return true;
  };

  const removeFromWineBox = (Items: ProductCart[], totalPrice: number) => {
    localStorage.setItem('winebox', JSON.stringify({
      items: Items,
      totalPrice,
    }));
    
    setCartCount(Items.length);
  };

  const loadMore = async () => {
    setLoading(true);
    setLimit(limit + 12);
    const data = await loadMoreProducts(limit + 12);
    setProducts(data.items);
    setLoading(false);
  };

  const loadMoreForPage = async (pageNum: number) => {
    setLoading(true);
    setLimit(12);
    let data;

    if (filter) {
      data = await loadByFilterForPage(filter, pageNum);
    } else {
      data = await loadMoreProductsForPage(pageNum)
    }
    const { items, page } = data;
    setProducts(items);
    setDetails({ ...details, page });
    setLoading(false);
  };

  const getByFilter = async (filter: string) => {
    setLoadingData(true);
    setFilter(filter);
    setLimit(12);
    const { items, page, totalPages, itemsPerPage, totalItems } = await loadProductsByFilter(filter);
    setProducts(items);

    let arrayPages = [];

    for (let index = 1; index <= totalPages; index++) {
      arrayPages.push(index);
    }

    setDetails({ page, totalPages, itemsPerPage, totalItems, pagination: arrayPages });
    setLoadingData(false);
  }

  useEffect(() => {
    getInitInfo();

    const cartData = localStorage.getItem('winebox');

    if (!cartData) {
      localStorage.setItem('winebox', JSON.stringify({ items: [], totalPrice: 0 }));
    } else {
      setCartCount(JSON.parse(cartData).items.length);
    };
  }, []);

  useEffect(() => {
    const body = document.querySelector('body');

    if (viewCart && body) {
      body.style.overflow = 'hidden';
    } else if (body) {
      body.style.overflow = 'auto';
    };
  }, [viewCart]);
  
  return (
    <AppContext.Provider value={{
      getInitInfo,
      products,
      details,
      productFocus,
      cartCount,
      defineFocusProduct,
      saveInCart,
      loadMore,
      loadMoreForPage,
      getByFilter,
      loading,
      loadingData,
      viewCart,
      setViewCart,
      removeFromWineBox
    }}>
      { children }
    </AppContext.Provider>
  );
};
