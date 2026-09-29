import { useEffect, useState } from 'react';
import UserLayout from '../../components/UserLayout';
import api from '../../utils/axios';

const statusColor = {
  Reported: 'bg-red-100 text-red-800',
  'Under Review': 'bg-yellow-100 text-yellow-800',
  Resolved: 'bg-green-100 text-green-800',
  Dismissed: 'bg-gray-100 text-gray-700',
};

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/incidents').then(r => { setReports(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <UserLayout>
      <div className="md:ml-56 p-4 max-w-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-5">My Incident Reports</h2>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {!loading && reports.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📋</div>
            <p className="text-gray-500">No incident reports yet.</p>
          </div>
        )}

        <div className="space-y-3">
          {reports.map(r => (
            <div key={r.id} className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{r.category}</p>
                  <p className="text-xs text-gray-500">📍 {r.location}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[r.status]}`}>{r.status}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{r.description}</p>
              <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</p>
              {r.admin_response && (
                <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs text-blue-700">
                  <span className="font-medium">Official Response: </span>{r.admin_response}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}