import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/admin/documents', icon: '📄', label: 'Documents' },
  { path: '/admin/incidents', icon: '🚨', label: 'Incidents' },
  { path: '/admin/residents', icon: '👥', label: 'Residents' },
  { path: '/admin/announcements', icon: '📢', label: 'Announcements' },
  { path: '/admin/reports', icon: '📈', label: 'Reports' },
];

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 flex-col flex fixed h-full z-40">
        <div className="p-4 border-b border-gray-700 text-center">
         <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full object-cover mx-auto mb-2" />
          <p className="text-white text-sm font-semibold">{admin?.name}</p>
          <p className="text-yellow-400 text-xs">{admin?.role}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm ${location.pathname === item.path ? 'bg-yellow-600/20 text-yellow-400 font-semibold border border-yellow-600/30' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-700">
          <button onClick={logout} className="w-full text-gray-400 hover:text-white text-sm py-2 px-3 hover:bg-gray-800 rounded-xl transition flex items-center gap-2">
            🚪 <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-56 flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <h1 className="font-bold text-gray-800">Barangay Sta. Catalina — Admin Portal</h1>
          <span className="text-sm text-gray-500">{new Date().toLocaleDateString('en-PH', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}