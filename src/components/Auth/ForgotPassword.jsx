import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../common/Alert';
import LoadingSpinner from '../common/LoadingSpinner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setError('');
      setSuccess(false);
      setLoading(true);
      await resetPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError(err.message || 'Failed to send password reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
            <KeyRound className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Forgot Password?
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            No worries, we'll send you reset instructions
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        {success && (
          <div className="mb-6">
            <Alert
              type="success"
              message="Password reset email sent! Check your inbox for instructions."
              onClose={() => setSuccess(false)}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="you@example.com"
                disabled={loading}
                aria-required="true"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter the email associated with your account
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Send Reset Link
              </>
            )}
          </button>
        </form>

        <div className="mt-6">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>

        {success && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Didn't receive the email?</strong>
              <br />
              Check your spam folder or try again in a few minutes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
