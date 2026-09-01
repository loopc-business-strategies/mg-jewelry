import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

export default function ForgotPasswordPage() {
  return (
    <>
      <SEOHead title="Forgot Password" path="/forgot-password" />
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <h1 className="font-display text-3xl mb-4">Reset Password</h1>
          <p className="text-muted mb-6">Enter your email and we'll send you a reset link.</p>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email address" required className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold" />
            <button type="submit" className="w-full btn-primary-gold justify-center text-xs py-3">Send Reset Link</button>
          </form>
          <Link to="/login" className="text-sm text-gold-dark hover:underline mt-4 inline-block">Back to Login</Link>
        </div>
      </div>
    </>
  );
}
