import { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../lib/appwrite';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            const currentAccount = await account.get();
            setUser(currentAccount);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = async (email, password) => {
        const session = await account.createEmailPasswordSession(email, password);
        await checkAuthStatus();
        return session;
    };

    const logout = async () => {
        await account.deleteSession('current');
        setUser(null);
    };

    const value = {
        user,
        isLoading,
        login,
        logout,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
