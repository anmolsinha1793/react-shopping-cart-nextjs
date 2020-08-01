import React from 'react';
import axios from 'axios';
import ProductList from '../components/Index/ProductList';
import baseUrl from '../utils/baseUrl';
import ProductPagination from '../components/Index/ProductPagination';

function Home({ products, totalPages }) {
  return <><ProductList products={products}/>
    <ProductPagination totalPages={totalPages}/></>;
}

/**
  * This method is used to get initial props such as products
  * @returns products[]
  */
Home.getInitialProps = async(ctx) => {
  const page = ctx.query.page ? ctx.query.page : '1';
  //* number of products to show per page
  const size = 4;
  const payload = {params: { page, size }};
  const url = `${baseUrl}/api/products`;
  //* fetch data from server
  const response = await axios.get(url, payload);
  //* return response data as an object
  return response.data;
}
export default Home;
