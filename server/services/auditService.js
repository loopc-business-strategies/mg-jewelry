const AuditLog = require('../models/AuditLog');

const logAction = async ({ userId, action, entity, entityId, metadata, ip }) => {
  try {
    await AuditLog.create({ userId, action, entity, entityId, metadata, ip });
  } catch (err) {
    console.error('Audit log failed:', err.message);
  }
};

module.exports = { logAction };
