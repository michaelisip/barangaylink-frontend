import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserLayout from '../../components/UserLayout';
import api from '../../utils/axios';

export default function UserDashboard() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    api.get('/announcements').then(r => setAnnouncements(r.data)).catch(() => {});
    api.get('/documents').then(r => setMyRequests(r.data)).catch(() => {});
  }, []);

  const statusColor = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Processing: 'bg-blue-100 text-blue-800',
    Ready: 'bg-green-100 text-green-800',
    Released: 'bg-gray-100 text-gray-700',
    Rejected: 'bg-red-100 text-red-800',
  };

  return (
    <UserLayout>
      <div className="md:ml-56 p-4 max-w-4xl">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-5 text-white mb-5">
          <h2 className="text-xl font-bold">Good day, {user?.name?.split(' ')[0]}! 👋</h2>
          <p className="text-blue-200 text-sm mt-1">{user?.purok} • {user?.income_class}</p>
          {user?.is_voter && <span className="mt-2 inline-block bg-white/20 text-xs px-2 py-0.5 rounded-full">✓ Registered Voter</span>}
        </div>

        {/* Quick Actions */}
        <h3 className="font-bold text-gray-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { to: '/request-document', icon: '📄', label: 'Request Document', color: 'bg-blue-50 border-blue-200' },
            { to: '/track', icon: '🔍', label: 'Track Request', color: 'bg-green-50 border-green-200' },
            { to: '/report-incident', icon: '🚨', label: 'Report Issue', color: 'bg-red-50 border-red-200' },
            { to: '/my-reports', icon: '📝', label: 'My Reports', color: 'bg-purple-50 border-purple-200' },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className={`${item.color} border rounded-xl p-4 text-center hover:shadow-md transition`}>
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-xs font-medium text-gray-700">{item.label}</p>
            </Link>
          ))}
        </div>

        {/* Recent Requests */}
        {myRequests.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-700">Recent Requests</h3>
              <Link to="/my-requests" className="text-xs text-blue-600 hover:underline">View all →</Link>
            </div>
            <div className="space-y-2">
              {myRequests.slice(0, 3).map(req => (
                <div key={req.id} className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-800">{req.document_type}</p>
                    <p className="text-xs text-gray-500">#{req.tracking_code}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[req.status]}`}>{req.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Announcements */}
        <h3 className="font-bold text-gray-700 mb-3">📢 Announcements</h3>
        <div className="space-y-3">
          {announcements.length === 0 && <p className="text-gray-400 text-sm">No announcements yet.</p>}
          {announcements.map(ann => (
            <div key={ann.id} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${ann.priority === 'Emergency' ? 'border-red-500' : ann.priority === 'Urgent' ? 'border-yellow-500' : 'border-blue-500'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ann.priority === 'Emergency' ? 'bg-red-100 text-red-700' : ann.priority === 'Urgent' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                  {ann.priority}
                </span>
                <span className="text-sm font-semibold text-gray-800">{ann.title}</span>
              </div>
              <p className="text-xs text-gray-600">{ann.content}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(ann.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}