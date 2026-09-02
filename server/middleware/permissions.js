const ADMIN_ROLES = [
  'super_admin',
  'admin',
  'catalog_manager',
  'order_manager',
  'sales_manager',
  'wholesale_manager',
  'content_manager',
];

const ROLE_PERMISSIONS = {
  super_admin: ['*'],
  admin: ['*'],
  catalog_manager: ['products', 'categories', 'reviews'],
  order_manager: ['orders', 'shipping', 'invoices'],
  sales_manager: ['orders', 'customers', 'coupons'],
  wholesale_manager: ['wholesale', 'inquiries'],
  content_manager: ['blog', 'settings'],
};

const hasPermission = (role, permission) => {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes('*') || perms.includes(permission);
};

const requirePermission = (permission) => (req, res, next) => {
  if (!req.user || !ADMIN_ROLES.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Admin access required', code: 'FORBIDDEN' });
  }
  if (!hasPermission(req.user.role, permission)) {
    return res.status(403).json({ success: false, message: 'Insufficient permissions', code: 'FORBIDDEN' });
  }
  next();
};

const isAdminRole = (role) => ADMIN_ROLES.includes(role);

module.exports = { ADMIN_ROLES, ROLE_PERMISSIONS, hasPermission, requirePermission, isAdminRole };
