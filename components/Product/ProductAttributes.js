import {Header, Button, Modal, Segment} from 'semantic-ui-react';
import React from 'react';
import axios from 'axios';
import baseUrl from '../../utils/baseUrl';
import { useRouter } from 'next/router';

function ProductAttributes({ description, _id, user }) {
  const [modal, setModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const isRoot = user && user.role === 'root';
  const isAdmin = user && user.role === 'admin';
  const isRootorisAdmin = isRoot || isAdmin;

  async function handleDelete() {
    setLoading(true);
    const url = `${baseUrl}/api/product`;
    const payload = {params: { _id }}
    await axios.delete(url, payload);
    router.push('/');
    setLoading(false);
  }

  return (<>
  <Header as="h3">About this product</Header>
  <p>{description}</p>
  {isRootorisAdmin && <><Button 
  icon="trash alternate outline"
  color="red"
  content="Delete Product"
  onClick={() => setModal(true)}
  />
  <Modal open={modal} dimmer="blurring">
  <Segment loading={loading}>
    <Modal.Header>Confirm delete</Modal.Header>
    <Modal.Content><p>Are you sure you want to delete this product?</p></Modal.Content>
    <Modal.Actions>
      <Button content="Cancel" onClick={() => setModal(false)}/>
      <Button negative icon="trash" labelPosition="right" content="Delete" onClick={handleDelete} disabled={loading}/>
    </Modal.Actions>
    </Segment>
  </Modal></>}
  </>);
}

export default ProductAttributes;
