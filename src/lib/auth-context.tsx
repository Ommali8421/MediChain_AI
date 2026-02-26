"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DEMO_CREDENTIALS, type User, type UserRole } from "@/lib/data";

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => false,
    logout: () => { },
    isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("medichain_user");
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch { }
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, password: string): boolean => {
        const match = DEMO_CREDENTIALS.find(
            (c) => c.email === email && c.password === password
        );
        if (match) {
            setUser(match as User);
            localStorage.setItem("medichain_user", JSON.stringify(match));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("medichain_user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
