import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api/azureSQL';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for persisted session
        const storedUser = localStorage.getItem('sciequip_session');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password, requestedRole = null) => {
        const userData = await loginUser(email, password, requestedRole);
        setUser(userData);
        localStorage.setItem('sciequip_session', JSON.stringify(userData));
        return userData;
    };

    const register = async (formData) => {
        const userData = await registerUser(formData);
        setUser(userData);
        localStorage.setItem('sciequip_session', JSON.stringify(userData));
        return userData;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sciequip_session');
        window.location.href = '/'; // Redirect to landing page
    };

    // For development/debugging, allow manual role switching if needed, 
    // but primarily rely on the user's actual role
    const switchRole = (role) => {
        if (user) {
            const updatedUser = { ...user, role };
            setUser(updatedUser);
            localStorage.setItem('sciequip_session', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            userRole: user?.role,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            switchRole,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};