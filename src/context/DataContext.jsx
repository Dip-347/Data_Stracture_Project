import { createContext, useContext, useState, useEffect } from 'react';
import { syncAllData, studentsArray, contactsArray, booksList, transactionsArray } from '../lib/sync';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [dataError, setDataError] = useState(null);
    const [stats, setStats] = useState({
        studentsCount: 0,
        contactsCount: 0,
        booksCount: 0,
        transactionsCount: 0
    });
    const { user } = useAuth();

    const updateStats = () => {
        setStats({
            studentsCount: studentsArray.getSize(),
            contactsCount: contactsArray.getSize(),
            booksCount: booksList.getSize(),
            transactionsCount: transactionsArray.getSize()
        });
    };

    const loadData = async () => {
        setIsDataLoaded(false);
        setDataError(null);
        try {
            await syncAllData();
            updateStats();
        } catch (error) {
            console.error("Failed to load initial data:", error);
            setDataError("Failed to load application data. Please refresh.");
        } finally {
            setIsDataLoaded(true);
        }
    };

    useEffect(() => {
        // Only load data if the user is authenticated (or you can load public data anyway)
        // Adjust this condition based on your app's privacy rules
        loadData();
    }, [user]);

    const value = {
        isDataLoaded,
        dataError,
        stats,
        students: studentsArray,
        contacts: contactsArray,
        books: booksList,
        transactions: transactionsArray,
        refreshData: loadData,
        updateStats // call this after manual insertions to update the UI
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    return useContext(DataContext);
};
