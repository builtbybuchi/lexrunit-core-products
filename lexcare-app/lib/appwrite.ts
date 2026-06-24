import { Client, Account, Databases, Storage, Query } from 'appwrite';

export const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://storage.lexrunit.com/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6935c930002b38d54673');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query, Permission, Role } from 'appwrite';

// Database and Collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const COLLECTIONS = {
    USERS: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
    NOTIFICATIONS: process.env.NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID!,
    APPOINTMENTS: process.env.NEXT_PUBLIC_APPWRITE_APPOINTMENTS_COLLECTION_ID!,
    HEALTH_RECORDS: process.env.NEXT_PUBLIC_APPWRITE_HEALTH_RECORDS_COLLECTION_ID!,
    VITAL_SIGNS: process.env.NEXT_PUBLIC_APPWRITE_VITAL_SIGNS_COLLECTION_ID!,
    CONSULTATIONS: process.env.NEXT_PUBLIC_APPWRITE_CONSULTATIONS_COLLECTION_ID!,
    CHATS: process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID!,
    CHAT_MESSAGES: process.env.NEXT_PUBLIC_APPWRITE_CHAT_MESSAGES_COLLECTION_ID!,
    PAYMENTS: process.env.NEXT_PUBLIC_APPWRITE_PAYMENTS_COLLECTION_ID!,
    FEEDBACK: process.env.NEXT_PUBLIC_APPWRITE_FEEDBACK_COLLECTION_ID!,
};

// Storage Bucket IDs
export const BUCKETS = {
    PROFILE_IMAGES: process.env.NEXT_PUBLIC_APPWRITE_PROFILE_IMAGES_BUCKET_ID!,
    CHAT_MEDIA: process.env.NEXT_PUBLIC_APPWRITE_CHAT_MEDIA_BUCKET_ID!,
};
