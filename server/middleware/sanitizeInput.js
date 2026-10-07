// Strips MongoDB operator keys ("$ne", "a.b") from user input so request
// values can never be interpreted as query operators.
const isUnsafeKey = (key) => key.startsWith('$') || key.includes('.');

const stripUnsafeKeys = (value) => {
  if (Array.isArray(value)) {
    value.forEach(stripUnsafeKeys);
  } else if (value && typeof value === 'object') {
    Object.keys(value).forEach((key) => {
      if (isUnsafeKey(key)) delete value[key];
      else stripUnsafeKeys(value[key]);
    });
  }
  return value;
};

const sanitizeInput = (req, res, next) => {
  if (req.body) stripUnsafeKeys(req.body);
  next();
};

module.exports = { sanitizeInput, stripUnsafeKeys };
