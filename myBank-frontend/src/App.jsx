import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import AccountsPage from './pages/AccountsPage';
import TransactionsPage from './pages/TransactionsPage';
import ClientPortal from './pages/ClientPortal';
import LoginPage from './pages/LoginPage';

const LoadingScreen = () => (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 text-sm">Chargement...</p>
        </div>
    </div>
);

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <LoadingScreen />;
    return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <LoadingScreen />;
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== 'admin') return <Navigate to="/" replace />;
    return children;
};

const AppLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-50 font-sans overflow-hidden relative">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
                <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900/50 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                            <span className="font-black text-white text-xs">MB</span>
                        </div>
                        <span className="font-bold text-white tracking-widest text-sm">MYBANK</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

const HomePage = () => {
    const { user } = useAuth();
    if (user?.role === 'admin') return <Dashboard />;
    return <ClientPortal />;
};

function App() {
    const { user, loading } = useAuth();

    if (loading) return <LoadingScreen />;

    return (
        <Routes>
            <Route
                path="/login"
                element={user ? <Navigate to="/" replace /> : <LoginPage />}
            />

            <Route
                path="/*"
                element={
                    <PrivateRoute>
                        <AppLayout>
                            <Routes>
                                <Route path="/" element={<HomePage />} />

                                <Route path="/users" element={
                                    <AdminRoute><UsersPage /></AdminRoute>
                                } />
                                <Route path="/accounts" element={
                                    <AdminRoute><AccountsPage /></AdminRoute>
                                } />
                                <Route path="/transactions" element={
                                    <AdminRoute><TransactionsPage /></AdminRoute>
                                } />

                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </AppLayout>
                    </PrivateRoute>
                }
            />
        </Routes>
    );
}

export default App;
