import { ID } from 'appwrite';
import { databases, appwriteConfig } from './appwrite';
import { studentsArray, contactsArray } from './sync';

const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

const generateRandomPhone = () => {
    return `+8801${Math.floor(Math.random() * 900000000 + 100000000)}`;
};

export const generateFallbackStudentsAndContacts = (count = 100) => {
    const students = [];
    const contacts = [];
    
    for (let i = 1; i <= count; i++) {
        const phone = generateRandomPhone();
        const studentId = `STU-2024-${String(i).padStart(3, '0')}`;
        
        students.push({
            $id: `mock-student-${i}`,
            studentId: studentId,
            name: `Student ${i}`,
            department: departments[Math.floor(Math.random() * departments.length)],
            semester: semesters[Math.floor(Math.random() * semesters.length)],
            email: `student${i}@gmail.com`,
            phone: phone
        });

        contacts.push({
            $id: `mock-contact-${i}`,
            name: `Student ${i}`,
            email: `student${i}@gmail.com`,
            phone: phone,
            role: 'Student'
        });
    }
    
    return { students, contacts };
};

export const seedStudents = async (count = 100) => {
    console.log(`Starting to seed ${count} students...`);
    
    let successCount = 0;
    const { students, contacts } = generateFallbackStudentsAndContacts(count);
    
    for (let i = 1; i <= count; i++) {
        const studentData = students[i - 1];
        const contactData = contacts[i - 1];
        
        // Remove mock IDs for Appwrite
        const { $id: sId, ...sData } = studentData;
        const { $id: cId, ...cData } = contactData;

        try {
            const studentDoc = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.studentsCollectionId,
                ID.unique(),
                sData
            );
            
            const contactDoc = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.contactsCollectionId,
                ID.unique(),
                cData
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
