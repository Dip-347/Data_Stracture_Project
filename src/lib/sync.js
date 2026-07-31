import { databases, appwriteConfig } from './appwrite';
import DynamicArray from './data-structures/DynamicArray';
import LinkedList from './data-structures/LinkedList';
import { generateFallbackStudentsAndContacts } from './seeder';
import { generateBooksData } from './bookSeeder';

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
        
        if (response.documents.length > 0) {
            response.documents.forEach(student => {
                studentsArray.insert(student);
            });
        } else {
            console.log("No students in database. Loading permanent local fallback...");
            const { students } = generateFallbackStudentsAndContacts(100);
            students.forEach(student => studentsArray.insert(student));
        }
        
        return true;
    } catch (error) {
        console.error("Error syncing students, loading fallback...", error);
        const { students } = generateFallbackStudentsAndContacts(100);
        students.forEach(student => studentsArray.insert(student));
        return true;
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
        
        if (response.documents.length > 0) {
            response.documents.forEach(contact => {
                contactsArray.insert(contact);
            });
        } else {
            console.log("No contacts in database. Loading permanent local fallback...");
            const { contacts } = generateFallbackStudentsAndContacts(100);
            contacts.forEach(contact => contactsArray.insert(contact));
        }
        
        return true;
    } catch (error) {
        console.error("Error syncing contacts, loading fallback...", error);
        const { contacts } = generateFallbackStudentsAndContacts(100);
        contacts.forEach(contact => contactsArray.insert(contact));
        return true;
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
        
        if (response.documents.length > 0) {
            response.documents.forEach(book => {
                booksList.insertTail(book);
            });
        } else {
            console.log("No books in database. Loading permanent local fallback...");
            const books = generateBooksData(200);
            // mock $id for fallback UI keys
            books.forEach((book, idx) => {
                book.$id = `mock-book-${idx}`;
                booksList.insertTail(book);
            });
        }
        
        return true;
    } catch (error) {
        console.error("Error syncing books, loading fallback...", error);
        const books = generateBooksData(200);
        books.forEach((book, idx) => {
            book.$id = `mock-book-${idx}`;
            booksList.insertTail(book);
        });
        return true;
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
