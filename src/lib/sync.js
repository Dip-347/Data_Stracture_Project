import { databases, appwriteConfig } from './appwrite';
import DynamicArray from './data-structures/DynamicArray';
import LinkedList from './data-structures/LinkedList';

// Singletons for memory data structures
export const studentsArray = new DynamicArray();
export const contactsArray = new DynamicArray();
export const booksList = new LinkedList();
export const transactionsArray = new DynamicArray();

/**
 * Syncs students from Appwrite to the memory array
 */
export const syncStudents = async () => {
    try {
        studentsArray.clear();
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.studentsCollectionId
        );
        
        response.documents.forEach(student => {
            studentsArray.insert(student);
        });
        
        return true;
    } catch (error) {
        console.error("Error syncing students:", error);
        return false;
    }
};

/**
 * Syncs contacts from Appwrite to the memory array
 */
export const syncContacts = async () => {
    try {
        contactsArray.clear();
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.contactsCollectionId
        );
        
        response.documents.forEach(contact => {
            contactsArray.insert(contact);
        });
        
        return true;
    } catch (error) {
        console.error("Error syncing contacts:", error);
        return false;
    }
};

/**
 * Syncs books from Appwrite to the memory linked list
 */
export const syncBooks = async () => {
    try {
        booksList.clear();
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.booksCollectionId
        );
        
        response.documents.forEach(book => {
            booksList.insertTail(book);
        });
        
        return true;
    } catch (error) {
        console.error("Error syncing books:", error);
        return false;
    }
};

/**
 * Syncs transactions from Appwrite to the memory array
 */
export const syncTransactions = async () => {
    try {
        transactionsArray.clear();
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.transactionsCollectionId
        );
        
        response.documents.forEach(transaction => {
            transactionsArray.insert(transaction);
        });
        
        return true;
    } catch (error) {
        console.error("Error syncing transactions:", error);
        return false;
    }
};

/**
 * Sync all data
 */
export const syncAllData = async () => {
    await Promise.all([
        syncStudents(),
        syncContacts(),
        syncBooks(),
        syncTransactions()
    ]);
};
