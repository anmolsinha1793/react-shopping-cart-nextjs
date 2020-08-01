import User from '../../models/User';
import jwt from 'jsonwebtoken';

/**
  * This method is used to fetch all the users from db
  * @param req - request details
  * @param res - response details
  * @returns Promise
  */
export default async (req, res) => {
    try {
        const {userId} = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const users = await User.find({ _id: {$ne: userId}}).sort({
            name: 'asc'
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(403).send(`Please login again`);
    }
}