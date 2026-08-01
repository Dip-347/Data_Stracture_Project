import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Clock, CheckCircle2, XCircle, Key, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const Requests = () => {
    const { requests, acceptRequest, rejectRequest, isDataLoaded } = useData();
    const [requestList, setRequestList] = useState(() => requests.getAll());

    useEffect(() => {
        // Sort requests by newest first
        const sorted = [...requests.getAll()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRequestList(sorted);
    }, [requests, isDataLoaded]);

    const handleAccept = (reqId) => {
        acceptRequest(reqId);
        setRequestList([...requests.getAll()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    };

    const handleReject = (reqId) => {
        if (window.confirm("Are you sure you want to reject this request?")) {
            rejectRequest(reqId);
            setRequestList([...requests.getAll()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Requested Books</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage incoming book requests from students.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                    {requestList.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                            <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No pending requests</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">When students request books, they will appear here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {requestList.map(req => (
                                <div key={req.$id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col bg-gray-50/50 dark:bg-gray-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{req.studentEmail}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(req.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
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
                                    </div>
                                    
                                    <div className="flex-1 mb-6">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Requested Items:</h4>
                                        <ul className="space-y-2">
                                            {req.books.map(b => (
                                                <li key={b.bookId} className="flex justify-between items-center text-sm bg-white dark:bg-gray-700/50 p-2 rounded border border-gray-100 dark:border-gray-600">
                                                    <span className="text-gray-900 dark:text-gray-100 truncate pr-4">{b.title}</span>
                                                    <span className="font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Qty: {b.qty}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    {req.status === 'Pending' && (
                                        <div className="flex items-center gap-3 mt-auto">
                                            <Button onClick={() => handleAccept(req.$id)} className="flex-1 justify-center py-2">
                                                Accept Request
                                            </Button>
                                            <Button onClick={() => handleReject(req.$id)} variant="danger" className="flex-1 justify-center py-2">
                                                Reject
                                            </Button>
                                        </div>
                                    )}

                                    {req.status === 'Accepted' && (
                                        <div className="mt-auto bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4 text-center">
                                            <p className="text-sm text-blue-800 dark:text-blue-300 mb-1 font-medium">Share this OTP with the student:</p>
                                            <div className="text-3xl font-mono font-bold tracking-widest text-blue-900 dark:text-blue-400">
                                                {req.otp}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Requests;
