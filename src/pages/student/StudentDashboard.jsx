import React, { useMemo, useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { BookOpen, Calendar, Bell, User, CheckCircle2, Clock, XCircle, Key } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const StudentDashboard = () => {
    const { students, transactions, books, requests, isDataLoaded, stats, verifyOTP } = useData();
    const [mockUser] = useState(() => JSON.parse(localStorage.getItem('mockUser') || '{}'));
    
    // Derived state for the logged-in student
    const [studentList, setStudentList] = useState(() => students.getAll());
    const [transactionList, setTransactionList] = useState(() => transactions.getAll());
    const [bookList, setBookList] = useState(() => books.getAll());
    const [requestList, setRequestList] = useState(() => requests.getAll());
    const [otpInputs, setOtpInputs] = useState({});

    useEffect(() => {
        setStudentList(students.getAll());
        setTransactionList(transactions.getAll());
        setBookList(books.getAll());
        setRequestList(requests.getAll());
    }, [isDataLoaded, students, transactions, books, requests, stats]);

    const myProfile = useMemo(() => {
        return studentList.find(s => s.email === mockUser.email) || null;
    }, [studentList, mockUser.email]);

    const myRequests = useMemo(() => {
        return requestList
            .filter(r => r.studentEmail === mockUser.email)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [requestList, mockUser.email]);

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

    const handleVerifyOtp = (requestId) => {
        const otp = otpInputs[requestId];
        if (!otp || otp.length !== 4) {
            alert("Please enter a valid 4-digit OTP.");
            return;
        }
        const success = verifyOTP(requestId, otp);
        if (success) {
            alert("OTP Verified Successfully! Handover completed.");
        } else {
            alert("Invalid OTP. Please try again.");
        }
    };

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

            {/* Book Requests History */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Book Requests</h2>
                </div>
                <div className="p-6">
                    {myRequests.length === 0 ? (
                        <div className="text-center py-8">
                            <Clock className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No requests made yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {myRequests.map(req => (
                                <div key={req.$id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 dark:bg-gray-800/50">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                                                req.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                                                req.status === 'Accepted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                req.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                                {req.status === 'Pending' && <Clock className="w-3 h-3" />}
                                                {req.status === 'Accepted' && <Key className="w-3 h-3" />}
                                                {req.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                                                {req.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                                                {req.status}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Requested on {new Date(req.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                            {req.books.map(b => (
                                                <li key={b.bookId}>• {b.title} <span className="text-gray-400">(Qty: {b.qty})</span></li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    {req.status === 'Accepted' && (
                                        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 w-full sm:w-auto">
                                            <input 
                                                type="text" 
                                                maxLength="4"
                                                placeholder="Enter 4-digit OTP"
                                                className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                                                value={otpInputs[req.$id] || ''}
                                                onChange={(e) => setOtpInputs({ ...otpInputs, [req.$id]: e.target.value.replace(/\D/g, '') })}
                                            />
                                            <Button onClick={() => handleVerifyOtp(req.$id)} size="sm">Verify</Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
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
