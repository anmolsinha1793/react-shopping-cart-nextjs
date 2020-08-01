import Order from '../../models/Order';
import jwt from 'jsonwebtoken';
import connectDb from '../../utils/connectDb';

connectDb();

/**
  * This method is used to fetch the total orders based on user's previous transactions from db
  * @param req - request details
  * @param res - response details
  * @returns Promise
  */
export default async(req, res) => {
    try {
        const {userId} = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const orders = await Order.find({ user: userId }).sort({ createdAt: 'desc' }).populate({
            path: 'products.product',
            model: 'Product'
        })
        res.status(200).json({ orders });
    } catch (error) {
        res.status(403).send(`Please login again`);
    }
}