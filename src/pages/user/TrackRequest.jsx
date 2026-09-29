import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

const statusSteps = ['Pending', 'Processing', 'Ready', 'Released'];
const statusColor = { Pending: 'text-yellow-600', Processing: 'text-blue-600', Ready: 'text-green-600', Released: 'text-gray-600', Rejected: 'text-red-600' };

export default function TrackRequest() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get(`/track/${code.toUpperCase()}`);
      setResult(res.data);
    } catch {
      toast.error('Tracking code not found');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const currentStep = result ? statusSteps.indexOf(result.status) : -1;

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/catalina.jpg')" }} />
      <div className="fixed inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800">Track Your Request</h2>
            <p className="text-gray-500 text-sm">Enter your tracking code to check the status</p>
          </div>

          <form onSubmit={handleTrack} className="flex gap-2 mb-6">
            <input value={code} onChange={e => setCode(e.target.value)}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              placeholder="e.g. BRG-XXXXXXXX" required />
            <button type="submit" disabled={loading}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition font-semibold disabled:opacity-50">
              {loading ? '...' : 'Track'}
            </button>
          </form>

          {result && (
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-800">{result.document_type}</p>
                  <p className="text-xs text-gray-500">{result.user?.name}</p>
                </div>
                <span className={`font-bold ${statusColor[result.status]}`}>{result.status}</span>
              </div>

              {result.status !== 'Rejected' && (
                <div className="flex items-center gap-1 mb-4">
                  {statusSteps.map((step, i) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`w-full h-2 rounded-full ${i <= currentStep ? 'bg-blue-500' : 'bg-gray-200'}`} />
                      {i < statusSteps.length - 1 && <div className={`w-2 h-2 rounded-full mx-0.5 ${i < currentStep ? 'bg-blue-500' : 'bg-gray-200'}`} />}
                    </div>
                  ))}
                </div>
              )}

              <div className="text-sm space-y-1">
                <div className="flex justify-between"><span className="text-gray-500">Purpose:</span><span>{result.purpose}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Submitted:</span><span>{new Date(result.created_at).toLocaleDateString()}</span></div>
                {result.remarks && <div className="flex justify-between"><span className="text-gray-500">Remarks:</span><span className="text-right">{result.remarks}</span></div>}
              </div>

              {result.status === 'Ready' && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                  ✅ Your document is ready for pickup at the Barangay Hall!
                </div>
              )}
            </div>
          )}

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:underline">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}