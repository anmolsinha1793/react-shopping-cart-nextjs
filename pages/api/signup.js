import connectDb from '../../utils/connectDb';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import isLength from 'validator/lib/isLength';
import isEmail from 'validator/lib/isEmail';
import Cart from '../../models/Cart';

connectDb();

export default async (req, res) => {
    const { name, email, password} = req.body;
    try {
        //* validate the name, email and password values
        if(!isLength(name, {min: 3, max:10})){
            return res.status(422).send(`Name must be between 3-10 characters long`);
        } else if (!isLength(password, {min: 6})) {
            return res.status(422).send(`Password must be atleast 6 characters long`);
        }
        else if (!isEmail(email)) {
            return res.status(422).send(`Email must be valid`);
        }
        //* Check to see if the user already exists in the db
        const user = await User.findOne({ email });
        if(user){
            return res.status(422).send(`User already exits with email ${email}`);
        }
        //* if not, hash their password(take a normal password and turn it to cryptic string)
        const hash = await bcrypt.hash(password, 10);
        //* create user
        const newUser = await new User({
             name,
             email,
             password: hash
        }).save();
        console.log(newUser);
        //* create a cart for the new user
        await new Cart({user: newUser._id}).save();
        //* create token for the user
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {expiresIn: '7d'})
        //* send back token
        res.status(201).json(token);
    } catch (error) {
        res.status(500).send(`Error signing up user, please try again later`);
    }
}