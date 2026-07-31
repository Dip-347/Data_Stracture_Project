import React, { useMemo, useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { Download, TrendingUp, AlertTriangle, Users, BookOpen } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Reports = () => {
    const { transactions, students, isDataLoaded } = useData();
    const [transactionList, setTransactionList] = useState(() => transactions.getAll());
    const [studentList, setStudentList] = useState(() => students.getAll());
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        setTransactionList(transactions.getAll());
        setStudentList(students.getAll());
    }, [isDataLoaded, transactions, students]);

    const stats = useMemo(() => {
        let totalFines = 0;
        let activeBorrowers = new Set();
        let overdueBooks = 0;

        transactionList.forEach(t => {
            if (t.fine > 0) totalFines += t.fine;
            if (t.status === 'Issued') {
                activeBorrowers.add(t.studentId);
                const dueDate = new Date(t.issueDate);
                dueDate.setDate(dueDate.getDate() + 30);
                if (new Date() > dueDate) overdueBooks++;
            }
        });

        return {
            totalFines,
            activeBorrowers: activeBorrowers.size,
            overdueBooks
        };
    }, [transactionList]);

    // Generate chart data mapping last 7 days of activity
    const chartData = useMemo(() => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            let count = 0;
            transactionList.forEach(t => {
                const issueDate = new Date(t.issueDate);
                if (issueDate.toDateString() === date.toDateString()) {
                    count++;
                }
            });
            data.push({ name: dateString, Issues: count });
        }
        return data;
    }, [transactionList]);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            alert("Report exported to CSV successfully! (Simulated)");
        }, 1500);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Library Reports & Analytics</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Exportable metrics and visual summaries of library health.</p>
                </div>
                <Button onClick={handleExport} isLoading={isExporting} className="flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export Report
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">All Time</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Fines Collected</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalFines} <span className="text-lg font-medium text-gray-500">BDT</span></h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded">Action Needed</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue Books</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.overdueBooks}</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <Users className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">Currently Active</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Borrowers</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.activeBorrowers}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Issue Volume (Last 7 Days)</h2>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1f2937', color: '#f9fafb' }}
                                itemStyle={{ color: '#818cf8' }}
                            />
                            <Area type="monotone" dataKey="Issues" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIssues)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Reports;
