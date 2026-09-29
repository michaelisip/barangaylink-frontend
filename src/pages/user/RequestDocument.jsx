import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../../components/UserLayout';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

const DOC_TYPES = [
  { value: 'Barangay Clearance', icon: '📋', desc: 'For employment, business permits, and legal purposes', fee: 50 },
  { value: 'Certificate of Indigency', icon: '💚', desc: 'For medical assistance, scholarships, and aid applications', fee: 0 },
  { value: 'Certificate of Residency', icon: '🏠', desc: 'To prove you reside in Barangay Sta. Catalina', fee: 30 },
  { value: "Voter's Certificate", icon: '🗳️', desc: 'To certify your voter registration in the barangay', fee: 30 },
];

const PURPOSES = [
  'Employment', 'Business Permit', 'Scholarship', 'Medical Assistance',
  'Legal Purposes', 'Loan Application', 'Travel Abroad', 'School Requirement', 'Other'
];

export default function RequestDocument() {
  const [selected, setSelected] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const selectedDoc = DOC_TYPES.find(d => d.value === selected);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) { toast.error('Please select a document type'); return; }
    setLoading(true);
    try {
      const res = await api.post('/documents', { document_type: selected, purpose });
      setSuccess(res.data);
      toast.success('Document request submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <UserLayout>
        <div className="md:ml-56 p-4 max-w-lg mx-auto text-center">
          <div className="bg-white rounded-2xl shadow p-8 mt-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Request Submitted!</h2>
            <p className="text-gray-600 mb-4">Your document request has been received.</p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600">Tracking Code</p>
              <p className="text-2xl font-bold text-green-700">{success.tracking_code}</p>
              <p className="text-xs text-gray-500 mt-1">Save this code to track your request</p>
            </div>
            <p className="text-sm text-gray-500 mb-6">📱 An SMS notification has been sent to your registered phone number.</p>
            <div className="flex gap-3">
              <button onClick={() => setSuccess(null)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl hover:bg-gray-50 transition text-sm">New Request</button>
              <button onClick={() => navigate('/my-requests')} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition text-sm">View My Requests</button>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="md:ml-56 p-4 max-w-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Request a Document</h2>
        <p className="text-gray-500 text-sm mb-5">Select the document you need and provide the purpose.</p>

        <form onSubmit={handleSubmit}>
          {/* Document Type Selection */}
          <h3 className="font-semibold text-gray-700 mb-3">1. Choose Document Type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {DOC_TYPES.map(doc => (
              <button type="button" key={doc.value} onClick={() => setSelected(doc.value)}
                className={`p-4 rounded-xl border-2 text-left transition ${selected === doc.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">{doc.icon}</span>
                  <span className="font-semibold text-sm text-gray-800">{doc.value}</span>
                </div>
                <p className="text-xs text-gray-500">{doc.desc}</p>
                <p className="text-xs font-medium mt-2 text-blue-600">Fee: {doc.fee === 0 ? 'FREE' : `₱${doc.fee}.00`}</p>
              </button>
            ))}
          </div>

          {/* Purpose */}
          <h3 className="font-semibold text-gray-700 mb-3">2. State Your Purpose</h3>
          <select value={purpose} onChange={e => setPurpose(e.target.value)} required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6">
            <option value="">Select purpose of request</option>
            {PURPOSES.map(p => <option key={p}>{p}</option>)}
          </select>

          {/* Summary */}
          {selected && purpose && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">Request Summary</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between"><span className="text-gray-600">Document:</span><span className="font-medium">{selected}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Purpose:</span><span className="font-medium">{purpose}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Fee:</span><span className="font-medium text-blue-700">{selectedDoc?.fee === 0 ? 'FREE' : `₱${selectedDoc?.fee}.00`}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Processing:</span><span className="font-medium">3-5 business days</span></div>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading || !selected || !purpose}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </UserLayout>
  );
}