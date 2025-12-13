import React from 'react';
import { LayoutDashboard, PlusCircle, FileText, Users, Search, Database, Cpu, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ currentView, setCurrentView, userRole }) => {
    const { logout } = useAuth();

    return (
        <div className="w-64 bg-slate-900 text-white h-screen flex flex-col shadow-xl z-50 hidden md:flex shrink-0">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                    <Cpu /> SciEquip <span className="text-xs text-slate-500 border border-slate-700 px-1 rounded">Azure</span>
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-2">
                    {userRole} Module
                </div>

                <button onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
                    <LayoutDashboard size={20} /> Dashboard
                </button>

                {userRole === 'customer' && (
                    <button onClick={() => setCurrentView('create_rfq')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'create_rfq' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
                        <PlusCircle size={20} /> New Requirement
                    </button>
                )}

                {userRole === 'admin' && (
                    <button onClick={() => setCurrentView('admin_master')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'admin_master' ? 'bg-purple-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
                        <Database size={20} /> SQL Master View
                    </button>
                )}

                {userRole === 'vendor' && (
                    <button onClick={() => setCurrentView('vendor_leads')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'vendor_leads' ? 'bg-green-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
                        <Search size={20} /> Browse RFQs
                    </button>
                )}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 transition-colors"
                >
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;