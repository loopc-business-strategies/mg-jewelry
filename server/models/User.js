const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const addressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  pincode: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [
        'customer', 'wholesale_pending', 'wholesale_customer',
        'admin', 'super_admin', 'catalog_manager', 'order_manager',
        'sales_manager', 'wholesale_manager', 'content_manager',
      ],
      default: 'customer',
    },
    addresses: [addressSchema],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
