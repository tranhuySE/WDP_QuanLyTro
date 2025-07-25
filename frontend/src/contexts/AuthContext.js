import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        role: null,
        user: null,
        initialized: false, // Thêm flag để track trạng thái khởi tạo
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (token && role) {
            setAuth({
                isAuthenticated: true,
                role,
                user: {
                    fullname: localStorage.getItem('fullname'),
                    id: localStorage.getItem('id'),
                },
                initialized: true,
            });
        } else {
            setAuth((prev) => ({ ...prev, initialized: true }));
        }
    }, []);

    const login = (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);
        localStorage.setItem('fullname', user.fullname);
        localStorage.setItem('id', user._id);
        localStorage.setItem('userData', JSON.stringify(user));
        setAuth({
            isAuthenticated: true,
            role: user.role,
            user,
            initialized: true,
        });
    };

    const logout = () => {
        localStorage.clear();
        setAuth({
            isAuthenticated: false,
            role: null,
            user: null,
            initialized: true,
        });
    };

    return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
