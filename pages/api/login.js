import connectDb from '../../utils/connectDb';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

connectDb();

/**
  * This method is used to check if the user already exits with the given data
  * @param req - request details
  * @param res - response details
  * @returns Promise
  */
export default async (req, res) => {
    const {email, password} = req.body;
    try {
        //* check if user exists with the provided email
        const user = await User.findOne({ email }).select('+password');
        //* if not, return error
        if(!user) {
            return res.status(404).send(`No user exists with that email`);
        }
        //* check to see if users password matches the one in db
        const passworsMatch = await bcrypt.compare(password, user.password);
        //* if so, generate a token
        if(passworsMatch) {
            const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
            //* send the token to the client
            res.status(200).json(token);
        }
        else {
            res.status(401).send(`Passwords do not match`);
        }        
    } catch (error) {
        res.status(500).send(`Error logging in user`);
    }
}