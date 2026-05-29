import { useState } from 'react';
import useAuthStore from '../store/authStore';
import api from '../lib/api';

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.put('/api/users/me', { name });
      await fetchMe();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-6 pb-6 border-b border-gray-100">
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 rounded-lg px-4 py-3 mb-4 text-sm">
            Profile updated successfully!
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
