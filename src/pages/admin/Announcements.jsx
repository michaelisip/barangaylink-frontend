import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', priority: 'Normal' });
  const [loading, setLoading] = useState(false);

  const fetch = () => api.get('/announcements').then(r => setAnnouncements(r.data)).catch(() => {});
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/announcements', form);
      toast.success('Announcement published!');
      setForm({ title: '', content: '', priority: 'Normal' });
      fetch();
    } catch { toast.error('Failed to publish'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/admin/announcements/${id}`);
      toast.success('Deleted');
      fetch();
    } catch { toast.error('Delete failed'); }
  };

  const priorityColor = {
    Normal: 'border-blue-300 bg-blue-50',
    Urgent: 'border-yellow-300 bg-yellow-50',
    Emergency: 'border-red-300 bg-red-50'
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Announcements</h2>

        <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">Post New Announcement</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Announcement title" required />
            <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4} placeholder="Write your announcement here..." required />
            <div className="flex gap-3">
              <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Normal</option><option>Urgent</option><option>Emergency</option>
              </select>
              <button type="submit" disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                {loading ? 'Publishing...' : '📢 Publish'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-3">
          {announcements.map(ann => (
            <div key={ann.id} className={`rounded-xl border-l-4 p-4 ${priorityColor[ann.priority]}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ann.priority === 'Emergency' ? 'bg-red-200 text-red-800' : ann.priority === 'Urgent' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}`}>
                      {ann.priority}
                    </span>
                    <span className="font-semibold text-gray-800">{ann.title}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{ann.content}</p>
                  <p className="text-xs text-gray-400">{new Date(ann.created_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleDelete(ann.id)} className="ml-4 text-red-400 hover:text-red-600 text-lg">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}