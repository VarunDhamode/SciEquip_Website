import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 focus:outline-none ${theme === 'dark'
                    ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700 hover:text-yellow-300'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700'
                } ${className}`}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

export default ThemeToggle;
