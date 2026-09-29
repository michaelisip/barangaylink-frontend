import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

const statusColor = {
  Reported: 'bg-red-100 text-red-800',
  'Under Review': 'bg-yellow-100 text-yellow-800',
  Resolved: 'bg-green-100 text-green-800',
  Dismissed: 'bg-gray-100 text-gray-700',
};

export default function AdminIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ status: '', admin_response: '' });

  const fetchIncidents = () => {
    api.get('/admin/incidents').then(r => { setIncidents(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchIncidents(); }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/incidents/${selected.id}/status`, form);
      toast.success('Incident status updated!');
      setSelected(null);
      fetchIncidents();
    } catch { toast.error('Update failed'); }
  };

  return (
    <AdminLayout>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Incident Reports</h2>

        <div className="grid gap-4">
          {loading && <p className="text-gray-400">Loading...</p>}
          {incidents.map(inc => (
            <div key={inc.id} className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">{inc.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[inc.status]}`}>{inc.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">📍 {inc.location}</p>
                  <p className="text-sm text-gray-600 mb-2">{inc.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>👤 {inc.user?.name}</span>
                    <span>📱 {inc.user?.phone}</span>
                    <span>📅 {new Date(inc.created_at).toLocaleDateString()}</span>
                  </div>
                  {inc.admin_response && (
                    <div className="mt-2 bg-blue-50 rounded-lg p-2 text-xs text-blue-700">
                      <span className="font-medium">Response: </span>{inc.admin_response}
                    </div>
                  )}
                </div>
                <button onClick={() => { setSelected(inc); setForm({ status: inc.status, admin_response: inc.admin_response || '' }); }}
                  className="ml-4 text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition">
                  Respond
                </button>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Respond to Incident</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>Reported</option><option>Under Review</option><option>Resolved</option><option>Dismissed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Official Response</label>
                  <textarea value={form.admin_response} onChange={e => setForm({...form, admin_response: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" rows={4}
                    placeholder="Describe the action taken or response to this incident..." />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setSelected(null)} className="flex-1 border border-gray-300 py-2.5 rounded-xl hover:bg-gray-50 transition">Cancel</button>
                  <button type="submit" className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl hover:bg-orange-600 transition">Submit Response</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}