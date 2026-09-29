import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

const statusColor = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Ready: 'bg-green-100 text-green-800',
  Released: 'bg-gray-100 text-gray-700',
  Rejected: 'bg-red-100 text-red-800',
};

export default function AdminDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateForm, setUpdateForm] = useState({ status: '', remarks: '', or_number: '' });

  const fetchDocs = () => {
    const params = filter ? `?status=${filter}` : '';
    api.get(`/admin/documents${params}`).then(r => { setDocs(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchDocs(); }, [filter]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.put(`/admin/documents/${selected.id}/status`, updateForm);
      toast.success('Status updated & SMS sent!');
      setSelected(null);
      fetchDocs();
    } catch {
      toast.error('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Document Requests</h2>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option>Pending</option><option>Processing</option><option>Ready</option><option>Released</option><option>Rejected</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Resident</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Document</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Purpose</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Tracking Code</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr>}
                {!loading && docs.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-gray-400">No document requests found.</td></tr>}
                {docs.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{doc.user?.name}</p>
                      <p className="text-xs text-gray-500">{doc.user?.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{doc.document_type}</td>
                    <td className="px-4 py-3 text-gray-600">{doc.purpose}</td>
                    <td className="px-4 py-3 font-mono text-xs text-blue-600">{doc.tracking_code}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[doc.status]}`}>{doc.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(doc.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => { setSelected(doc); setUpdateForm({ status: doc.status, remarks: doc.remarks || '', or_number: doc.or_number || '' }); }}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="font-bold text-gray-800 text-lg mb-1">Update Document Status</h3>
              <p className="text-sm text-gray-500 mb-4">{selected.document_type} — {selected.user?.name}</p>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={updateForm.status} onChange={e => setUpdateForm({...updateForm, status: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Pending</option><option>Processing</option><option>Ready</option><option>Released</option><option>Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OR Number (if applicable)</label>
                  <input type="text" value={updateForm.or_number} onChange={e => setUpdateForm({...updateForm, or_number: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                  <textarea value={updateForm.remarks} onChange={e => setUpdateForm({...updateForm, remarks: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3} />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setSelected(null)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl hover:bg-gray-50 transition">Cancel</button>
                  <button type="submit" disabled={updating} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                    {updating ? 'Updating...' : 'Update & Notify'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}