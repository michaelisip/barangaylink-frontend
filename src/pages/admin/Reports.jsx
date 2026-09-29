import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/axios';

const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899'];

export default function AdminReports() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data)).catch(() => {});
  }, []);

  if (!stats) return <AdminLayout><p className="text-gray-400 p-6">Loading reports...</p></AdminLayout>;

  const clusterData = Object.entries(stats.income_clusters || {}).map(([name, value]) => ({ name, value }));
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlyData = months.map((name, i) => ({ name, requests: stats.monthly_requests?.[i+1] || 0 }));
  const incidentData = Object.entries(stats.incident_categories || {}).map(([name, value]) => ({ name, value }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
          <button onClick={() => window.print()} className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-700 transition">
            🖨️ Print Report
          </button>
        </div>

        {/* Summary Table */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-bold text-gray-700 mb-4">📋 Barangay Summary Report</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Registered Users', value: stats.total_users },
              { label: 'Total Residents', value: stats.total_residents },
              { label: 'Total Doc Requests', value: stats.total_document_requests },
              { label: 'Total Incidents', value: stats.total_incidents },
            ].map(item => (
              <div key={item.label} className="text-center bg-gray-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-blue-700">{item.value}</p>
                <p className="text-xs text-gray-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Population Cluster Table */}
          <h4 className="font-semibold text-gray-700 mb-3">👥 Population Cluster Analysis</h4>
          <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden mb-6">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Income Class</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Count</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Percentage</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Description</th>
              </tr>
            </thead>
            <tbody>
              {clusterData.map(item => (
                <tr key={item.name} className="border-t border-gray-100">
                  <td className="px-4 py-2.5 font-medium">{item.name}</td>
                  <td className="px-4 py-2.5">{item.value}</td>
                  <td className="px-4 py-2.5">{((item.value / (stats.total_users || 1)) * 100).toFixed(1)}%</td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">
                    {item.name === 'Lower Class' ? 'Monthly income below ₱21,194' :
                     item.name === 'Middle Class' ? 'Monthly income ₱21,194 – ₱127,164' :
                     'Monthly income above ₱127,164'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Document Status Table */}
          <h4 className="font-semibold text-gray-700 mb-3">📄 Document Requests by Status</h4>
          <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Count</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.document_status || {}).map(([status, count]) => (
                <tr key={status} className="border-t border-gray-100">
                  <td className="px-4 py-2.5 font-medium">{status}</td>
                  <td className="px-4 py-2.5">{count}</td>
                  <td className="px-4 py-2.5">{((count / (stats.total_document_requests || 1)) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-bold text-gray-700 mb-4">Population by Income Cluster</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={clusterData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`}>
                  <Cell fill="#10b981" /><Cell fill="#f59e0b" /><Cell fill="#8b5cf6" />
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-bold text-gray-700 mb-4">Monthly Requests Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="requests" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}