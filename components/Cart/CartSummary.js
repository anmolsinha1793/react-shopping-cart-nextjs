import {Button, Segment, Divider} from 'semantic-ui-react';
import React from 'react';
import calculateCartTotal from '../../utils/calculateCartTotal';

function CartSummary({ products }) {
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
  <strong>Sub total:</strong> Rs. {cartAmount}
  <Button icon="cart" disabled={isCartEmpty} color="teal" floated="right" content="Checkout"/>
  </Segment>
    </>;
}

export default CartSummary;
