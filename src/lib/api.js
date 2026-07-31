import { ID } from 'appwrite';
import { databases, appwriteConfig } from './appwrite';
import { studentsArray, contactsArray, booksList, transactionsArray } from './sync';

// --- Student API Operations ---

export const createStudent = async (studentData) => {
    try {
        const document = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.studentsCollectionId,
            ID.unique(),
            studentData
        );
        
        // Sync to memory
        studentsArray.insert(document);
        return document;
    } catch (error) {
        console.error("Error creating student:", error);
        throw error;
    }
};

export const updateStudent = async (documentId, updateData) => {
    try {
        const document = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.studentsCollectionId,
            documentId,
            updateData
        );
        
        // Sync to memory
        studentsArray.updateById(documentId, document);
        return document;
    } catch (error) {
        console.error("Error updating student:", error);
        throw error;
    }
};

export const deleteStudent = async (documentId) => {
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.studentsCollectionId,
            documentId
        );
        
        // Sync to memory
        studentsArray.deleteById(documentId);
        return true;
    } catch (error) {
        console.error("Error deleting student:", error);
        throw error;
    }
};

// --- Contact API Operations ---

export const createContact = async (contactData) => {
    try {
        const document = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.contactsCollectionId,
            ID.unique(),
            contactData
        );
        
        contactsArray.insert(document);
        return document;
    } catch (error) {
        console.error("Error creating contact:", error);
        throw error;
    }
};

export const updateContact = async (documentId, updateData) => {
    try {
        const document = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.contactsCollectionId,
            documentId,
            updateData
        );
        
        contactsArray.updateById(documentId, document);
        return document;
    } catch (error) {
        console.error("Error updating contact:", error);
        throw error;
    }
};

export const deleteContact = async (documentId) => {
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.contactsCollectionId,
            documentId
        );
        
        contactsArray.deleteById(documentId);
        return true;
    } catch (error) {
        console.error("Error deleting contact:", error);
        throw error;
    }
};

// --- Book API Operations ---

export const createBook = async (bookData) => {
    try {
        const document = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.booksCollectionId,
            ID.unique(),
            bookData
        );
        
        booksList.insertTail(document);
        return document;
    } catch (error) {
        console.error("Error creating book:", error);
        throw error;
    }
};

export const updateBook = async (documentId, updateData) => {
    try {
        const document = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.booksCollectionId,
            documentId,
            updateData
        );
        
        booksList.updateById(documentId, document);
        return document;
    } catch (error) {
        console.error("Error updating book:", error);
        throw error;
    }
};

export const deleteBook = async (documentId) => {
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.booksCollectionId,
            documentId
        );
        
        booksList.deleteById(documentId);
        return true;
    } catch (error) {
        console.error("Error deleting book:", error);
        throw error;
    }
};

// --- Transaction API Operations ---

export const createTransaction = async (transactionData) => {
    try {
        const document = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.transactionsCollectionId,
            ID.unique(),
            transactionData
        );
        
        transactionsArray.insert(document);
        return document;
    } catch (error) {
        console.error("Error creating transaction:", error);
        throw error;
    }
};

export const updateTransaction = async (documentId, updateData) => {
    try {
        const document = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.transactionsCollectionId,
            documentId,
            updateData
        );
        
        transactionsArray.updateById(documentId, document);
        return document;
    } catch (error) {
        console.error("Error updating transaction:", error);
        throw error;
    }
};

// Clear all dues for a specific student
export const clearStudentDue = async (studentId) => {
    try {
        // Find all unpaid transactions for this student
        const studentTransactions = transactionsArray.searchAll(
            t => t.studentId === studentId && (t.fine || 0) > 0 && !t.fineCleared
        );

        for (const t of studentTransactions) {
            await updateTransaction(t.$id, { fineCleared: true });
        }
        return true;
    } catch (error) {
        console.error("Error clearing dues:", error);
        throw error;
    }
};

