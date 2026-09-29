import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await loginAdmin(form.email, form.password);
    toast.success('Welcome, Official!');
    queueMicrotask(() => navigate('/admin/dashboard', { replace: true }));
  } catch (err) {
    toast.error(err.response?.data?.message || 'Invalid credentials');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/catalina.jpg')" }} />
      <div className="fixed inset-0 bg-black/70" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-900/95 backdrop-blur rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="text-center mb-6">
            <img src="/logo.png" alt="Sta. Catalina Logo" className="w-14 h-14 rounded-full object-cover mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white">Official Login</h2>
            <p className="text-gray-400 text-sm">Barangay Sta. Catalina Admin Portal</p>
            <div className="mt-2 px-3 py-1 bg-yellow-600/20 border border-yellow-600/40 rounded-full inline-block">
              <span className="text-yellow-400 text-xs font-medium">🔒 Restricted Access</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Official Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="official@stcatalina.gov.ph" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-yellow-600 text-white py-3 rounded-xl font-semibold hover:bg-yellow-700 transition disabled:opacity-50">
              {loading ? 'Authenticating...' : 'Login as Official'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-gray-400 hover:text-gray-300">
              ← Resident Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}