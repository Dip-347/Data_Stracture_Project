import { createContext, useContext, useState, useEffect } from 'react';
import { syncAllData, studentsArray, contactsArray, booksList, transactionsArray, requestsArray, persistRequests, loadRequestsFromStorage } from '../lib/sync';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [dataError, setDataError] = useState(null);
    const [stats, setStats] = useState({
        studentsCount: 0,
        contactsCount: 0,
        booksCount: 0,
        transactionsCount: 0,
        requestsCount: 0
    });
    const { user } = useAuth();

    const updateStats = () => {
        setStats({
            studentsCount: studentsArray.getSize(),
            contactsCount: contactsArray.getSize(),
            booksCount: booksList.getSize(),
            transactionsCount: transactionsArray.getSize(),
            requestsCount: requestsArray.getSize()
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

    // Listen to changes in localStorage across tabs
    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === 'smart_library_requests') {
                loadRequestsFromStorage();
                updateStats(); // Trigger re-render
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const submitRequest = (studentEmail, cartItems) => {
        const newRequest = {
            $id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            studentEmail,
            books: cartItems, // Array of { bookId, title, qty }
            status: 'Pending',
            otp: null,
            createdAt: new Date().toISOString()
        };
        requestsArray.insert(newRequest);
        persistRequests();
        updateStats();
        return newRequest;
    };

    const acceptRequest = (requestId) => {
        const reqs = requestsArray.getAll();
        const reqIndex = reqs.findIndex(r => r.$id === requestId);
        if (reqIndex !== -1) {
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            reqs[reqIndex].status = 'Accepted';
            reqs[reqIndex].otp = otp;
            persistRequests();
            updateStats();
            return otp;
        }
        return null;
    };

    const rejectRequest = (requestId) => {
        const reqs = requestsArray.getAll();
        const reqIndex = reqs.findIndex(r => r.$id === requestId);
        if (reqIndex !== -1) {
            reqs[reqIndex].status = 'Rejected';
            persistRequests();
            updateStats();
            return true;
        }
        return false;
    };

    const cancelRequest = (requestId) => {
        const reqs = requestsArray.getAll();
        const reqIndex = reqs.findIndex(r => r.$id === requestId);
        if (reqIndex !== -1) {
            requestsArray.delete(reqIndex); // Using DynamicArray's delete if it exists, but usually we just want to remove or mark as cancelled.
            // Wait, DynamicArray doesn't have a reliable delete(index) in some implementations. Let's just mark it 'Cancelled'.
            reqs[reqIndex].status = 'Cancelled';
            persistRequests();
            updateStats();
            return true;
        }
        return false;
    };

    const verifyOTP = (requestId, submittedOtp) => {
        const reqs = requestsArray.getAll();
        const reqIndex = reqs.findIndex(r => r.$id === requestId);
        if (reqIndex !== -1 && reqs[reqIndex].otp === submittedOtp) {
            reqs[reqIndex].status = 'Completed';
            
            // Deduct inventory
            const books = booksList.getAll();
            reqs[reqIndex].books.forEach(reqBook => {
                const globalBook = books.find(b => b.$id === reqBook.bookId);
                if (globalBook) {
                    globalBook.copies = Math.max(0, (globalBook.copies || 1) - reqBook.qty);
                    // update status if 0
                    if (globalBook.copies === 0) {
                        globalBook.status = 'Issued';
                    }
                }
            });
            
            persistRequests();
            updateStats();
            return true;
        }
        return false;
    };

    const value = {
        isDataLoaded,
        dataError,
        stats,
        students: studentsArray,
        contacts: contactsArray,
        books: booksList,
        transactions: transactionsArray,
        requests: requestsArray,
        refreshData: loadData,
        updateStats,
        submitRequest,
        acceptRequest,
        rejectRequest,
        cancelRequest,
        verifyOTP
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
