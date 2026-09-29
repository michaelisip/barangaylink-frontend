import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

export default function AdminResidents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    full_name: '', birthdate: '', gender: '', address: '', purok: '',
    phone: '', email: '', civil_status: '', income_class: 'Lower Class', is_voter: false, occupation: ''
  });

  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const fetchResidents = () => {
    const params = new URLSearchParams();
    if (filter) params.set('income_class', filter);
    if (search) params.set('search', search);
    api.get(`/admin/residents?${params}`).then(r => { setResidents(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchResidents(); }, [filter, search]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/residents', form);
      toast.success('Resident added!');
      setShowForm(false);
      fetchResidents();
    } catch { toast.error('Failed to add resident'); }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!importFile) {
      toast.error('Choose a CSV or Excel file first.');
      return;
    }
    setImporting(true);
    const body = new FormData();
    body.append('file', importFile);
    try {
      const { data } = await api.post('/admin/residents/import', body);
      const n = data.notifications;
      toast.success(`Imported ${data.imported} resident(s). Email: ${n.email_sent}, SMS: ${n.sms_sent}`);
      setImportOpen(false);
      setImportFile(null);
      fetchResidents();
    } catch (err) {
      const msg = err.response?.data?.message;
      const rows = err.response?.data?.errors;
      if (Array.isArray(rows) && rows.length) {
        toast.error(`${msg || 'Validation failed'} — row ${rows[0].row}: ${rows[0].messages?.join('; ') || ''}`);
      } else {
        toast.error(msg || 'Import failed');
      }
    } finally {
      setImporting(false);
    }
  };

  const clusterColors = {
    'Lower Class': 'bg-green-100 text-green-800',
    'Middle Class': 'bg-yellow-100 text-yellow-800',
    'Upper Class': 'bg-purple-100 text-purple-800',
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Resident Management</h2>
          <div className="flex flex-wrap gap-2">
            <a
              href="/samples/residents_import_sample.csv"
              download
              className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition text-sm font-semibold"
            >
              Sample CSV
            </a>
            <button type="button" onClick={() => setImportOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition text-sm font-semibold">
              Import CSV / Excel
            </button>
            <button type="button" onClick={() => setShowForm(true)} className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition text-sm font-semibold">
              + Add Resident
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-5">
          <input type="text" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 max-w-xs" />
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Classes</option>
            <option>Lower Class</option><option>Middle Class</option><option>Upper Class</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Name','Gender','Purok','Civil Status','Income Class','Voter','Occupation'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr>}
                {residents.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{r.full_name}</p>
                      <p className="text-xs text-gray-500">{r.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{r.gender}</td>
                    <td className="px-4 py-3 text-gray-600">{r.purok}</td>
                    <td className="px-4 py-3 text-gray-600">{r.civil_status}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${clusterColors[r.income_class]}`}>{r.income_class}</span>
                    </td>
                    <td className="px-4 py-3">{r.is_voter ? '✅' : '❌'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.occupation || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl my-4">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Add New Resident</h3>
              <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
                {[
                  ['full_name','Full Name','text',true],['birthdate','Birthdate','date',true],
                  ['phone','Phone','text',false],['email','Email','email',false],['occupation','Occupation','text',false],
                  ['address','Address','text',true],
                ].map(([key, label, type, req]) => (
                  <div key={key} className={key === 'address' ? 'col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type={type} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" required={req} />
                  </div>
                ))}
                {[
                  ['gender','Gender',['Male','Female','Other']],
                  ['purok','Purok',['Purok 1','Purok 2','Purok 3','Purok 4','Purok 5','Purok 6','Purok 7','Purok 8']],
                  ['civil_status','Civil Status',['Single','Married','Widowed','Separated']],
                  ['income_class','Income Class',['Lower Class','Middle Class','Upper Class']],
                ].map(([key, label, opts]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <select value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" required>
                      <option value="">Select...</option>
                      {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_voter} onChange={e => setForm({...form, is_voter: e.target.checked})} className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Registered Voter</span>
                  </label>
                </div>
                <div className="col-span-2 flex gap-3 mt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 py-2.5 rounded-xl hover:bg-gray-50 transition">Cancel</button>
                  <button type="submit" className="flex-1 bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 transition">Add Resident</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Import modal */}
        {importOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl my-4">
              <h3 className="font-bold text-gray-800 text-lg mb-2">Import residents</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload a CSV or Excel file with a header row. Required columns: full_name, birthdate, gender, address, purok, civil_status, income_class.
                Optional: phone, email, is_voter (yes/no, true/false, 1/0), occupation.
              </p>
              <form onSubmit={handleImport} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File (.csv, .xlsx)</label>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-700"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setImportOpen(false); setImportFile(null); }} className="flex-1 border border-gray-300 py-2.5 rounded-xl hover:bg-gray-50 transition text-sm font-medium">
                    Cancel
                  </button>
                  <button type="submit" disabled={importing} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition text-sm font-semibold disabled:opacity-60">
                    {importing ? 'Importing…' : 'Upload & import'}
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