import React, { useState } from 'react';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import AdminDashboard from './components/admin/AdminDashboard';
import CustomerDashboard from './components/customer/CustomerDashboard';
import CreateRFQForm from './components/customer/CreateRFQForm';
import VendorDashboard from './components/vendor/VendorDashboard';
import Login from './components/auth/Login';
import AdminLogin from './components/auth/AdminLogin';
import Register from './components/auth/Register';
import LandingPage from './components/landing/LandingPage';
import PublicRFQBrowser from './components/landing/PublicRFQBrowser';
import PublicVendorBrowser from './components/landing/PublicVendorBrowser';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
    const [currentView, setCurrentView] = useState('landing');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { userRole, user, switchRole, isAuthenticated, loading } = useAuth();

    // Check for admin portal hash
    React.useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash === '#admin') {
                setCurrentView('admin-portal');
            }
        };

        // Check initial hash
        handleHashChange();

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const handleNavigate = (view) => {
        setCurrentView(view);
    };

    const handleLoginRequired = () => {
        setCurrentView('login');
    };

    // Public routes
    const publicViews = ['landing', 'browse-rfqs', 'browse-vendors', 'login', 'register', 'admin-portal'];
    const isPublicView = publicViews.includes(currentView);

    if (!isAuthenticated && isPublicView) {
        if (currentView === 'landing') return <LandingPage onNavigate={handleNavigate} />;
        if (currentView === 'browse-rfqs') return <PublicRFQBrowser onNavigate={handleNavigate} onLoginRequired={handleLoginRequired} />;
        if (currentView === 'browse-vendors') return <PublicVendorBrowser onNavigate={handleNavigate} onLoginRequired={handleLoginRequired} />;
        if (currentView === 'login') return <Login onRegisterClick={() => setCurrentView('register')} />;
        if (currentView === 'register') return <Register onLoginClick={() => setCurrentView('login')} />;
        if (currentView === 'admin-portal') return <AdminLogin />;
    }

    if (!isAuthenticated) {
        return <Login onRegisterClick={() => setCurrentView('register')} />;
    }

    // Authenticated user views
    const renderContent = () => {
        // Specific views
        if (userRole === 'admin' && currentView === 'admin_master') return <AdminDashboard />;
        if (userRole === 'customer' && currentView === 'create_rfq') return <CreateRFQForm />;
        if (userRole === 'vendor' && currentView === 'vendor_leads') return <VendorDashboard />;

        // Default dashboards
        if (userRole === 'customer') return <CustomerDashboard />;
        if (userRole === 'vendor') return <VendorDashboard />;
        if (userRole === 'admin') return <AdminDashboard />;

        return <div>Welcome</div>;
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-300">
            <div className={`md:flex ${isSidebarOpen ? 'fixed inset-0 z-50 flex' : 'hidden'} md:relative`}>
                <Sidebar
                    currentView={currentView}
                    setCurrentView={(view) => { setCurrentView(view); setIsSidebarOpen(false); }}
                    userRole={userRole}
                    switchRole={switchRole}
                />
                {isSidebarOpen && <div className="fixed inset-0 bg-black/50 md:hidden -z-10" onClick={() => setIsSidebarOpen(false)}></div>}
            </div>

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header user={user} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className="flex-1 overflow-auto p-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}