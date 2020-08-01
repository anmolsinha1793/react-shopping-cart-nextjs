import User from '../../models/User';
import jwt from 'jsonwebtoken';
import connectDb from '../../utils/connectDb';

connectDb();

/**
  * This method is used to handle get/put request conditionally
  * @param req - request details
  * @param res - response details
  * @returns void
  */
export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await handleGetRequest(req, res);
            break;
        case "PUT":
            await handlePutRequest(req, res);
            break;
        default:
            res.status(405).send(`Method ${req.method} not allowed`)
            break;
    }
}
/**
  * This method is used to get the user by fetching the userid and matching the same in db
  * @param req - request
  * @param res - response
  * @returns Promise
  */
async function handleGetRequest(req, res) {
    if (!(`authorization` in req.headers)) {
        return res.status(401).send(`No authorization token`)
    }

    try {
        const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: userId });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send(`User not found`);
        }
    } catch (error) {
        res.status(403).send(`Invalid token`);
    }
}
/**
  * This method is used to change the user role on the db
  * @param req - request details
  * @param res - response details
  * @returns Promise
  */
async function handlePutRequest(req, res) {
    const { _id, role } = req.body
    await User.findOneAndUpdate(
        { _id },
        { role }
    )
    res.status(203).send(`User Updated`);
}