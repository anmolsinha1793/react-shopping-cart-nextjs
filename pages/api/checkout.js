import Stripe from 'stripe';
import uuidv4 from 'uuid/v4';
import jwt from 'jsonwebtoken';
import Cart from '../../models/Cart';
import calculateCartTotal from '../../utils/calculateCartTotal';
import Order from '../../models/Order';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
  * This method is used to make payment once the user wants to checkout with products added in cart
  * @param req - request details
  * @param res - response details
  * @returns Promise
  */
export default async(req, res) => {
    const {paymentData} = req.body;
    try {
        //* verify and get user id from token
        const {userId} = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        //* find cart based on user id, populate it
        const cart = await Cart.findOne({ user: userId }).populate({
            path: 'products.product',
            model: 'Product'
        });
        //* calculate cart totals again from cart products
        const {cartTotal, stripeTotal} = calculateCartTotal(cart.products);
        //* get email from payment data, see if email is linked with existing stripe customer
        const prevCustomer = await stripe.customers.list({
            email: paymentData.email,
            limit: 1
        });
        const isExistingCustomer = prevCustomer.data.length > 0;
        //* if not existing customer, create them based on their email
        let newCustomer;
        if(!isExistingCustomer) {
            newCustomer = await stripe.customers.create({
                email: paymentData.email,
                source: paymentData.id
            })
        }
        const customer = (isExistingCustomer && prevCustomer.data[0].id) || newCustomer.id;
        //* create charge with total, send email
        const charge = await stripe.charges.create({
            currency: "INR",
            amount: stripeTotal,
            receipt_email: paymentData.email,
            customer,
            description: `Checkout | ${paymentData.email} | ${paymentData.id}`
        }, {
            idempotency_key: uuidv4()
        });
        //* add order data to database
        await new Order({
            user: userId,
            email: paymentData.email,
            total: cartTotal,
            products: cart.products
        }).save();
        //* clear products in cart
        await Cart.findOneAndUpdate(
            { _id: cart._id},
            { $set:{ products: [] }}
        )
        //* send back a success (200) response
            res.status(200).send(`Checkout successfull`);
    } catch (error) {
        res.status(500).send(`Error processing charge`);
    }
}