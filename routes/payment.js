const express = require('express');
const router = express.Router();
// This file contains placeholders for payment gateway integrations.
// For production, integrate Razorpay / Stripe SDKs here and verify webhooks.

router.get('/demo', (req,res)=>{
  res.send('Payment demo endpoint. Integrate real gateways in routes/payment.js');
});

module.exports = router;
