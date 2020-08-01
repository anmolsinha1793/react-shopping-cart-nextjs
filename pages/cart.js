import CartItemList from '../components/Cart/CartItemList';
import CartSummary from '../components/Cart/CartSummary';
import {Segment} from 'semantic-ui-react';
import {parseCookies} from 'nookies';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import React from 'react';
import cookie from 'js-cookie';
import catchErrors from '../utils/catchErrors';

function Cart({ products, user }) {
  const [cartProducts, setCartProducts] = React.useState(products);
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  /**
  * This method is used to remove items from card based on product id
  * @returns void
  */
  async function handleRemoveFromCart(productId) {
    const url = `${baseUrl}/api/cart`;
    const token = cookie.get('token');
    const payload = {
      params: {productId},
      headers: {Authorization: token}
    };
    const response = await axios.delete(url,payload);
    setCartProducts(response.data);
  }

  /**
  * This method is used to checkout user with the selected products
  * @returns void
  */
  async function handleCheckout(paymentData) {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/checkout`;
      const token = cookie.get('token');
      const payload = { paymentData };
      const headers = { headers: { Authorization: token }}
      await axios.post(url, payload, headers);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, window.alert);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Segment loading={loading}>
      <CartItemList user={user} 
      products={cartProducts} handleRemoveFromCart={handleRemoveFromCart} success={success}
      />
      <CartSummary products={cartProducts} handleCheckout={handleCheckout} success={success}/>
    </Segment>
  );
}
/**
  * This method is used to get initial props such as products in the cart
  * @returns void
  */
Cart.getInitialProps = async ctx => {
  const {token} = parseCookies(ctx);
  if(!token) {
    return { products: []};
  }
  const url = `${baseUrl}/api/cart`;
  const payload = {headers: { Authorization: token } };
  const response = await axios.get(url, payload);
  return {products: response.data};
}

export default Cart;
