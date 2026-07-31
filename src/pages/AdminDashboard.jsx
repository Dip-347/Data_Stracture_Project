import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
    Users, 
    BookOpen, 
    BookCheck, 
    LibraryBig,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

// Mock data for charts and recent activity until real transaction data is available
const activityData = [
    { name: 'Mon', issues: 40, returns: 24 },
    { name: 'Tue', issues: 30, returns: 13 },
    { name: 'Wed', issues: 20, returns: 38 },
    { name: 'Thu', issues: 27, returns: 39 },
    { name: 'Fri', issues: 18, returns: 48 },
    { name: 'Sat', issues: 23, returns: 38 },
    { name: 'Sun', issues: 34, returns: 43 },
];

const mockRecentActivity = [
    { id: 1, type: 'Issue', user: 'Alice Smith', item: 'The Great Gatsby', time: '2 hours ago', status: 'Active' },
    { id: 2, type: 'Return', user: 'Bob Jones', item: 'Introduction to Algorithms', time: '4 hours ago', status: 'Completed' },
    { id: 3, type: 'Register', user: 'Charlie Brown', item: 'New Student Account', time: '5 hours ago', status: 'Success' },
    { id: 4, type: 'Add', user: 'Librarian', item: 'Clean Code (Book)', time: '1 day ago', status: 'Success' },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${colorClass}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
        <div className="flex items-center text-sm">
            {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
            ) : trend === 'down' ? (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
            ) : null}
            <span className={trend === 'up' ? 'text-emerald-500 font-medium' : trend === 'down' ? 'text-red-500 font-medium' : 'text-gray-500'}>
                {trendValue}
            </span>
            <span className="text-gray-400 ml-2">vs last month</span>
        </div>
    </div>
);

export const AdminDashboard = () => {
    const { isDataLoaded, stats, refreshData } = useData();
    
    // Compute metrics
    const totalStudents = stats.studentsCount;
    const totalBooks = stats.booksCount;
    // Mock issued books to be a portion of total for demo
    const issuedBooks = useMemo(() => Math.floor(totalBooks * 0.3) || 12, [totalBooks]); 
    const availableBooks = totalBooks - issuedBooks;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <button
                    onClick={refreshData}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                    {isDataLoaded ? 'Refresh Data' : 'Syncing...'}
                </button>
            </div>

            {/* Top Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Students" 
                    value={isDataLoaded ? totalStudents : '-'} 
                    icon={Users} 
                    trend="up" 
                    trendValue="+12%" 
                    colorClass="bg-blue-500" 
                />
                <StatCard 
                    title="Total Books" 
                    value={isDataLoaded ? totalBooks : '-'} 
                    icon={LibraryBig} 
                    trend="up" 
                    trendValue="+4%" 
                    colorClass="bg-indigo-500" 
                />
                <StatCard 
                    title="Issued Books" 
                    value={isDataLoaded ? issuedBooks : '-'} 
                    icon={BookOpen} 
                    trend="down" 
                    trendValue="-2%" 
                    colorClass="bg-amber-500" 
                />
                <StatCard 
                    title="Available Books" 
                    value={isDataLoaded ? availableBooks : '-'} 
                    icon={BookCheck} 
                    trend="up" 
                    trendValue="+6%" 
                    colorClass="bg-emerald-500" 
                />
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Weekly Circulation</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip 
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="issues" name="Issued" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="returns" name="Returned" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Line Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Student Engagement</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="issues" name="Active Students" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Action Type</th>
                                <th scope="col" className="px-6 py-3">User / Actor</th>
                                <th scope="col" className="px-6 py-3">Item / Target</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockRecentActivity.map((activity) => (
                                <tr key={activity.id} className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${
                                            activity.type === 'Issue' ? 'bg-indigo-500' :
                                            activity.type === 'Return' ? 'bg-emerald-500' :
                                            activity.type === 'Register' ? 'bg-blue-500' : 'bg-amber-500'
                                        }`}></div>
                                        {activity.type}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{activity.user}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{activity.item}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            activity.status === 'Active' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' :
                                            activity.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                            {activity.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400">{activity.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
