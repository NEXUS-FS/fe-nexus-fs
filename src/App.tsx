import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { bouncy } from 'ldrs';
import './index.css';
import './global/general-sans.css';
import './global/blink-mac-system.css';
import { AuthProvider } from './context/AuthContext';
import ForbiddenPage from './pages/Page403Forbidden';
import PageNotFound from '@/pages/PageNotFound';

bouncy.register();

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const FileExplorer = lazy(() => import('./pages/FileExplorer'));
const SharedFiles = lazy(() => import('./pages/SharedFiles'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="w-full h-screen flex flex-col justify-center items-center bg-[#131313] text-[#e2e1df] uppercase font-geist-medium">
              <h4 className="mb-5">Loading</h4>
              <l-bouncy size="45" speed="1.75" color="white"></l-bouncy>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/files" element={<FileExplorer />} />
            <Route path="/shared" element={<SharedFiles />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/:tab" element={<Settings />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
