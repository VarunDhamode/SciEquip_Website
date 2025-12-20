import React from 'react';
import { Bell, Menu, Search, UserCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = ({ user, toggleSidebar }) => {
    return (
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-6 py-3 flex justify-between items-center shadow-sm transition-colors duration-300">
            {/* Mobile Menu Trigger */}
            <div className="flex items-center gap-4 md:hidden">
                <button onClick={toggleSidebar} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
                    <Menu size={24} />
                </button>
                <span className="font-bold text-slate-800 dark:text-white text-lg">SciEquip</span>
            </div>

            {/* Desktop Search Bar (Hidden on Mobile) */}
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 w-96 border border-transparent focus-within:border-blue-300 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                <Search size={18} className="text-slate-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search RFQs, IDs, or Vendors..."
                    className="bg-transparent border-none focus:outline-none text-sm text-slate-700 dark:text-slate-200 w-full placeholder-slate-400"
                />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
                <ThemeToggle />

                <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
                </button>

                <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || 'Guest'}</p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900 p-1 rounded-full text-blue-600 dark:text-blue-400">
                        <UserCircle size={32} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;