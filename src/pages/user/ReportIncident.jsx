import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../../components/UserLayout';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'Fight/Altercation', icon: '👊', color: 'border-red-300 bg-red-50' },
  { value: 'Uncollected Garbage', icon: '🗑️', color: 'border-yellow-300 bg-yellow-50' },
  { value: 'Noise Complaint', icon: '📢', color: 'border-orange-300 bg-orange-50' },
  { value: 'Illegal Parking', icon: '🚗', color: 'border-purple-300 bg-purple-50' },
  { value: 'Broken Street Light', icon: '💡', color: 'border-blue-300 bg-blue-50' },
  { value: 'Flooding', icon: '🌊', color: 'border-cyan-300 bg-cyan-50' },
  { value: 'Other', icon: '⚠️', color: 'border-gray-300 bg-gray-50' },
];

export default function ReportIncident() {
  const [form, setForm] = useState({ category: '', location: '', description: '' });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (photo) data.append('photo', photo);

      await api.post('/incidents', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Incident reported successfully!');
      navigate('/my-reports');
    } catch (err) {
      toast.error('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="md:ml-56 p-4 max-w-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Report an Incident</h2>
        <p className="text-sm text-gray-500 mb-5">Help keep our barangay safe and clean.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Select Incident Type</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button type="button" key={cat.value} onClick={() => setForm({...form, category: cat.value})}
                  className={`p-3 rounded-xl border-2 text-center transition ${form.category === cat.value ? 'border-blue-500 bg-blue-50' : `${cat.color} border`}`}>
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <p className="text-xs font-medium text-gray-700">{cat.value}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g. Near Purok 3 Basketball Court" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              rows={4} placeholder="Describe the incident in detail..." required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo (Optional)</label>
            <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <button type="submit" disabled={loading || !form.category || !form.location || !form.description}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50">
            {loading ? 'Submitting...' : '🚨 Submit Report'}
          </button>
        </form>
      </div>
    </UserLayout>
  );
}