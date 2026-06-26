import { Client, Account, Databases } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('lexrunit-general-db');

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = 'website-db';
export const COLLECTIONS = {
    CONTACTS: 'contacts',
    SUBSCRIPTIONS: 'subscriptions',
    PARTNERS: 'partners', // For hospital inquiries
    HOSPITALS: 'hospitals', // For registered hospitals
    BLOGS: 'blogs',
    NEWS: 'news',
    JOBS: 'jobs',
    APPLICATIONS: 'applications',
    WAITLIST: 'waitlist',
    FEEDBACK: 'feedback',
    HIGS_EVENTS: 'higs_events',
    SETTINGS: 'settings',
};

export const BUCKET_ID = 'resumes';
