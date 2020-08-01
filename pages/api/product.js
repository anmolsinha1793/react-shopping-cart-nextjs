import Product from '../../models/Product';
import connectDb from '../../utils/connectDb';
import Cart from '../../models/Cart';

connectDb();

/**
  * This method is used to handle get/put/delete conditionally
  * @param req - request details
  * @param res - response details
  * @returns void
  */
export default async (req, res) => {
    switch(req.method){
        case "GET":
            await handleGetRequest(req, res);
            break;
        case "POST":
            await handlePostRequest(req, res);
            break;    
        case "DELETE":
            await handleDeleteRequest(req, res);
            break;
        default:
            res.status(405).send(`Method ${req.method} not allowed`);
            break;
    }
}

/**
  * This method is used to fetch the product with the id if it exists
  * @param req - request details
  * @param res - response details
  * @returns Promise
  */
async function handleGetRequest(req, res) {
    const { _id } = req.query;
    const product = await Product.findOne({ _id });
    res.status(200).json(product);
}

/**
  * This method is used to create new product with the given details
  * @param req - request details
  * @param res - response details
  * @returns Promise
  */
async function handlePostRequest(req, res) {
    const {name, price, description, mediaUrl} = req.body;
    try{
        if(!name || !price || !description || !mediaUrl) {
            return res.status(422).send("Product missing one or more fields");
        }
        const product = await new Product({
            name,
            price,
            description,
            mediaUrl
        }).save();
        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error in creating product");
    }
    
}

/**
  * This method is used to delete the product based on id
  * @param req - request details
  * @param res - response details
  * @returns Promise
  */
async function handleDeleteRequest(req, res) {
    const { _id } = req.query;
    try {
         //* delete the product by id
        await Product.findOneAndDelete({ _id });
        //* remove product from all carts, referenced as 'product'
        await Cart.updateMany(
         {'products.product': _id},
         { $pull: { products: {product: _id }} }
        )
        res.status(204).json({});   
    } catch (error) {
        res.status(500).send(`Error deleting product`);
    }
   
}
