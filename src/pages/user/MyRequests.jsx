import { useEffect, useState } from 'react';
import UserLayout from '../../components/UserLayout';
import api from '../../utils/axios';

const statusColor = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Ready: 'bg-green-100 text-green-800',
  Released: 'bg-gray-100 text-gray-700',
  Rejected: 'bg-red-100 text-red-800',
};

const statusIcon = {
  Pending: '⏳', Processing: '⚙️', Ready: '✅', Released: '📦', Rejected: '❌'
};

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/documents').then(r => { setRequests(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <UserLayout>
      <div className="md:ml-56 p-4 max-w-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-5">My Document Requests</h2>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {!loading && requests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500">No document requests yet.</p>
          </div>
        )}

        <div className="space-y-3">
          {requests.map(req => (
            <div key={req.id} className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{req.document_type}</p>
                  <p className="text-xs text-gray-500">Purpose: {req.purpose}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[req.status]}`}>
                  {statusIcon[req.status]} {req.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>📌 {req.tracking_code}</span>
                <span>{new Date(req.created_at).toLocaleDateString()}</span>
              </div>
              {req.remarks && (
                <div className="mt-2 bg-gray-50 rounded-lg p-2 text-xs text-gray-600">
                  <span className="font-medium">Remarks: </span>{req.remarks}
                </div>
              )}
              {req.status === 'Ready' && (
                <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-2 text-xs text-green-700">
                  🎉 Your document is ready! Please visit the Barangay Hall to claim it.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}