const stripe = require('stripe')('sk_test_placeholder...'); // Your SK

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { licenseKey } = req.body;

  // Simple key check for now, PROD: verify Stripe sub/webhook
  let tier = 'free';
  let isProPlus = false;
  if (licenseKey === 'codewealth-pro-key-🧠2024') tier = 'pro';
  if (licenseKey.includes('-plus')) {
    tier = 'proplus';
    isProPlus = true;
  }

  res.json({
    isPro: tier !== 'free',
    isProPlus,
    tier,
    price: tier === 'proplus' ? '$19.99/mo' : tier === 'pro' ? '$9.99/mo' : 'Free'
  });
