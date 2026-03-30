// Language constants used across the app (mirrors the Syntax collection in DB)
export const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', description: 'Core language for frontend and backend' },
    { id: 'react', name: 'React', description: 'Frontend library for building UI' },
    { id: 'node', name: 'Node.js', description: 'JavaScript runtime for backend' },
    { id: 'express', name: 'Express.js', description: 'Backend framework for APIs' },
    { id: 'mongodb', name: 'MongoDB', description: 'NoSQL database for applications' },
    { id: 'tailwind', name: 'Tailwind CSS', description: 'Utility-first CSS framework for styling' },
    { id: 'bootstrap', name: 'Bootstrap', description: 'Responsive CSS framework for UI components' },
];
// Helper: get a language by its id
export const getLanguageById = (id) =>
    LANGUAGES.find((lang) => lang.id === id) || null;

// Helper: get a language by its display name
export const getLanguageByName = (name) =>
    LANGUAGES.find((lang) => lang.name === name) || null;
