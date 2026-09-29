import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/axios';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="font-bold text-red-700 mb-2">Dashboard Error</h3>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Safe defaults if data is missing
  const docStatusData = Object.entries(stats?.document_status || {}).map(([name, value]) => ({ name, value: Number(value) }));
  const incidentData = Object.entries(stats?.incident_categories || {}).map(([name, value]) => ({ name, value: Number(value) }));
  const clusterData = Object.entries(stats?.income_clusters || {}).map(([name, value]) => ({ name, value: Number(value) }));
  const docTypeData = Object.entries(stats?.document_types || {}).map(([name, value]) => ({ name, value: Number(value) }));
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlyData = months.map((name, i) => ({ name, requests: stats?.monthly_requests?.[i + 1] || 0 }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { label: 'Registered Users', value: stats?.total_users || 0, icon: '👥', color: 'bg-blue-500' },
            { label: 'Total Residents', value: stats?.total_residents || 0, icon: '🏠', color: 'bg-green-500' },
            { label: 'Doc Requests', value: stats?.total_document_requests || 0, icon: '📄', color: 'bg-purple-500' },
            { label: 'Pending Docs', value: stats?.pending_requests || 0, icon: '⏳', color: 'bg-yellow-500' },
            { label: 'Incidents', value: stats?.total_incidents || 0, icon: '🚨', color: 'bg-red-500' },
            { label: 'Open Incidents', value: stats?.pending_incidents || 0, icon: '⚠️', color: 'bg-orange-500' },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border">
              <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center text-lg mb-3`}>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-bold text-gray-700 mb-4">Monthly Document Requests (2026)</h3>
            {monthlyData.some(d => d.requests > 0) ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
                No document requests yet
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-bold text-gray-700 mb-4">Document Status Distribution</h3>
            {docStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={docStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {docStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
                No document requests yet
              </div>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Population Clusters */}
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-bold text-gray-700 mb-4">📊 Population Clusters</h3>
            {clusterData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={clusterData} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#8b5cf6" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-1">
                  {clusterData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full"
                          style={{ background: ['#10b981', '#f59e0b', '#8b5cf6'][i] }} />
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-gray-400 text-sm">
                No resident data yet
              </div>
            )}
          </div>

          {/* Incident Categories */}
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-bold text-gray-700 mb-4">Incident Categories</h3>
            {incidentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={incidentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={90} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
                No incidents reported yet
              </div>
            )}
          </div>

          {/* Document Types */}
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-bold text-gray-700 mb-4">Document Types Requested</h3>
            {docTypeData.length > 0 ? (
              <div className="space-y-3">
                {docTypeData.map((item, i) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 text-xs">{item.name}</span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(item.value / (stats?.total_document_requests || 1)) * 100}%`,
                          background: COLORS[i]
                        }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                No document requests yet
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}