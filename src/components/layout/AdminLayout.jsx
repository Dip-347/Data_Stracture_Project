import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AdminLayout = () => {
    return (
        <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
            <Sidebar />
            <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
                <Outlet />
            </div>
        </div>
    );
};
