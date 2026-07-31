import { Client, Account, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Default Appwrite Endpoint
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'PLACEHOLDER_PROJECT_ID');

export const account = new Account(client);
export const databases = new Databases(client);
export const appwriteConfig = {
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || 'PLACEHOLDER_DATABASE_ID',
    studentsCollectionId: import.meta.env.VITE_APPWRITE_STUDENTS_COLLECTION_ID || 'PLACEHOLDER_STUDENTS',
    booksCollectionId: import.meta.env.VITE_APPWRITE_BOOKS_COLLECTION_ID || 'PLACEHOLDER_BOOKS',
    transactionsCollectionId: import.meta.env.VITE_APPWRITE_TRANSACTIONS_COLLECTION_ID || 'PLACEHOLDER_TRANSACTIONS',
    contactsCollectionId: import.meta.env.VITE_APPWRITE_CONTACTS_COLLECTION_ID || 'PLACEHOLDER_CONTACTS'
};

export default client;
