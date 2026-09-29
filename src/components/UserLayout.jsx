import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/dashboard', icon: '🏠', label: 'Home' },
  { path: '/request-document', icon: '📄', label: 'Request' },
  { path: '/my-requests', icon: '📋', label: 'My Docs' },
  { path: '/report-incident', icon: '🚨', label: 'Report' },
  { path: '/my-reports', icon: '📝', label: 'My Reports' },
];

export default function UserLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <header className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
          <span className="font-semibold text-sm">Sta. Catalina</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-200 hidden sm:block">{user?.name}</span>
          <button onClick={logout} className="text-xs bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition">Logout</button>
        </div>
      </header>

      {/* Content */}
      <main className="pb-20 min-h-screen">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.map(item => (
            <Link key={item.path} to={item.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-500'}`}>
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-56 bg-blue-800 flex-col pt-16 z-30">
        <div className="p-4 border-b border-blue-700">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full object-cover mx-auto mb-2" />
          <p className="text-white text-center text-sm font-semibold">{user?.name}</p>
          <p className="text-blue-300 text-center text-xs">{user?.purok}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm ${location.pathname === item.path ? 'bg-white/20 text-white font-semibold' : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-3">
          <button onClick={logout} className="w-full text-blue-200 hover:text-white text-sm py-2 text-left px-3 hover:bg-white/10 rounded-xl transition">
            🚪 Logout
          </button>
        </div>
      </aside>
    </div>
  );
}