# Appwrite Database Setup Guide

## Step 1: Create Database in Appwrite Console

1. Go to your Appwrite Console: https://storage.lexrunit.com/console
2. Navigate to **Databases**
3. Click **Create Database**
4. Name it: `lexcare-db`
5. Copy the Database ID and save it (you'll need it for .env)

## Step 2: Create Collections

For each collection below, create it in your `lexcare-db` database:

### Collection: users
**Attributes:**
- `user_id` (string, 36, required) - Appwrite auth user ID
- `email` (email, required)
- `full_name` (string, 200, required)
- `first_name` (string, 100)
- `last_name` (string, 100)
- `phone` (string, 20)
- `date_of_birth` (datetime)
- `gender` (string, 20)
- `address` (string, 500)
- `emergency_contact_name` (string, 200)
- `emergency_contact_phone` (string, 20)
- `allergies` (string, 1000)
- `profile_image` (string, 500)
- `role` (string, 50, default: "patients")

**Indexes:**
- `user_id_idx` on `user_id` (unique)
- `email_idx` on `email` (unique)

**Permissions:**
- Read: Users (for document owner)
- Create: Users
- Update: Users (for document owner)
- Delete: Users (for document owner)

---

### Collection: notifications
**Attributes:**
- `user_id` (string, 36, required)
- `title` (string, 200, required)
- `message` (string, 1000, required)
- `type` (enum: ["appointment", "consultation", "payment", "alert", "general"], default: "general")
- `is_read` (boolean, default: false)

**Indexes:**
- `user_id_idx` on `user_id`
- `is_read_idx` on `is_read`

**Permissions:**
- Read: Users (for document owner by user_id)
- Update: Users (for document owner)

---

### Collection: appointments
**Attributes:**
- `user_id` (string, 36, required)
- `doctor_name` (string, 200, required)
- `department` (string, 200, required)
- `appointment_date` (datetime, required)
- `location` (string, 500, required)
- `notes` (string, 2000)
- `status` (enum: ["upcoming", "completed", "cancelled"], default: "upcoming")

**Indexes:**
- `user_id_idx` on `user_id`
- `appointment_date_idx` on `appointment_date`
- `status_idx` on `status`

**Permissions:**
- Read: Users (for document owner)
- Create: Users
- Update: Users (for document owner)
- Delete: Users (for document owner)

---

### Collection: health_records
**Attributes:**
- `user_id` (string, 36, required)
- `record_type` (enum: ["diagnosis", "allergy", "medication", "procedure", "lab_result", "vaccination"], required)
- `record_date` (datetime, required)
- `title` (string, 200, required)
- `description` (string, 5000, required)
- `doctor_name` (string, 200)
- `severity` (enum: ["low", "medium", "high"])
- `status` (enum: ["active", "resolved", "chronic"])
- `details` (string, 10000) - JSON string

**Indexes:**
- `user_id_idx` on `user_id`
- `record_type_idx` on `record_type`
- `record_date_idx` on `record_date`

**Permissions:**
- Read: Users (for document owner)
- Create: Users
- Update: Users (for document owner)

---

### Collection: vital_signs
**Attributes:**
- `user_id` (string, 36, required)
- `temperature` (float)
- `blood_pressure` (string, 20)
- `heart_rate` (integer)
- `weight` (float)
- `recorded_at` (datetime, required)

**Indexes:**
- `user_id_idx` on `user_id`
- `recorded_at_idx` on `recorded_at`

**Permissions:**
- Read: Users (for document owner)
- Create: Users
- Update: Users (for document owner)

---

### Collection: consultations
**Attributes:**
- `user_id` (string, 36, required)
- `status` (enum: ["pending", "processing", "completed"], default: "pending")
- `symptoms` (string, 5000, required)
- `ai_recommendation` (string, 10000)
- `doctor_approved` (boolean, default: false)
- `doctor_notes` (string, 5000)

**Indexes:**
- `user_id_idx` on `user_id`
- `status_idx` on `status`

**Permissions:**
- Read: Users (for document owner)
- Create: Users
- Update: Users (for document owner)

---

### Collection: chats
**Attributes:**
- `user_id` (string, 36, required)
- `title` (string, 200, required)
- `last_message` (string, 500)

**Indexes:**
- `user_id_idx` on `user_id`

**Permissions:**
- Read: Users (for document owner)
- Create: Users
- Update: Users (for document owner)
- Delete: Users (for document owner)

---

### Collection: chat_messages
**Attributes:**
- `user_id` (string, 36, required)
- `chat_id` (string, 36, required)
- `content` (string, 10000, required)
- `is_ai` (boolean, default: false)
- `media_url` (string, 500)
- `media_type` (enum: ["image", "audio", "video"])

**Indexes:**
- `user_id_idx` on `user_id`
- `chat_id_idx` on `chat_id`

**Permissions:**
- Read: Users (for document owner)
- Create: Users

---

### Collection: payments
**Attributes:**
- `user_id` (string, 36, required)
- `amount` (float, required)
- `status` (enum: ["pending", "completed", "failed"], default: "pending")
- `payment_method` (string, 100, required)
- `description` (string, 500, required)

**Indexes:**
- `user_id_idx` on `user_id`
- `status_idx` on `status`

**Permissions:**
- Read: Users (for document owner)
- Create: Users
- Update: Users (for document owner)

---

### Collection: feedback
**Attributes:**
- `user_id` (string, 36, required)
- `rating` (integer, required, min: 1, max: 5)
- `comment` (string, 2000)

**Indexes:**
- `user_id_idx` on `user_id`

**Permissions:**
- Read: Users (for document owner)
- Create: Users

---

## Step 3: Create Storage Buckets

1. Navigate to **Storage** in Appwrite Console
2. Create these buckets:

### Bucket: profile-images
- **Permissions:** 
  - Read: Users (for files they own)
  - Create: Users
  - Update: Users (for files they own)
  - Delete: Users (for files they own)
- **File Size Limit:** 5MB
- **Allowed File Extensions:** jpg, jpeg, png, gif, webp

### Bucket: chat-media
- **Permissions:**
  - Read: Users (for files they own)
  - Create: Users
  - Delete: Users (for files they own)
- **File Size Limit:** 10MB
- **Allowed File Extensions:** jpg, jpeg, png, gif, webp, mp3, mp4, wav, m4a

---

## Step 4: Update .env File

Add these environment variables to your `.env.local` file:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://storage.lexrunit.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=6935c930002b38d54673
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID=your_notifications_collection_id
NEXT_PUBLIC_APPWRITE_APPOINTMENTS_COLLECTION_ID=your_appointments_collection_id
NEXT_PUBLIC_APPWRITE_HEALTH_RECORDS_COLLECTION_ID=your_health_records_collection_id
NEXT_PUBLIC_APPWRITE_VITAL_SIGNS_COLLECTION_ID=your_vital_signs_collection_id
NEXT_PUBLIC_APPWRITE_CONSULTATIONS_COLLECTION_ID=your_consultations_collection_id
NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID=your_chats_collection_id
NEXT_PUBLIC_APPWRITE_CHAT_MESSAGES_COLLECTION_ID=your_chat_messages_collection_id
NEXT_PUBLIC_APPWRITE_PAYMENTS_COLLECTION_ID=your_payments_collection_id
NEXT_PUBLIC_APPWRITE_FEEDBACK_COLLECTION_ID=your_feedback_collection_id
NEXT_PUBLIC_APPWRITE_PROFILE_IMAGES_BUCKET_ID=your_profile_images_bucket_id
NEXT_PUBLIC_APPWRITE_CHAT_MEDIA_BUCKET_ID=your_chat_media_bucket_id

# LexCare AI API
NEXT_PUBLIC_LEXRUNIT_API_KEY=your_api_key_here
```

---

## Notes

1. **Collection IDs**: After creating each collection, copy its ID from the Appwrite Console
2. **Bucket IDs**: After creating each bucket, copy its ID
3. **Permissions**: Use the "Users" role for all permissions - Appwrite will automatically handle user-level access
4. **Document-level permissions**: For user-specific data, you can set document permissions on creation using `Permission.read(Role.user(userId))`
