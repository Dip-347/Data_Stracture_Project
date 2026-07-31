import { createBook } from './api';

const CATEGORIES = [
    'Education', 
    'History', 
    'War', 
    'Economy', 
    'Artificial Intelligence (AI)', 
    'Computer Science', 
    'Physics', 
    'Mathematics', 
    'Philosophy', 
    'Science'
];

const PREFIXES = [
    'Fundamentals of', 'Introduction to', 'Advanced', 'Principles of', 'Modern', 
    'The Handbook of', 'Essential', 'Applied', 'Theoretical', 'A Comprehensive Guide to',
    'Perspectives on', 'Foundations of', 'Understanding', 'The Dynamics of', 'Concepts in'
];

const TOPICS = {
    'Education': ['Pedagogy', 'Curriculum Design', 'Educational Psychology', 'Distance Learning', 'Special Education', 'Cognitive Development', 'Instructional Methods'],
    'History': ['Ancient Civilizations', 'the Renaissance', 'the Industrial Revolution', 'the Cold War', 'European History', 'World History', 'the Middle Ages'],
    'War': ['Military Strategy', 'Tactical Operations', 'the World Wars', 'Naval Warfare', 'Conflict Resolution', 'Geopolitics', 'Modern Warfare'],
    'Economy': ['Microeconomics', 'Macroeconomics', 'Global Markets', 'Financial Systems', 'Economic Theory', 'Wealth Distribution', 'Monetary Policy'],
    'Artificial Intelligence (AI)': ['Machine Learning', 'Neural Networks', 'Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Robotics', 'AI Ethics'],
    'Computer Science': ['Data Structures', 'Algorithms', 'Operating Systems', 'Database Management', 'Software Engineering', 'Network Security', 'Cryptography'],
    'Physics': ['Quantum Mechanics', 'Relativity', 'Thermodynamics', 'Electromagnetism', 'Astrophysics', 'Particle Physics', 'Classical Mechanics'],
    'Mathematics': ['Calculus', 'Linear Algebra', 'Discrete Mathematics', 'Topology', 'Number Theory', 'Probability and Statistics', 'Geometry'],
    'Philosophy': ['Ethics', 'Metaphysics', 'Epistemology', 'Logic', 'Existentialism', 'Political Philosophy', 'Aesthetics'],
    'Science': ['Biology', 'Chemistry', 'Earth Science', 'Genetics', 'Ecology', 'Organic Chemistry', 'Astronomy']
};

const SUFFIXES = [
    'in the 21st Century', 'and Applications', 'for Professionals', 'Theory and Practice',
    'A Modern Approach', 'Principles and Techniques', 'Volume I', 'Volume II',
    'An Introductory Course', 'and Beyond', 'A Critical Analysis', 'for Beginners'
];

const FIRST_NAMES = ['John', 'Jane', 'Robert', 'Emily', 'Michael', 'Sarah', 'William', 'Jessica', 'David', 'Ashley', 'Richard', 'Amanda', 'Charles', 'Melissa', 'Joseph', 'Stephen', 'Daniel', 'Richard', 'Anthony', 'Margaret'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson'];

// Helper to get random item from array
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate random ISBN 13
const generateISBN = () => {
    let isbn = '978-';
    isbn += Math.floor(10 + Math.random() * 90) + '-';
    isbn += Math.floor(1000 + Math.random() * 9000) + '-';
    isbn += Math.floor(100 + Math.random() * 900) + '-';
    isbn += Math.floor(Math.random() * 10);
    return isbn;
};

export const generateBooksData = (count = 50) => {
    const generatedBooks = [];
    
    for (let i = 0; i < count; i++) {
        // Distribute categories somewhat evenly
        const categoryIndex = i % CATEGORIES.length;
        const category = CATEGORIES[categoryIndex];
        
        // Build Title
        const prefix = Math.random() > 0.3 ? sample(PREFIXES) + ' ' : '';
        const topic = sample(TOPICS[category]);
        const suffix = Math.random() > 0.5 ? ' ' + sample(SUFFIXES) : '';
        const title = `${prefix}${topic}${suffix}`;
        
        // Build Author
        const author = `${sample(FIRST_NAMES)} ${sample(LAST_NAMES)}`;
        
        generatedBooks.push({
            title,
            author,
            isbn: generateISBN(),
            category,
            status: 'Available',
            copies: Math.floor(Math.random() * 10) + 1 // 1 to 10 copies
        });
    }
    
    return generatedBooks;
};

export const seedBooks = async (onProgress = () => {}) => {
    const booksToSeed = generateBooksData(200);
    let successCount = 0;
    
    for (let i = 0; i < booksToSeed.length; i++) {
        try {
            await createBook(booksToSeed[i]);
            successCount++;
            onProgress(Math.floor((successCount / 200) * 100));
        } catch (error) {
            console.error(`Failed to seed book: ${booksToSeed[i].title}`, error);
        }
    }
    return successCount;
};
