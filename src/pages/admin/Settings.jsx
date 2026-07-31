import React, { useState, useEffect } from 'react';
import { Save, Library, Bell, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Form states
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('librarySettings');
        return saved ? JSON.parse(saved) : {
            libraryName: 'SmartLibrary University',
            maxBorrowDays: 30,
            finePerDay: 20,
            emailNotifications: true,
            smsNotifications: false
        };
    });

    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleSaveGeneral = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            localStorage.setItem('librarySettings', JSON.stringify(settings));
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 1000);
    };

    const handleSaveSecurity = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setPasswordData({ current: '', new: '', confirm: '' });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 1000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage library configurations and admin preferences.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row">
                {/* Tabs Sidebar */}
                <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-4 space-y-1">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === 'general'
                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-750'
                        }`}
                    >
                        <Library className="w-5 h-5 mr-3" /> General
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === 'notifications'
                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-750'
                        }`}
                    >
                        <Bell className="w-5 h-5 mr-3" /> Notifications
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === 'security'
                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-750'
                        }`}
                    >
                        <Shield className="w-5 h-5 mr-3" /> Security
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 p-6 lg:p-8">
                    {saveSuccess && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-3 border border-green-200 dark:border-green-800">
                            <CheckCircle2 className="w-5 h-5" />
                            Settings saved successfully!
                        </div>
                    )}

                    {activeTab === 'general' && (
                        <form onSubmit={handleSaveGeneral} className="space-y-6 max-w-2xl">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Library Preferences</h2>
                                <div className="space-y-4">
                                    <Input 
                                        label="Library Name" 
                                        value={settings.libraryName}
                                        onChange={(e) => setSettings({...settings, libraryName: e.target.value})}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input 
                                            type="number" 
                                            label="Max Borrow Days" 
                                            value={settings.maxBorrowDays}
                                            onChange={(e) => setSettings({...settings, maxBorrowDays: parseInt(e.target.value)})}
                                        />
                                        <Input 
                                            type="number" 
                                            label="Fine Per Day (BDT)" 
                                            value={settings.finePerDay}
                                            onChange={(e) => setSettings({...settings, finePerDay: parseInt(e.target.value)})}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                <Button type="submit" isLoading={isSaving} className="flex items-center gap-2">
                                    <Save className="w-4 h-4" /> Save Changes
                                </Button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'notifications' && (
                        <form onSubmit={handleSaveGeneral} className="space-y-6 max-w-2xl">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Notification Channels</h2>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">Email Notifications</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Send due date reminders via email</div>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-600"
                                            checked={settings.emailNotifications}
                                            onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                                        />
                                    </label>
                                    <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">SMS Notifications</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Send urgent fine alerts via SMS</div>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-600"
                                            checked={settings.smsNotifications}
                                            onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                <Button type="submit" isLoading={isSaving} className="flex items-center gap-2">
                                    <Save className="w-4 h-4" /> Save Preferences
                                </Button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'security' && (
                        <form onSubmit={handleSaveSecurity} className="space-y-6 max-w-xl">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Change Password</h2>
                                <div className="space-y-4">
                                    <Input 
                                        type="password" 
                                        label="Current Password" 
                                        value={passwordData.current}
                                        onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                                        required
                                    />
                                    <Input 
                                        type="password" 
                                        label="New Password" 
                                        value={passwordData.new}
                                        onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                                        required
                                    />
                                    <Input 
                                        type="password" 
                                        label="Confirm New Password" 
                                        value={passwordData.confirm}
                                        onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                <Button 
                                    type="submit" 
                                    isLoading={isSaving} 
                                    className="flex items-center gap-2"
                                    disabled={!passwordData.current || !passwordData.new || passwordData.new !== passwordData.confirm}
                                >
                                    <Save className="w-4 h-4" /> Update Password
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
