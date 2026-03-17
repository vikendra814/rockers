import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
  import { ToastContainer, toast } from 'react-toastify';


function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="text-center py-5"><div className="spinner-border" /></div>;
    return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="text-center py-5"><div className="spinner-border" /></div>;
    return user ? <Navigate to="/dashboard" /> : children;
}

function AppRoutes() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/" />} />
                    
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
            <ToastContainer />
        </BrowserRouter>
    );
}
