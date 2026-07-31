import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Search, Phone, Mail, User } from 'lucide-react';

export const Contacts = () => {
    const { contacts, isDataLoaded } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [contactList, setContactList] = useState([]);

    useEffect(() => {
        if (isDataLoaded) {
            setContactList(contacts.getAll());
        }
    }, [isDataLoaded, contacts]);

    const filteredContacts = useMemo(() => {
        return contactList.filter(contact => 
            contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.phone?.includes(searchTerm)
        );
    }, [contactList, searchTerm]);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Directory</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Easily find and reach out to students.</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search directory by name, email, or phone number..."
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Contacts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {!isDataLoaded ? (
                    <div className="col-span-full text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Loading directory...</p>
                    </div>
                ) : filteredContacts.length === 0 ? (
                    <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
                        <User className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No contacts found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search term.</p>
                    </div>
                ) : (
                    filteredContacts.map((contact) => (
                        <div key={contact.$id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group">
                            <div className="p-6">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
                                    {contact.name?.charAt(0) || '?'}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{contact.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 truncate">{contact.role || 'Student'}</p>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="truncate">{contact.phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="truncate">{contact.email || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Contacts;
