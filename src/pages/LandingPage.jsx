import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user, admin, loading: authLoading, logout } = useAuth();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    api.get('/announcements').then(r => setAnnouncements(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/catalina.jpg')" }}
      />
      <div className="fixed inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
            <img
  src="/logo.png"
  alt="Sta. Catalina Logo"
  className="w-24 h-24 object-cover rounded-full mx-auto mb-4 drop-shadow-2xl border-4 border-white/50"
/>
              <div>
                <h1 className="text-white font-bold text-sm md:text-base">Barangay Sta. Catalina</h1>
                <p className="text-white/70 text-xs">Lubao, Pampanga</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {!authLoading && admin && (
                <>
                  <Link to="/admin/dashboard" className="px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">Admin</Link>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="px-3 py-1.5 text-sm bg-white/15 text-white rounded-lg hover:bg-white/25 transition"
                  >
                    Logout
                  </button>
                </>
              )}
              {!authLoading && !admin && user && (
                <>
                  <Link to="/dashboard" className="px-3 py-1.5 text-sm text-white border border-white/40 rounded-lg hover:bg-white/20 transition">Dashboard</Link>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="px-3 py-1.5 text-sm bg-white/15 text-white rounded-lg hover:bg-white/25 transition"
                  >
                    Logout
                  </button>
                </>
              )}
              {!authLoading && !user && !admin && (
                <>
                  <Link to="/login" className="px-3 py-1.5 text-sm text-white border border-white/40 rounded-lg hover:bg-white/20 transition">Login</Link>
                  <Link to="/register" className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Register</Link>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-10 max-w-2xl w-full">
           <img
  src="/logo.png"
  alt="Sta. Catalina Logo"
  className="w-12 h-12 object-cover rounded-full drop-shadow-md border-2 border-white/50"
/>
            <h2 className="text-white text-2xl md:text-4xl font-bold mb-2">Welcome to</h2>
            <h3 className="text-blue-300 text-xl md:text-3xl font-bold mb-4">Sta. Catalina E-Services</h3>
            <p className="text-white/80 text-sm md:text-base mb-8">Request barangay documents online, track your requests in real-time, and report community issues — all from the comfort of your home.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { icon: '📄', label: 'Clearance' },
                { icon: '🏠', label: 'Residency' },
                { icon: '💚', label: 'Indigency' },
                { icon: '🗳️', label: "Voter's Cert" },
              ].map(item => (
                <div key={item.label} className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="text-white/90 text-xs">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {user && !admin ? (
                <Link to="/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">Go to Dashboard</Link>
              ) : admin ? (
                <Link to="/admin/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">Admin Dashboard</Link>
              ) : (
                <Link to="/register" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">Get Started</Link>
              )}
              <Link to="/track" className="px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition">Track Request</Link>
            </div>
          </div>

          {/* Announcements */}
          {announcements.length > 0 && (
            <div className="mt-8 max-w-2xl w-full">
              <h4 className="text-white font-bold text-lg mb-3">📢 Latest Announcements</h4>
              <div className="space-y-3">
                {announcements.slice(0, 3).map(ann => (
                  <div key={ann.id} className={`bg-white/10 backdrop-blur-sm border rounded-xl p-4 text-left ${ann.priority === 'Emergency' ? 'border-red-400' : ann.priority === 'Urgent' ? 'border-yellow-400' : 'border-white/20'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ann.priority === 'Emergency' ? 'bg-red-500/30 text-red-300' : ann.priority === 'Urgent' ? 'bg-yellow-500/30 text-yellow-300' : 'bg-green-500/30 text-green-300'}`}>
                        {ann.priority}
                      </span>
                      <span className="text-white font-semibold text-sm">{ann.title}</span>
                    </div>
                    <p className="text-white/70 text-xs">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <footer className="text-center py-4 text-white/50 text-xs">
          © 2026 Barangay Sta. Catalina, Lubao Pampanga. All rights reserved.
        </footer>
      </div>
    </div>
  );
}