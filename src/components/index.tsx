import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import Header from './header';
import NavBar from './nav-bar';
import Content from './content';
import styles from './main.module.css';

import Loading from './loading';
import { API_URL, ITEMS_PER_PAGE, TOTAL_NO_PHOTOS } from './constants';

import { Props } from 'types';
import usePagination from '../use-pagination';
import { CartContext } from 'cart-context';

const RenderStateContainer: FC<Props> = ({ children }) => {
  return <div className={styles.loading}>{children}</div>;
};

const fetchCategories = async () => {
  const categories = await fetch(`${API_URL}products/categories`);
  if (!categories.ok) {
    throw Error(categories.statusText);
  }
  const categoriesJson = await categories.json();

  return categoriesJson;
};

const Container = styled.div`
  display: flex;
  padding: 40px 32px;
  margin-left: 300px;
  margin-top: 100px;

  background-color: #f7f7fc;
  @media (max-width: 992px) {
    flex-direction: column;
    padding: 20px 16px;
    margin-left: 100px;
    margin-top: 80px;
  }
`;

export const App = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<Error>();
  const [cartItems, addToCart] = useState(0);

  const { goTo, currentPage } = usePagination();

  useEffect(() => {
    setIsLoading(true);

    fetchCategories()
      .then((result) => setCategories(result))
      .catch((error) => setHasError(error))
      .finally(() => setIsLoading(false));
  }, [currentPage]);

  const handlePageChange = (selected: number) => goTo(selected);

  if (isLoading)
    return (
      <RenderStateContainer>
        <Loading />
      </RenderStateContainer>
    );

  if (!isLoading && !categories.length && !hasError)
    return (
      <RenderStateContainer>
        <h1> There is no categories yet.</h1>
      </RenderStateContainer>
    );

  if (hasError)
    return (
      <RenderStateContainer>
        <h1> There is an error in getting data.</h1>
      </RenderStateContainer>
    );

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      <div onScroll={() => alert('hee')}>
        <Header categories={categories} />
        <NavBar categories={categories} />

        <Container>
          <Content />

          {/* <Pagination
            onChange={handlePageChange}
            pageSize={ITEMS_PER_PAGE}
            total={TOTAL_NO_PHOTOS}
            hideOnSinglePage
            showPrevNextJumpers
            current={currentPage}
          /> */}
        </Container>
      </div>
    </CartContext.Provider>
  );
};
