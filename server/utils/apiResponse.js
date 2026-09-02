const sendSuccess = (res, data = null, statusCode = 200) => {
  const body = { success: true };
  if (data !== null) body.data = data;
  return res.status(statusCode).json(body);
};

const sendError = (res, message, statusCode = 500, code = 'SERVER_ERROR') => {
  return res.status(statusCode).json({ success: false, message, code });
};

module.exports = { sendSuccess, sendError };
