import Product from '../../models/Product';
import connectDb from '../../utils/connectDb';

connectDb();

/**
  * This method is used to fetch the products so that they can be rendered based on configuration
  * on the product list screen
  * @param req - request details
  * @param res - response details
  * @returns Promise
  */
export default async (req, res) => {
    const { page, size } = req.query;
    //* convert the query string values to numbers
    const pageNum = Number(page);
    const pageSize = Number(size);
    let products = [];
    const totalDocs = await Product.countDocuments();
    const totalPages = Math.ceil(totalDocs/pageSize);
    if(pageNum === 1) {
        products = await Product.find().limit(pageSize);
    } else {
        const skips = pageSize * (pageNum - 1);
        products = await Product.find().skip(skips).limit(pageSize);
    }
    // const products = await Product.find()
    res.status(200).json({products, totalPages});
}