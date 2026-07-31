import React from 'react';
import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Library, User } from 'lucide-react';

const navItems = [
    { name: 'My Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Browse Books', path: '/student/books', icon: Library },
];

export const StudentLayout = () => {
    const navigate = useNavigate();
    const mockUserStr = localStorage.getItem('mockUser');
    const mockUser = mockUserStr ? JSON.parse(mockUserStr) : null;
    
    // Basic protection (assuming mockUser exists for bypass)
    if (!mockUser || mockUser.role !== 'student') {
        return <Navigate to="/login?role=student" replace />;
    }

    const handleLogout = () => {
        localStorage.removeItem('mockUser');
        navigate('/login?role=student');
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Student Portal</span>
                </div>
                
                <div className="flex-1 py-6 px-4">
                    {/* User profile snippet */}
                    <div className="flex items-center gap-3 px-2 mb-8">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">Student User</div>
                            <div className="text-xs text-gray-500 truncate">{mockUser.email}</div>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            isActive
                                                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                                                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                                        }`
                                    }
                                >
                                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                    {item.name}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>
                
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="group flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-md transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-end px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Academic Term 2024</span>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
