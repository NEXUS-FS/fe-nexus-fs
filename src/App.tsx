import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { bouncy } from 'ldrs';
import './index.css';
import './global/general-sans.css';
import { AuthProvider } from './context/AuthContext';

bouncy.register();

const Login = lazy(() => import('./pages/Login'));

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
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
