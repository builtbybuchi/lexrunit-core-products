
import { Job, NewsArticle, BlogPost, JobApplication } from '../types';


// Removed Appwrite import
const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL || 'http://localhost:8001/api/v1';
const API_KEY = import.meta.env.VITE_LEXRUNIT_API_KEY || 'default-dev-key';
const getHeaders = () => ({ 'x-lexrunit-api-key': API_KEY });

// --- Generic localStorage Functions ---
const getItems = <T>(key: string): T[] => {
    try {
        const items = localStorage.getItem(key);
        return items ? JSON.parse(items) : [];
    } catch (error) {
        console.error(`Error reading ${key} from localStorage`, error);
        return [];
    }
};

const saveItems = <T>(key: string, items: T[]): void => {
    try {
        localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage`, error);
    }
};

// --- Initial Data ---
const initialJobs: Job[] = [
    { id: '1', title: 'Senior Frontend Engineer', location: 'Remote', description: 'We are looking for an experienced Frontend Engineer to help build our next-generation software solutions.' },
    { id: '2', title: 'Lead Backend Developer (Node.js)', location: 'Tech City Office', description: 'Join our team to lead the development of scalable and robust backend services for our suite of products.' },
    { id: '3', title: 'Product Manager - LexCare', location: 'Remote', description: "Drive the vision and execution for our flagship healthcare product, L'Hopital." }
];

// --- Public API ---
export const initializeData = (): void => {
    if (!localStorage.getItem('lexrunit_jobs')) {
        saveItems('lexrunit_jobs', initialJobs);
    }
};

// --- Jobs ---
import { ID } from 'appwrite';
import { client, BUCKET_ID } from './appwrite';
import { Storage } from 'appwrite';

const storage = new Storage(client);

// --- Jobs ---
export const getJobs = async (): Promise<Job[]> => {
    try {
        const response = await fetch(`${BASE_URL}/careers`, { headers: getHeaders() });
        const data = await response.json();
        return data.map((doc: any) => ({
            id: doc.$id,
            title: doc.title,
            location: doc.location,
            type: doc.type,
            description: doc.description,
            requirements: doc.requirements,
            salary: doc.salary,
            publishedAt: doc.publishedAt
        }));
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
};

export const createJob = async (job: Omit<Job, 'id' | 'publishedAt'>): Promise<Job | null> => {
    try {
        const response = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.JOBS,
            ID.unique(),
            {
                ...job,
                publishedAt: new Date().toISOString()
            }
        );
        return {
            id: response.$id,
            title: response.title,
            location: response.location,
            type: response.type,
            description: response.description,
            requirements: response.requirements,
            salary: response.salary,
            publishedAt: response.publishedAt
        };
    } catch (error) {
        console.error('Error creating job:', error);
        return null;
    }
};

export const deleteJob = async (id: string): Promise<boolean> => {
    try {
        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.JOBS, id);
        return true;
    } catch (error) {
        console.error('Error deleting job:', error);
        return false;
    }
};

// --- Applications ---
export const submitApplication = async (application: Omit<JobApplication, 'id' | 'status' | 'appliedAt' | 'resumeUrl'>, resumeFile: File): Promise<boolean> => {
    try {
        // 1. Upload Resume
        const fileUpload = await storage.createFile(
            BUCKET_ID,
            ID.unique(),
            resumeFile
        );

        const resumeUrl = `https://storage.lexrunit.com/v1/storage/buckets/${BUCKET_ID}/files/${fileUpload.$id}/view?project=68e67ffd0007ce1f504f`;

        // 2. Create Application Document
        await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.APPLICATIONS,
            ID.unique(),
            {
                ...application,
                resumeUrl: resumeUrl,
                status: 'pending',
                appliedAt: new Date().toISOString()
            }
        );
        return true;
    } catch (error) {
        console.error('Error submitting application:', error);
        return false;
    }
};

export const getApplications = async (): Promise<JobApplication[]> => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.APPLICATIONS,
            [Query.orderDesc('appliedAt')]
        );
        return response.documents.map(doc => ({
            id: doc.$id,
            jobId: doc.jobId,
            jobTitle: doc.jobTitle,
            fullName: doc.fullName,
            email: doc.email,
            phone: doc.phone,
            resumeUrl: doc.resumeUrl,
            coverLetter: doc.coverLetter,
            status: doc.status,
            appliedAt: doc.appliedAt
        }));
    } catch (error) {
        console.error('Error fetching applications:', error);
        return [];
    }
};

export const updateApplicationStatus = async (id: string, status: string): Promise<boolean> => {
    try {
        await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.APPLICATIONS,
            id,
            { status }
        );
        return true;
    } catch (error) {
        console.error('Error updating application status:', error);
        return false;
    }
};

// --- News ---
export const getNews = async (): Promise<NewsArticle[]> => {
    try {
        const response = await fetch(`${BASE_URL}/news`, { headers: getHeaders() });
        const data = await response.json();
        return data.map((doc: any) => ({
            id: doc.$id,
            title: doc.title,
            slug: doc.slug,
            content: doc.content,
            summary: doc.excerpt,
            image: doc.image,
            date: doc.publishedAt
        }));
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
};

export const getNewsArticleBySlug = async (slug: string): Promise<NewsArticle | undefined> => {
    try {
        const response = await fetch(`${BASE_URL}/news/${slug}`, { headers: getHeaders() });
        if (!response.ok) return undefined;
        const doc = await response.json();
        if (!doc) return undefined;
        return {
            id: doc.$id,
            title: doc.title,
            slug: doc.slug,
            content: doc.content,
            summary: doc.excerpt,
            image: doc.image,
            date: doc.publishedAt
        };
    } catch (error) {
        console.error('Error fetching news article:', error);
        return undefined;
    }
};

// --- Blog ---
export const getBlogPosts = async (): Promise<BlogPost[]> => {
    try {
        const response = await fetch(`${BASE_URL}/blog`, { headers: getHeaders() });
        const data = await response.json();
        return data.map((doc: any) => ({
            id: doc.$id,
            title: doc.title,
            slug: doc.slug,
            content: doc.content,
            summary: doc.excerpt,
            author: doc.author,
            image: doc.image,
            date: doc.publishedAt,
            tags: doc.tags
        }));
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
    try {
        const response = await fetch(`${BASE_URL}/blog/${slug}`, { headers: getHeaders() });
        if (!response.ok) return undefined;
        const doc = await response.json();
        if (!doc) return undefined;
        return {
            id: doc.$id,
            title: doc.title,
            slug: doc.slug,
            content: doc.content,
            summary: doc.excerpt,
            author: doc.author,
            image: doc.image,
            date: doc.publishedAt,
            tags: doc.tags
        };
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return undefined;
    }
};

export const getHigsEvent = async (): Promise<{ date: string; registrationUrl: string }> => {
    try {
        const response = await fetch(`${BASE_URL}/higs`, { headers: getHeaders() });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching HIGS event:', error);
        return { date: 'TBA', registrationUrl: 'https://luma.com/oyyhm42g' };
    }
};
