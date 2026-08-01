import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    BookOpen, 
    Contact, 
    ArrowRightLeft, 
    BarChart3, 
    Settings,
    LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: Users },
    { name: 'Books', path: '/admin/books', icon: BookOpen },
    { name: 'Requested Books', path: '/admin/requests', icon: BookOpen },
    { name: 'Contacts', path: '/admin/contacts', icon: Contact },
    { name: 'Transactions', path: '/admin/transactions', icon: ArrowRightLeft },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export const Sidebar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout(); // clears real session if any
        } catch (e) {
            console.error(e);
        } finally {
            localStorage.removeItem('mockUser'); // clears mock session
            navigate('/login?role=admin');
        }
    };

    return (
        <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full shrink-0">
            <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Admin Portal</span>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-3 space-y-1">
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
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
                <button
                    onClick={handleLogout}
                    className="group flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-md transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" aria-hidden="true" />
                    Logout
                </button>
            </div>
        </div>
    );
};
