import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, LogOut, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../common/Alert';
import LoadingSpinner from '../common/LoadingSpinner';

const Profile = () => {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      setError('Failed to log out');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!displayName.trim()) {
      setError('Display name cannot be empty');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await updateUserProfile(displayName);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setDisplayName(currentUser?.displayName || '');
    setIsEditing(false);
    setError('');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Profile
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
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
                message={success}
                onClose={() => setSuccess('')}
              />
            </div>
          )}

          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {currentUser?.displayName || 'User'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentUser?.email}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Account Information
              </h3>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label
                      htmlFor="displayName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Display Name
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="input-field"
                      disabled={loading}
                      aria-required="true"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={loading}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Display Name
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {currentUser?.displayName || 'Not set'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Email Address
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {currentUser?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Account Created
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(currentUser?.metadata?.creationTime)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Authentication Provider
              </h3>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                {currentUser?.providerData?.[0]?.providerId === 'google.com' ? (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-gray-900 dark:text-gray-100">
                      Google
                    </span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100">
                      Email/Password
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
