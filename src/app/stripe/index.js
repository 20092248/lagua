const express = require('express');
const Stripe = require('stripe');

const stripe = Stripe('sk_test_51Q07Ee08IGrp4ssfefOpTxY24JMvxkUO1mImQESLzN6xyk3Xtiq0c315KD1UefWXW8lR73prsbOmUZvA4yEXGdcH00iRYU1CmF');

const app = express();
const port = 3000;

app.post('/payment-sheet', async (req, res, next) => {
    try {
        const data = req.body;
        const params = {
            email: data.email,
            name: data.name
        }
        const customer = await stripe.customers.create(params);
        console.log(customer);
        const ephemeralKey = await stripe.ephemeralKey.create(
            {customer: customer.id},
            {apiVersion: '2024-09-20'}
        );
        const paymentIntent = await stripe.paymentIntent.create({
            amount: parseInt(data.amount),
            currency: data.currency,
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true
            }
        });
        const response = {
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id
        }
        res.status(200).send(response);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

app.listen(port, host, () =>{
    console.log('Server is running at ${port}');
});