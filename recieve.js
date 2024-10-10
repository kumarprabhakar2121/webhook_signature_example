const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const port = 4001;
const secret = 'your_webhook_secret';  // Same secret as in the sender app

app.use(bodyParser.json());  // Middleware to parse JSON request bodies

// Endpoint to receive webhooks
app.post('/webhook', (req, res) => {
    const receivedSignature = req.headers['x-signature'];  // Signature sent by the sender
    const payload = JSON.stringify(req.body);  // The actual payload sent

    // Compute the HMAC-SHA256 signature on the receiver side
    const computedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    // Secure comparison of signatures
    if (crypto.timingSafeEqual(Buffer.from(computedSignature), Buffer.from(receivedSignature))) {
        console.log('Webhook signature verified successfully.');
        console.log('Received payload:', req.body);

        res.status(200).send('Signature verified and payload received by receiver');
    } else {
        console.log('Invalid signature!');
        res.status(400).send('Invalid signature');
    }
});

app.listen(port, () => {
    console.log(`Webhook receiver running on http://localhost:${port}`);
});
