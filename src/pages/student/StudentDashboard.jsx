import React, { useMemo, useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { BookOpen, Calendar, Bell, User, Clock } from 'lucide-react';

export const StudentDashboard = () => {
    const { students, transactions, books, isDataLoaded, stats } = useData();
    const [mockUser] = useState(() => JSON.parse(localStorage.getItem('mockUser') || '{}'));
    
    // Derived state for the logged-in student
    const [studentList, setStudentList] = useState(() => students.getAll());
    const [transactionList, setTransactionList] = useState(() => transactions.getAll());
    const [bookList, setBookList] = useState(() => books.getAll());

    useEffect(() => {
        setStudentList(students.getAll());
        setTransactionList(transactions.getAll());
        setBookList(books.getAll());
    }, [isDataLoaded, students, transactions, books, stats]);

    const myProfile = useMemo(() => {
        return studentList.find(s => s.email === mockUser.email) || null;
    }, [studentList, mockUser.email]);

    const myTransactions = useMemo(() => {
        if (!myProfile) return [];
        return transactionList
            .filter(t => t.studentId === myProfile.$id)
            .map(t => {
                const book = bookList.find(b => b.$id === t.bookId) || { title: 'Unknown', author: 'Unknown' };
                return { ...t, book };
            })
            .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
    }, [transactionList, myProfile, bookList]);

    const activeHoldings = myTransactions.filter(t => t.status === 'Issued');
    
    // Find next due date (30 days from issue)
    const nextDueTransaction = activeHoldings.length > 0 
        ? activeHoldings.reduce((earliest, current) => {
            const currentDue = new Date(current.issueDate);
            currentDue.setDate(currentDue.getDate() + 30);
            const earliestDue = new Date(earliest.issueDate);
            earliestDue.setDate(earliestDue.getDate() + 30);
            return currentDue < earliestDue ? current : earliest;
        })
        : null;

    const nextDueDate = nextDueTransaction 
        ? new Date(new Date(nextDueTransaction.issueDate).getTime() + (30 * 24 * 60 * 60 * 1000)).toLocaleDateString()
        : 'N/A';

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {myProfile ? myProfile.name : 'Student'}!</h1>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Borrowed</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{activeHoldings.length}</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Due Date</p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{nextDueDate}</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</p>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate" title={myProfile?.department}>{myProfile ? myProfile.department : 'N/A'}</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                        <Bell className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Notifications</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">0</h3>
                    </div>
                </div>
            </div>

            {/* Current Holdings Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Current Holdings & History</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4">Book Details</th>
                                <th className="px-6 py-4">Issue Date</th>
                                <th className="px-6 py-4">Return Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Fine</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {myTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">No books borrowed yet.</p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Head over to Browse Books to request one!</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                myTransactions.map(t => {
                                    const issueDate = new Date(t.issueDate);
                                    const dueDate = new Date(issueDate.getTime() + (30 * 24 * 60 * 60 * 1000));
                                    const isOverdue = t.status === 'Issued' && new Date() > dueDate;

                                    return (
                                        <tr key={t.$id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 dark:text-white">{t.book.title}</div>
                                                <div className="text-xs text-gray-500">{t.book.author}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                {issueDate.toLocaleDateString()}
                                                {t.status === 'Issued' && (
                                                    <div className={`text-xs mt-1 ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                                                        Due: {dueDate.toLocaleDateString()}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                {t.returnDate ? new Date(t.returnDate).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                    t.status === 'Issued' 
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                                                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                }`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {t.fine > 0 ? (
                                                    <span className={`font-bold ${t.fineCleared ? 'text-gray-400 line-through' : 'text-red-600 dark:text-red-400'}`}>
                                                        -{t.fine} BDT
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
