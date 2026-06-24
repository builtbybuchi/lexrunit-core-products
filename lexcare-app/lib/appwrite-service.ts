import { databases, storage, DATABASE_ID, COLLECTIONS, BUCKETS, ID, Query, Permission, Role } from './appwrite';
import type { Models } from 'appwrite';

// Type definitions for our collections
export type UserProfile = {
    user_id: string;
    email: string;
    full_name: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    allergies?: string;
    profile_image?: string;
    role?: string;
};

export type Notification = {
    user_id: string;
    title: string;
    message: string;
    type?: 'appointment' | 'consultation' | 'payment' | 'alert' | 'general';
    is_read?: boolean;
};

export type Appointment = {
    user_id: string;
    doctor_name: string;
    department: string;
    appointment_date: string;
    location: string;
    notes?: string;
    status?: 'upcoming' | 'completed' | 'cancelled';
};

export type HealthRecord = {
    user_id: string;
    record_type: 'diagnosis' | 'allergy' | 'medication' | 'procedure' | 'lab_result' | 'vaccination';
    record_date: string;
    title: string;
    description: string;
    doctor_name?: string;
    severity?: 'low' | 'medium' | 'high';
    status?: 'active' | 'resolved' | 'chronic';
    details?: string;
};

export type VitalSign = {
    user_id: string;
    temperature?: number;
    blood_pressure?: string;
    heart_rate?: number;
    weight?: number;
    recorded_at: string;
};

export type Consultation = {
    user_id: string;
    status?: 'pending' | 'processing' | 'completed';
    symptoms: string;
    ai_recommendation?: string;
    doctor_approved?: boolean;
    doctor_notes?: string;
};

export type Chat = {
    user_id: string;
    title: string;
    last_message?: string;
};

export type ChatMessage = {
    user_id: string;
    chat_id: string;
    content: string;
    is_ai?: boolean;
    media_url?: string;
    media_type?: 'image' | 'audio' | 'video';
};

export type Payment = {
    user_id: string;
    amount: number;
    status?: 'pending' | 'completed' | 'failed';
    payment_method: string;
    description: string;
};

export type Feedback = {
    user_id: string;
    rating: number;
    comment?: string;
};

// Helper function to create user-specific permissions
function getUserPermissions(userId: string) {
    return [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
    ];
}

// User Profile functions
export const userProfileService = {
    async getByUserId(userId: string) {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [Query.equal('user_id', userId), Query.limit(1)]
        );
        return response.documents[0] as unknown as (Models.Document & UserProfile) | undefined;
    },

    async create(userId: string, data: Omit<UserProfile, 'user_id'>) {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            ID.unique(),
            { user_id: userId, ...data },
            getUserPermissions(userId)
        ) as unknown as Models.Document & UserProfile;
    },

    async update(documentId: string, data: Partial<UserProfile>) {
        return await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            documentId,
            data
        ) as unknown as Models.Document & UserProfile;
    },
};

// Notifications functions
export const notificationsService = {
    async getByUserId(userId: string) {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.NOTIFICATIONS,
            [Query.equal('user_id', userId), Query.orderDesc('$createdAt')]
        );
        return response.documents as unknown as (Models.Document & Notification)[];
    },

    async markAsRead(documentId: string) {
        return await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.NOTIFICATIONS,
            documentId,
            { is_read: true }
        );
    },

    async markAllAsRead(userId: string) {
        const notifications = await this.getByUserId(userId);
        const unread = notifications.filter(n => !n.is_read);
        return Promise.all(unread.map(n => this.markAsRead(n.$id)));
    },

    async delete(documentId: string) {
        return await databases.deleteDocument(
            DATABASE_ID,
            COLLECTIONS.NOTIFICATIONS,
            documentId
        );
    },
};

// Appointments functions
export const appointmentsService = {
    async getByUserId(userId: string) {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.APPOINTMENTS,
            [Query.equal('user_id', userId), Query.orderAsc('appointment_date')]
        );
        return response.documents as unknown as (Models.Document & Appointment)[];
    },

    async create(userId: string, data: Omit<Appointment, 'user_id'>) {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.APPOINTMENTS,
            ID.unique(),
            { user_id: userId, ...data },
            getUserPermissions(userId)
        ) as unknown as Models.Document & Appointment;
    },

    async update(documentId: string, data: Partial<Appointment>) {
        return await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.APPOINTMENTS,
            documentId,
            data
        ) as unknown as Models.Document & Appointment;
    },

    async cancel(documentId: string) {
        return this.update(documentId, { status: 'cancelled' });
    },
};

// Health Records functions
export const healthRecordsService = {
    async getByUserId(userId: string) {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.HEALTH_RECORDS,
            [Query.equal('user_id', userId), Query.orderDesc('record_date')]
        );
        return response.documents as unknown as (Models.Document & HealthRecord)[];
    },

    async create(userId: string, data: Omit<HealthRecord, 'user_id'>) {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.HEALTH_RECORDS,
            ID.unique(),
            { user_id: userId, ...data },
            getUserPermissions(userId)
        ) as unknown as Models.Document & HealthRecord;
    },
};

// Vital Signs functions
export const vitalSignsService = {
    async getByUserId(userId: string, limit = 100) {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.VITAL_SIGNS,
            [Query.equal('user_id', userId), Query.orderDesc('recorded_at'), Query.limit(limit)]
        );
        return response.documents as unknown as (Models.Document & VitalSign)[];
    },

    async create(userId: string, data: Omit<VitalSign, 'user_id'>) {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.VITAL_SIGNS,
            ID.unique(),
            { user_id: userId, ...data },
            getUserPermissions(userId)
        ) as unknown as Models.Document & VitalSign;
    },
};

// Consultations functions
export const consultationsService = {
    async getByUserId(userId: string) {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.CONSULTATIONS,
            [Query.equal('user_id', userId), Query.orderDesc('$createdAt')]
        );
        return response.documents as unknown as (Models.Document & Consultation)[];
    },

    async create(userId: string, data: Omit<Consultation, 'user_id'>) {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.CONSULTATIONS,
            ID.unique(),
            { user_id: userId, ...data },
            getUserPermissions(userId)
        ) as unknown as Models.Document & Consultation;
    },
};

// Chats functions
export const chatsService = {
    async getByUserId(userId: string) {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.CHATS,
            [Query.equal('user_id', userId), Query.orderDesc('$createdAt')]
        );
        return response.documents as unknown as (Models.Document & Chat)[];
    },

    async create(userId: string, data: Omit<Chat, 'user_id'>) {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.CHATS,
            ID.unique(),
            { user_id: userId, ...data },
            getUserPermissions(userId)
        ) as unknown as Models.Document & Chat;
    },

    async update(documentId: string, data: Partial<Chat>) {
        return await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.CHATS,
            documentId,
            data
        ) as unknown as Models.Document & Chat;
    },

    async delete(documentId: string) {
        return await databases.deleteDocument(
            DATABASE_ID,
            COLLECTIONS.CHATS,
            documentId
        );
    },
};

// Chat Messages functions
export const chatMessagesService = {
    async getByChatId(chatId: string) {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.CHAT_MESSAGES,
            [Query.equal('chat_id', chatId), Query.orderAsc('$createdAt')]
        );
        return response.documents as unknown as (Models.Document & ChatMessage)[];
    },

    async create(userId: string, data: Omit<ChatMessage, 'user_id'>) {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.CHAT_MESSAGES,
            ID.unique(),
            { user_id: userId, ...data },
            getUserPermissions(userId)
        ) as unknown as Models.Document & ChatMessage;
    },
};

// Payments functions
export const paymentsService = {
    async getByUserId(userId: string) {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.PAYMENTS,
            [Query.equal('user_id', userId), Query.orderDesc('$createdAt')]
        );
        return response.documents as unknown as (Models.Document & Payment)[];
    },

    async create(userId: string, data: Omit<Payment, 'user_id'>) {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.PAYMENTS,
            ID.unique(),
            { user_id: userId, ...data },
            getUserPermissions(userId)
        ) as unknown as Models.Document & Payment;
    },

    async updateStatus(documentId: string, status: 'pending' | 'completed' | 'failed') {
        return await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.PAYMENTS,
            documentId,
            { status }
        );
    },
};

// Feedback functions
export const feedbackService = {
    async create(userId: string, data: Omit<Feedback, 'user_id'>) {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.FEEDBACK,
            ID.unique(),
            { user_id: userId, ...data },
            getUserPermissions(userId)
        ) as unknown as Models.Document & Feedback;
    },
};

// Storage functions
export const storageService = {
    // Profile Images
    async uploadProfileImage(userId: string, file: File) {
        const fileId = ID.unique();
        const uploadedFile = await storage.createFile(
            BUCKETS.PROFILE_IMAGES,
            fileId,
            file,
            [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId)),
            ]
        );
        
        // Get file URL
        const fileUrl = storage.getFileView(BUCKETS.PROFILE_IMAGES, uploadedFile.$id);
        return { fileId: uploadedFile.$id, url: fileUrl };
    },

    async deleteProfileImage(fileId: string) {
        return await storage.deleteFile(BUCKETS.PROFILE_IMAGES, fileId);
    },

    getProfileImageUrl(fileId: string) {
        return storage.getFileView(BUCKETS.PROFILE_IMAGES, fileId);
    },

    // Chat Media
    async uploadChatMedia(userId: string, file: File) {
        const fileId = ID.unique();
        const uploadedFile = await storage.createFile(
            BUCKETS.CHAT_MEDIA,
            fileId,
            file,
            [
                Permission.read(Role.user(userId)),
                Permission.delete(Role.user(userId)),
            ]
        );
        
        const fileUrl = storage.getFileView(BUCKETS.CHAT_MEDIA, uploadedFile.$id);
        return { fileId: uploadedFile.$id, url: fileUrl };
    },

    async deleteChatMedia(fileId: string) {
        return await storage.deleteFile(BUCKETS.CHAT_MEDIA, fileId);
    },

    getChatMediaUrl(fileId: string) {
        return storage.getFileView(BUCKETS.CHAT_MEDIA, fileId);
    },
};
