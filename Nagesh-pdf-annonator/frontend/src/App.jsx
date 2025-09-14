import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PdfViewer from './pages/PdfViewer.jsx';
import UploadPdf from './pages/UploadPdf.jsx';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar.jsx';

function ProtectedRoute({ children }) {
  const token = useSelector(state => state.auth.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute>
              <UploadPdf />
            </ProtectedRoute>
          } />
          <Route path="/pdf/:uuid" element={
            <ProtectedRoute>
              <PdfViewer />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
