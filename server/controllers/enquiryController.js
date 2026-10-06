const { dashboardApiUrl, websiteEnquiryToken } = require('../config/env');

const FORWARD_TIMEOUT_MS = 15000;
const FAILURE_MESSAGE = 'Unable to submit your enquiry. Please try again or contact us directly.';

exports.submitEnquiry = async (req, res) => {
  if (!dashboardApiUrl || !websiteEnquiryToken) {
    console.error('[enquiries] DASHBOARD_API_URL or WEBSITE_ENQUIRY_TOKEN is not configured');
    return res.status(503).json({ success: false, message: FAILURE_MESSAGE });
  }

  const { name, company, email, phone, enquiryType, requirement, message } = req.body;
  const payload = {
    name,
    company: company || '',
    email,
    phone,
    enquiryType,
    requirement,
    message: message || '',
    source: 'website',
  };

  try {
    const response = await fetch(`${dashboardApiUrl}/api/enquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-website-enquiry-token': websiteEnquiryToken,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      console.error('[enquiries] dashboard rejected enquiry:', response.status, data.message);
      const status = response.status === 400 ? 400 : 502;
      return res.status(status).json({ success: false, message: FAILURE_MESSAGE });
    }

    return res.status(201).json({ success: true, id: data.id });
  } catch (err) {
    console.error('[enquiries] forwarding to dashboard failed:', err.message);
    return res.status(502).json({ success: false, message: FAILURE_MESSAGE });
  }
};
