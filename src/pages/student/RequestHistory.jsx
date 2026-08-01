import React, { useMemo, useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { Clock, CheckCircle2, XCircle, Key } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const RequestHistory = () => {
    const { requests, isDataLoaded, stats, verifyOTP, cancelRequest } = useData();
    const [mockUser] = useState(() => JSON.parse(localStorage.getItem('mockUser') || '{}'));
    
    const [requestList, setRequestList] = useState(() => requests.getAll());
    const [otpInputs, setOtpInputs] = useState({});

    useEffect(() => {
        setRequestList(requests.getAll());
    }, [isDataLoaded, requests, stats.requestsCount]);

    const myRequests = useMemo(() => {
        return requestList
            .filter(r => r.studentEmail === mockUser.email)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [requestList, mockUser.email]);

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Request History</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track the status of your book requests.</p>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                    {myRequests.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                            <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No requests made yet.</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Head over to Browse Books to request one!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {myRequests.map(req => (
                                <div key={req.$id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 dark:bg-gray-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider ${
                                                req.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400' :
                                                req.status === 'Accepted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400' :
                                                req.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400' :
                                                'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400'
                                            }`}>
                                                {req.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                                                {req.status === 'Accepted' && <Key className="w-3.5 h-3.5" />}
                                                {req.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                {req.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                                                {req.status === 'Cancelled' && <XCircle className="w-3.5 h-3.5" />}
                                                {req.status}
                                            </span>
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Requested on {new Date(req.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5 ml-1">
                                            {req.books.map(b => (
                                                <li key={b.bookId} className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500"></div>
                                                    <span className="font-medium">{b.title}</span> 
                                                    <span className="text-gray-400 dark:text-gray-500">(Qty: {b.qty})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div className="w-full sm:w-auto flex flex-col items-end gap-3">
                                        {req.status === 'Accepted' && (
                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-blue-800/50 shadow-sm w-full">
                                                <input 
                                                    type="text" 
                                                    maxLength="4"
                                                    placeholder="Enter 4-digit OTP"
                                                    className="w-full sm:w-36 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-mono tracking-widest text-center dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                    value={otpInputs[req.$id] || ''}
                                                    onChange={(e) => setOtpInputs({ ...otpInputs, [req.$id]: e.target.value.replace(/\D/g, '') })}
                                                />
                                                <Button onClick={() => handleVerifyOtp(req.$id)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                                                    Verify OTP
                                                </Button>
                                            </div>
                                        )}
                                        
                                        {req.status === 'Pending' && (
                                            <Button onClick={() => {
                                                if (window.confirm("Are you sure you want to cancel this request?")) {
                                                    cancelRequest(req.$id);
                                                }
                                            }} variant="danger" size="sm" className="w-full sm:w-auto mt-2 sm:mt-0 shadow-sm hover:shadow transition-shadow">
                                                Cancel Request
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestHistory;
