import { Header, Segment, Button, Icon, Item} from 'semantic-ui-react';
import {useRouter} from 'next/router';

function CartItemList({products, user}) {
  const router = useRouter();
  function mapCartProductsToItems(products) {
    return products.map(pdt => ({
      childkey: pdt.product._id,
      header: (
        <Item.Header as="a" onClick={() => router.push(`/product?_id=${pdt.product._id}`)}>
          {pdt.product.name}
        </Item.Header>
      ),
      image: pdt.product.mediaUrl,
      meta: `${pdt.quantity} x Rs. ${pdt.product.price}`,
      fluid: 'true',
      extra: (
        <Button
        basic
        icon="remove"
        floated="right"
        onClick={() => console.log(pdt.product._id)}
        />
      )
    }));
  }
  if(products.length === 0) {
    return (
      <Segment secondary color="teal" inverted textAlign="center" placeholder>
        <Header icon>
          <Icon name="shopping basket"/>
          No products in your cart, please add some!
        </Header>
      <div>
        {user ? (<Button color="orange" onClick={() => router.push('/')}>
          View Products
        </Button>) : (<Button color="blue" onClick={() => router.push('/login')}>
          Login to Add Products
        </Button>)}
      </div>
      </Segment>
    );
  }

  return <Item.Group divided items={mapCartProductsToItems(products)}/>
 
}

export default CartItemList;
