import React from 'react';
import { Form, Input, TextArea, Button, Image, Message, Header, Icon} from 'semantic-ui-react';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import catchErrors from '../utils/catchErrors';

const INITIAL_PRODUCT = {
  name: '',
  price: '',
  media: '',
  description: ''
};
function CreateProduct() {
  const [product, setProduct] = React.useState(INITIAL_PRODUCT);
  const [mediaPreview, setMediaPreview] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const isProduct = Object.values(product).every(elm => Boolean(elm));
    setDisabled(!isProduct);
  }, [product])
  
  /**
  * This method is triggered whenever there is a change in name, value, file
  * @returns void
  */
  function handleChange(event) {
    const {name, value, files} = event.target;
    if(name === 'media'){
      setProduct((prevState) => ({
        ...prevState,
        media: files[0] 
      }));
      setMediaPreview(window.URL.createObjectURL(files[0]))
    }  else {
      setProduct((prevState) => ({
        ...prevState,
        [name]: value 
      }));
    }
  }

  /**
  * This method is used to create a new product based on the new data
  * @returns void
  */
  async function handleSubmit(event) {
    try{
      event.preventDefault();
      setLoading(true);
      setError('');
      const mediaUrl = await handleImageUpload();
      const url = `${baseUrl}/api/product`;
      const { name, price, description } = product;
      const payload = { name:'', price, description, mediaUrl };
      await axios.post(url, payload);
      setProduct(INITIAL_PRODUCT);
      setSuccess(true);
    } catch(err) {
      catchErrors(err, setError);
    } finally {
      setLoading(false);
    }
  }

  /**
  * This method is used to handle image-upload to cloudinary server
  * @returns string
  */
  async function handleImageUpload() {
    const data = new FormData();
    data.append('file', product.media);
    data.append('upload_preset', 'react-store');
    data.append('cloud_name', 'adi17');
    const response = await axios.post(process.env.CLOUDINARY_URL, data);
    const mediaUrl = response.data.url;
    return mediaUrl;
  }
  return (
    <>
  <Header as="h2" block>
    <Icon name="add" color="orange"/>
    Create New Product
  </Header>
  <Form loading={loading} error={Boolean(error)} success={success} onSubmit={handleSubmit}>
    <Message
    success
    icon="check"
    header="Success!"
    content="Your Product has been posted"
    />
     <Message
    error
    header="Oops!"
    content={error}
    />
    <Form.Group widths="equal">
    <Form.Field
    control={Input }
    name="name"
    label="Name"
    placeholder="Name"
    value={product.name}
    onChange={handleChange}
    />
    <Form.Field
    control={Input}
    name="price"
    label="Price"
    placeholder="Price"
    min="0.00"
    step="0.01"
    type="number"
    value={product.price}
    onChange={handleChange}
    />
    <Form.Field
    control={Input}
    name="media"
    label="Media"
    content="Select Image"
    accept="image/*"
    type="file"
    onChange={handleChange}
    />
    </Form.Group>
    <Image src={mediaPreview} rounded centered size="small"/>
    <Form.Field
    control={TextArea}
    name="description"
    label="Description"
    placeholder="Description"
    value={product.description}
    onChange={handleChange}
    />
    <Form.Field
    control={Button}
    color="blue"
    icon="pencil alternate"
    content="Submit"
    type="submit"
    disabled={disabled || loading}
    />
  </Form>
    </>
  )
}

export default CreateProduct;
