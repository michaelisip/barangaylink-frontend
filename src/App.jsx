import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// User Pages
import LandingPage from './pages/LandingPage';
import UserLogin from './pages/auth/UserLogin';
import UserRegister from './pages/auth/UserRegister';
import UserDashboard from './pages/user/Dashboard';
import RequestDocument from './pages/user/RequestDocument';
import MyRequests from './pages/user/MyRequests';
import TrackRequest from './pages/user/TrackRequest';
import ReportIncident from './pages/user/ReportIncident';
import MyReports from './pages/user/MyReports';

// Admin Pages
import AdminLogin from './pages/auth/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import AdminDocuments from './pages/admin/Documents';
import AdminIncidents from './pages/admin/Incidents';
import AdminResidents from './pages/admin/Residents';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminReports from './pages/admin/Reports';

// Loading screen
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-white text-center">
        <img src="/logo.png" alt="Logo" className="w-20 h-20 object-cover rounded-full mx-auto mb-4" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

// Protected route for users only
function ProtectedUser({ children }) {
  const { user, admin, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  // If admin is logged in, redirect to admin dashboard
  if (admin) return <Navigate to="/admin/dashboard" replace />;
  return user ? children : <Navigate to="/login" replace />;
}

// Protected route for admins only
function ProtectedAdmin({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return admin ? children : <Navigate to="/admin/login" replace />;
}

// Public route - redirect if already logged in
function PublicRoute({ children, adminOnly = false }) {
  const { user, admin, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (admin) return <Navigate to="/admin/dashboard" replace />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/track" element={<TrackRequest />} />

          {/* Auth routes - redirect if logged in */}
          <Route path="/login" element={<PublicRoute><UserLogin /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><UserRegister /></PublicRoute>} />
          <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />

          {/* User Protected */}
          <Route path="/dashboard" element={<ProtectedUser><UserDashboard /></ProtectedUser>} />
          <Route path="/request-document" element={<ProtectedUser><RequestDocument /></ProtectedUser>} />
          <Route path="/my-requests" element={<ProtectedUser><MyRequests /></ProtectedUser>} />
          <Route path="/report-incident" element={<ProtectedUser><ReportIncident /></ProtectedUser>} />
          <Route path="/my-reports" element={<ProtectedUser><MyReports /></ProtectedUser>} />

          {/* Admin Protected */}
          <Route path="/admin/dashboard" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
          <Route path="/admin/documents" element={<ProtectedAdmin><AdminDocuments /></ProtectedAdmin>} />
          <Route path="/admin/incidents" element={<ProtectedAdmin><AdminIncidents /></ProtectedAdmin>} />
          <Route path="/admin/residents" element={<ProtectedAdmin><AdminResidents /></ProtectedAdmin>} />
          <Route path="/admin/announcements" element={<ProtectedAdmin><AdminAnnouncements /></ProtectedAdmin>} />
          <Route path="/admin/reports" element={<ProtectedAdmin><AdminReports /></ProtectedAdmin>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}