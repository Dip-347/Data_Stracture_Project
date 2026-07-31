import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { createTransaction, updateTransaction, updateBook, clearStudentDue } from '../../lib/api';
import { Search, Plus, RotateCcw, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

// Utility to calculate fines (30 BDT flat fine for > 30 days overdue)
const calculateFine = (issueDateIso, returnDateIso) => {
    const issueDate = new Date(issueDateIso);
    const returnDate = new Date(returnDateIso);
    const diffTime = Math.abs(returnDate - issueDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 30) {
        return 20; // -20 BDT
    }
    return 0;
};

export const Transactions = () => {
    const { transactions, students, books, updateStats, isDataLoaded, stats } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [otpModalData, setOtpModalData] = useState({ isOpen: false, type: '', data: null, generatedOtp: '', inputOtp: '' });
    const [isLoading, setIsLoading] = useState(false);
    
    // Form state for issuing
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedBookId, setSelectedBookId] = useState('');
    
    const [transactionList, setTransactionList] = useState(() => transactions.getAll());
    const [studentList, setStudentList] = useState(() => students.getAll());
    const [bookList, setBookList] = useState(() => books.getAll());

    useEffect(() => {
        setTransactionList(transactions.getAll());
        setStudentList(students.getAll());
        setBookList(books.getAll());
    }, [isDataLoaded, transactions, students, books, stats]);

    // Aggregate fines per student to display distinct red alert boxes
    const studentDues = useMemo(() => {
        const dues = {};
        transactionList.forEach(t => {
            if (t.fine > 0 && !t.fineCleared) {
                dues[t.studentId] = (dues[t.studentId] || 0) + t.fine;
            }
        });
        return dues;
    }, [transactionList]);

    // Derived full transaction list with populated relations
    const populatedTransactions = useMemo(() => {
        return transactionList.map(t => {
            const student = studentList.find(s => s.$id === t.studentId) || { name: 'Unknown', studentId: 'N/A' };
            const book = bookList.find(b => b.$id === t.bookId) || { title: 'Unknown', author: 'N/A' };
            return { ...t, student, book };
        }).filter(t => 
            t.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.book.title.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
    }, [transactionList, studentList, bookList, searchTerm]);

    const availableBooks = useMemo(() => bookList.filter(b => b.status === 'Available'), [bookList]);

    const openOtpModal = (type, data) => {
        const generated = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
        setOtpModalData({ isOpen: true, type, data, generatedOtp: generated, inputOtp: '' });
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        if (otpModalData.inputOtp !== otpModalData.generatedOtp) {
            alert('Invalid OTP. Please try again.');
            return;
        }

        setIsLoading(true);
        try {
            if (otpModalData.type === 'ISSUE') {
                const { studentId, bookId } = otpModalData.data;
                const now = new Date().toISOString();
                
                await createTransaction({
                    studentId,
                    bookId,
                    issueDate: now,
                    status: 'Issued'
                });
                
                await updateBook(bookId, { status: 'Issued' });
                
                setIsIssueModalOpen(false);
                setSelectedStudentId('');
                setSelectedBookId('');
                
            } else if (otpModalData.type === 'RETURN') {
                const transaction = otpModalData.data;
                const now = new Date().toISOString();
                const fine = calculateFine(transaction.issueDate, now);
                
                await updateTransaction(transaction.$id, {
                    returnDate: now,
                    status: 'Returned',
                    fine: fine
                });
                
                await updateBook(transaction.bookId, { status: 'Available' });
            } else if (otpModalData.type === 'CLEAR_DUE') {
                await clearStudentDue(otpModalData.data);
            }
            
            updateStats();
            setOtpModalData({ ...otpModalData, isOpen: false });
            alert('Transaction Successful!');
        } catch (error) {
            console.error(error);
            alert('Operation failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Book Transactions</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage checkouts, returns, and track student penalties.</p>
                </div>
                <Button onClick={() => setIsIssueModalOpen(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Issue Book
                </Button>
            </div>

            {/* Dues Dashboard (High Contrast) */}
            {Object.keys(studentDues).length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <h2 className="text-sm font-bold text-red-800 dark:text-red-300">Outstanding Fines</h2>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {Object.entries(studentDues).map(([studentId, due]) => {
                            const student = studentList.find(s => s.$id === studentId);
                            return (
                                <div key={studentId} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-red-100 dark:border-red-900/50 flex items-center justify-between min-w-[250px]">
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">{student ? student.name : 'Unknown'}</div>
                                        <div className="text-xs font-bold text-red-600 dark:text-red-400">Due: -{due} BDT</div>
                                    </div>
                                    <button 
                                        onClick={() => openOtpModal('CLEAR_DUE', studentId)}
                                        className="text-xs px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-800 rounded transition-colors"
                                    >
                                        Clear Due
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Search and Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="relative max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Book</th>
                                <th className="px-6 py-4">Issue Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Fine</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {populatedTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No transactions found.</td>
                                </tr>
                            ) : (
                                populatedTransactions.map((t) => (
                                    <tr key={t.$id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{t.student.name}</div>
                                            <div className="text-xs text-gray-500">{t.student.studentId}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]" title={t.book.title}>{t.book.title}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{t.book.author}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {new Date(t.issueDate).toLocaleDateString()}
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
                                        <td className="px-6 py-4 text-right">
                                            {t.status === 'Issued' && (
                                                <Button 
                                                    onClick={() => openOtpModal('RETURN', t)}
                                                    variant="secondary"
                                                    className="px-3 py-1 text-xs"
                                                >
                                                    <RotateCcw className="w-3 h-3 mr-1 inline" /> Return
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Issue Book Modal */}
            {isIssueModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Issue Book</h3>
                            <button onClick={() => setIsIssueModalOpen(false)} className="text-gray-400 hover:text-gray-500"><X className="w-5 h-5"/></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Student</label>
                                <select 
                                    value={selectedStudentId} 
                                    onChange={e => setSelectedStudentId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                >
                                    <option value="">-- Choose Student --</option>
                                    {studentList.map(s => <option key={s.$id} value={s.$id}>{s.name} ({s.studentId})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Available Book</label>
                                <select 
                                    value={selectedBookId} 
                                    onChange={e => setSelectedBookId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                >
                                    <option value="">-- Choose Book --</option>
                                    {availableBooks.map(b => <option key={b.$id} value={b.$id}>{b.title}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                            <Button onClick={() => setIsIssueModalOpen(false)} variant="secondary">Cancel</Button>
                            <Button 
                                onClick={() => openOtpModal('ISSUE', { studentId: selectedStudentId, bookId: selectedBookId })}
                                disabled={!selectedStudentId || !selectedBookId}
                            >
                                Proceed
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Simulated OTP Handshake Modal */}
            {otpModalData.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900 bg-opacity-90">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden text-center border-2 border-indigo-500">
                        <div className="bg-indigo-600 p-6 text-white flex flex-col items-center">
                            <ShieldCheck className="w-12 h-12 mb-2" />
                            <h3 className="text-xl font-bold">Secure Verification</h3>
                            <p className="text-indigo-100 text-sm mt-1">Librarian Authorization Required</p>
                        </div>
                        <form onSubmit={handleOtpSubmit} className="p-6">
                            <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-6">
                                <p className="text-xs text-amber-700 font-medium">SIMULATED SMS SENT TO LIBRARIAN:</p>
                                <p className="text-2xl font-bold text-gray-900 tracking-widest mt-1">{otpModalData.generatedOtp}</p>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enter OTP to Confirm {otpModalData.type}</label>
                                <input 
                                    type="text" 
                                    required 
                                    maxLength="4"
                                    value={otpModalData.inputOtp}
                                    onChange={e => setOtpModalData({...otpModalData, inputOtp: e.target.value.replace(/\D/g, '')})}
                                    className="w-full text-center text-2xl tracking-[0.5em] px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bold"
                                    placeholder="••••"
                                />
                            </div>
                            
                            <div className="flex gap-3">
                                <Button type="button" onClick={() => setOtpModalData({isOpen: false})} variant="secondary" className="w-full">Cancel</Button>
                                <Button type="submit" isLoading={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700">Verify</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
