import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // Get theme from localStorage or default to 'light'
        const savedTheme = localStorage.getItem('sciequip-theme');
        return savedTheme || 'light';
    });

    useEffect(() => {
        // Apply theme class to document root
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);

        // Save to localStorage
        localStorage.setItem('sciequip-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
