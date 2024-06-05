

// var paypal = require('paypal-rest-sdk');

// paypal.configure({
//     'mode': 'sandbox', //sandbox or live
//     'client_id': 'AS24_P95YzzbdU0mv31vAsrvnNPZin53UwLKN4aDhzJUiiKx9qKkXn2v-MlllNtxOkyJfOV5IsngB2zn',
//     'client_secret': 'EOXpq1a5lIlGoXQsNZNBWqhIJsBdngHrVs1Z7-zyAGuQPAN_UW5NGSQVv-OnFj5s8sQra2CIe8wlKdrD'
//   });

const express = require('express');
const bodyParser = require('body-parser');
const paypal = require('@paypal/checkout-server-sdk');

const app = express();
app.use(bodyParser.json());

const clientId = 'AS24_P95YzzbdU0mv31vAsrvnNPZin53UwLKN4aDhzJUiiKx9qKkXn2v-MlllNtxOkyJfOV5IsngB2zn';
const clientSecret = 'EOXpq1a5lIlGoXQsNZNBWqhIJsBdngHrVs1Z7-zyAGuQPAN_UW5NGSQVv-OnFj5s8sQra2CIe8wlKdrD';

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

app.post('/create-payment', async (req, res) => {
    const { totalAmount } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: totalAmount,
            },
        }],
    });

    try {
        const order = await client.execute(request);
        res.json(order.result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/execute-payment', async (req, res) => {
    const { paymentId, payerId } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(paymentId);
    request.requestBody({});

    try {
        const capture = await client.execute(request);
        res.json(capture.result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

