import React from 'react';
import { useData } from '../context/DataContext';

export const AdminDashboard = () => {
    const { isDataLoaded, stats, refreshData } = useData();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">
                Admin Dashboard
            </h1>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Data Structure Memory Metrics</h2>
                    <button
                        onClick={refreshData}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Force Sync
                    </button>
                </div>
                
                {!isDataLoaded ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Syncing with database...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Linked List Metric */}
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg transform transition duration-500 hover:scale-105">
                            <h3 className="text-lg font-semibold opacity-90 mb-2">Books (Linked List)</h3>
                            <div className="text-4xl font-bold mb-1">{stats.booksCount}</div>
                            <p className="text-sm opacity-80">Total Nodes</p>
                        </div>

                        {/* Array Metric - Students */}
                        <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl p-6 text-white shadow-lg transform transition duration-500 hover:scale-105">
                            <h3 className="text-lg font-semibold opacity-90 mb-2">Students (Dynamic Array)</h3>
                            <div className="text-4xl font-bold mb-1">{stats.studentsCount}</div>
                            <p className="text-sm opacity-80">Array Length</p>
                        </div>

                        {/* Array Metric - Contacts */}
                        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-6 text-white shadow-lg transform transition duration-500 hover:scale-105">
                            <h3 className="text-lg font-semibold opacity-90 mb-2">Contacts (Dynamic Array)</h3>
                            <div className="text-4xl font-bold mb-1">{stats.contactsCount}</div>
                            <p className="text-sm opacity-80">Array Length</p>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Operations Status</h2>
                <p className="text-gray-600 dark:text-gray-300">
                    The in-memory data structures are successfully synced with Appwrite. 
                    Any CRUD operations performed in the dashboard will modify these structures in O(1) or O(n) time and lazily sync to the database.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;
