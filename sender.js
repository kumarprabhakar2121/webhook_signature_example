const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
const port = 4000;
const secret = 'your_webhook_secret';  // Shared secret between sender and receiver

// Example payload
const payload = {
    event: "user.created",
    user: {
        id: 1,
        name: "John Doe",
        email: "john@example.com"
    }
};

// Function to compute HMAC-SHA256 signature
function computeSignature(payload, secret) {
    return crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(payload))
        .digest('hex');
}

// Endpoint to trigger sending the webhook
app.get('/send-webhook', async (req, res) => {
    const signature = computeSignature(payload, secret);

    try {
        const response = await axios.post('http://localhost:4001/webhook', payload, {
            headers: {
                'Content-Type': 'application/json',
                'x-signature': signature  // Include the signature in headers
            }
        });

        console.log('Webhook sent successfully:', response.data);
        res.status(200).send('Webhook sent successfully');
    } catch (error) {
        console.error('Error sending webhook:', error.message);
        res.status(500).send('Error sending webhook');
    }
});

app.listen(port, () => {
    console.log(`Webhook sender running on http://localhost:${port}`);
});
