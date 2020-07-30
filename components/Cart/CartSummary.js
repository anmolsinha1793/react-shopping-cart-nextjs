import {Button, Segment, Divider} from 'semantic-ui-react';
import React from 'react';
import calculateCartTotal from '../../utils/calculateCartTotal';
import StripeCheckout from 'react-stripe-checkout';

function CartSummary({ products, handleCheckout, success }) {
  const [isCartEmpty, setCartEmpty] = React.useState(false);
  const [cartAmount, setCartAmount] = React.useState(0);
  const [stripeAmount, setStripeAmount] = React.useState(0);

  React.useEffect(() => {
    const {cartTotal, stripeTotal} = calculateCartTotal(products);
    setCartAmount(cartTotal);
    setStripeAmount(stripeTotal);
    setCartEmpty(products.length===0);
  },[products]);
  return <>
  <Divider />
  <Segment clearing size="large">
  <strong>Sub total:</strong> {'\u20B9'} {cartAmount}
  <StripeCheckout
  name="React Shopping Cart"
  amount={stripeAmount}
  image={products.length > 0 ? products[0].product.mediaUrl: ''}
  currency="INR"
  shippingAddress={true}
  billingAddress={true}
  zipCode={true}
  token={handleCheckout}
  triggerEvent="onClick"
  stripeKey="pk_test_Z7UUeCZXupM863oN3jcDUKqE00f4tnpE90">
  <Button icon="cart" disabled={isCartEmpty || success} color="teal" floated="right" content="Checkout"/>
  </StripeCheckout>
  </Segment>
    </>;
}

export default CartSummary;
