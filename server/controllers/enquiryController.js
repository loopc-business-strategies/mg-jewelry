const { dashboardApiUrl, websiteEnquiryToken } = require('../config/env');

const FORWARD_TIMEOUT_MS = 15000;
const IDEMPOTENCY_KEY_PATTERN = /^[A-Za-z0-9-]{8,100}$/;
const FAILURE_MESSAGE = 'Unable to submit your enquiry. Please try again or contact us directly.';

exports.submitEnquiry = async (req, res) => {
  if (!dashboardApiUrl || !websiteEnquiryToken) {
    console.error('[enquiries] DASHBOARD_API_URL or WEBSITE_ENQUIRY_TOKEN is not configured');
    return res.status(503).json({ success: false, message: FAILURE_MESSAGE });
  }

  const { name, phone, enquiryType } = req.body;
  const payload = {
    name,
    phone,
    source: 'website',
    enquiryType: enquiryType || 'sell_gold',
  };

  const headers = {
    'Content-Type': 'application/json',
    'x-website-enquiry-token': websiteEnquiryToken,
  };
  const idempotencyKey = String(req.get('Idempotency-Key') || '').trim();
  if (IDEMPOTENCY_KEY_PATTERN.test(idempotencyKey)) headers['Idempotency-Key'] = idempotencyKey;

  try {
    const response = await fetch(`${dashboardApiUrl}/api/enquiries`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      console.error('[enquiries] dashboard rejected enquiry:', response.status, data.message);
      const status = response.status === 400 ? 400 : 502;
      return res.status(status).json({ success: false, message: FAILURE_MESSAGE });
    }

    return res.status(response.status === 200 ? 200 : 201).json({ success: true, id: data.id });
  } catch (err) {
    console.error('[enquiries] forwarding to dashboard failed:', err.message);
    return res.status(502).json({ success: false, message: FAILURE_MESSAGE });
  }
};
