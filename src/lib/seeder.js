import { ID } from 'appwrite';
import { databases, appwriteConfig } from './appwrite';
import { studentsArray, contactsArray } from './sync';

const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

const generateRandomPhone = () => {
    return `+8801${Math.floor(Math.random() * 900000000 + 100000000)}`;
};

export const seedStudents = async (count = 100) => {
    console.log(`Starting to seed ${count} students...`);
    
    let successCount = 0;
    
    for (let i = 1; i <= count; i++) {
        const phone = generateRandomPhone();
        const studentData = {
            studentId: `STU-2024-${String(i).padStart(3, '0')}`,
            name: `Student ${i}`,
            department: departments[Math.floor(Math.random() * departments.length)],
            semester: semesters[Math.floor(Math.random() * semesters.length)],
            email: `student${i}@gmail.com`,
            phone: phone
        };

        const contactData = {
            name: `Student ${i}`,
            email: `student${i}@gmail.com`,
            phone: phone,
            role: 'Student'
        };

        try {
            const studentDoc = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.studentsCollectionId,
                ID.unique(),
                studentData
            );
            
            const contactDoc = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.contactsCollectionId,
                ID.unique(),
                contactData
            );
            
            // Sync to memory immediately
            studentsArray.insert(studentDoc);
            contactsArray.insert(contactDoc);
            
            successCount++;
            
            if (i % 10 === 0) {
                console.log(`Seeded ${i}/${count} students...`);
            }
        } catch (error) {
            console.error(`Failed to seed student ${i}:`, error);
        }
    }
    
    console.log(`Finished seeding. Successfully added ${successCount} students and contacts.`);
    return successCount;
};
