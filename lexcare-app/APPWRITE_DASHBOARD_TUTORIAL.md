# Appwrite Dashboard Setup Tutorial

This guide will walk you through setting up your LexCare database in the Appwrite Console step-by-step.

---

## Part 1: Creating the Database

### Step 1: Access Your Appwrite Console
1. Open your browser and go to: **https://storage.lexrunit.com/console**
2. Log in with your credentials
3. Select your project (ID: `6935c930002b38d54673`)

### Step 2: Create the Database
1. In the left sidebar, click **"Databases"**
2. Click the **"Create database"** button (top right)
3. Enter the name: `lexcare-db`
4. Click **"Create"**
5. ✅ **IMPORTANT:** Copy the Database ID that appears - save it in a text file!

---

## Part 2: Creating a Collection (Example: users)

I'll walk you through creating the **users** collection in detail. You'll repeat similar steps for all other collections.

### Step 1: Create the Collection
1. Inside your `lexcare-db` database, click **"Create collection"**
2. Enter Collection name: `users`
3. Click **"Create"**
4. ✅ **Copy the Collection ID** - save it as `USERS_COLLECTION_ID`

### Step 2: Add Attributes
Now you'll add each field (attribute) to the collection.

#### Adding a String Attribute (Example: user_id)
1. Click the **"Attributes"** tab
2. Click **"Create attribute"**
3. Select **"String"**
4. Fill in the form:
   - **Attribute Key:** `user_id`
   - **Size:** `36`
   - **Required:** ✅ Check this box
   - **Array:** ❌ Leave unchecked
   - **Default value:** Leave empty
5. Click **"Create"**

#### Adding an Email Attribute
1. Click **"Create attribute"**
2. Select **"Email"**
3. Fill in:
   - **Attribute Key:** `email`
   - **Required:** ✅ Check this box
4. Click **"Create"**

#### Adding a String Attribute with Default Value
1. Click **"Create attribute"**
2. Select **"String"**
3. Fill in:
   - **Attribute Key:** `role`
   - **Size:** `50`
   - **Required:** ❌ Leave unchecked
   - **Default value:** `patients`
4. Click **"Create"**

#### Adding a DateTime Attribute
1. Click **"Create attribute"**
2. Select **"DateTime"**
3. Fill in:
   - **Attribute Key:** `date_of_birth`
   - **Required:** ❌ Leave unchecked
4. Click **"Create"**

#### Adding a Float/Decimal Attribute (for vital_signs later)
1. Click **"Create attribute"**
2. Select **"Float"**
3. Fill in:
   - **Attribute Key:** `temperature`
   - **Required:** ❌ Leave unchecked
   - **Min:** Leave empty
   - **Max:** Leave empty
4. Click **"Create"**

#### Adding an Integer Attribute (for vital_signs later)
1. Click **"Create attribute"**
2. Select **"Integer"**
3. Fill in:
   - **Attribute Key:** `heart_rate`
   - **Required:** ❌ Leave unchecked
4. Click **"Create"**

#### Adding a Boolean Attribute (for notifications later)
1. Click **"Create attribute"**
2. Select **"Boolean"**
3. Fill in:
   - **Attribute Key:** `is_read`
   - **Required:** ❌ Leave unchecked
   - **Default value:** `false`
4. Click **"Create"**

#### Adding an Enum Attribute (for notifications type)
1. Click **"Create attribute"**
2. Select **"Enum"**
3. Fill in:
   - **Attribute Key:** `type`
   - **Elements:** Click "Add element" for each:
     - `appointment`
     - `consultation`
     - `payment`
     - `alert`
     - `general`
   - **Required:** ❌ Leave unchecked
   - **Default value:** `general`
4. Click **"Create"**

### Step 3: Create Indexes
Indexes make queries faster.

1. Click the **"Indexes"** tab
2. Click **"Create index"**
3. Fill in:
   - **Index Key:** `user_id_idx`
   - **Type:** Select **"Key"**
   - **Attributes:** Click "Add attribute" and select `user_id`
   - **Orders:** Select `ASC` (ascending)
   - **Unique:** ✅ Check this box (for user_id_idx only)
4. Click **"Create"**

Repeat for `email_idx`:
1. Click **"Create index"**
2. **Index Key:** `email_idx`
3. **Attributes:** `email`
4. **Unique:** ✅ Check this box
5. Click **"Create"**

### Step 4: Set Permissions
This is crucial for security!

1. Click the **"Settings"** tab
2. Scroll down to **"Permissions"**
3. Click **"Add a role"**

#### For Read Permission:
1. Click **"Add a role"**
2. Select **"Users"** from the dropdown
3. In the permissions checkboxes, check **"Read"**
4. Click **"Add"**

#### For Create Permission:
1. Click **"Add a role"** again
2. Select **"Users"**
3. Check **"Create"**
4. Click **"Add"**

#### For Update Permission:
1. Click **"Add a role"** again
2. Select **"Users"**
3. Check **"Update"**
4. Click **"Add"**

#### For Delete Permission (if needed):
1. Click **"Add a role"** again
2. Select **"Users"**
3. Check **"Delete"**
4. Click **"Add"**

**Note:** You should now see multiple "Users" roles, each with different permissions checked. This is correct!

---

## Part 3: Complete Attribute List for Each Collection

### Collection: users (Complete all attributes)
**Repeat "Add Attribute" for each:**

| Attribute Key | Type | Size | Required | Default |
|--------------|------|------|----------|---------|
| user_id | String | 36 | ✅ | - |
| email | Email | - | ✅ | - |
| full_name | String | 200 | ✅ | - |
| first_name | String | 100 | ❌ | - |
| last_name | String | 100 | ❌ | - |
| phone | String | 20 | ❌ | - |
| date_of_birth | DateTime | - | ❌ | - |
| gender | String | 20 | ❌ | - |
| address | String | 500 | ❌ | - |
| emergency_contact_name | String | 200 | ❌ | - |
| emergency_contact_phone | String | 20 | ❌ | - |
| allergies | String | 1000 | ❌ | - |
| profile_image | String | 500 | ❌ | - |
| role | String | 50 | ❌ | patients |

**Indexes:**
- `user_id_idx` on `user_id` (unique)
- `email_idx` on `email` (unique)

**Permissions:** Read, Create, Update, Delete (all for "Users" role)

---

### Collection: notifications

| Attribute Key | Type | Size/Options | Required | Default |
|--------------|------|--------------|----------|---------|
| user_id | String | 36 | ✅ | - |
| title | String | 200 | ✅ | - |
| message | String | 1000 | ✅ | - |
| type | Enum | appointment, consultation, payment, alert, general | ❌ | general |
| is_read | Boolean | - | ❌ | false |

**Indexes:**
- `user_id_idx` on `user_id`
- `is_read_idx` on `is_read`

**Permissions:** Read, Update (for "Users" role)

---

### Collection: appointments

| Attribute Key | Type | Size/Options | Required | Default |
|--------------|------|--------------|----------|---------|
| user_id | String | 36 | ✅ | - |
| doctor_name | String | 200 | ✅ | - |
| department | String | 200 | ✅ | - |
| appointment_date | DateTime | - | ✅ | - |
| location | String | 500 | ✅ | - |
| notes | String | 2000 | ❌ | - |
| status | Enum | upcoming, completed, cancelled | ❌ | upcoming |

**Indexes:**
- `user_id_idx` on `user_id`
- `appointment_date_idx` on `appointment_date`
- `status_idx` on `status`

**Permissions:** Read, Create, Update, Delete

---

### Collection: health_records

| Attribute Key | Type | Size/Options | Required | Default |
|--------------|------|--------------|----------|---------|
| user_id | String | 36 | ✅ | - |
| record_type | Enum | diagnosis, allergy, medication, procedure, lab_result, vaccination | ✅ | - |
| record_date | DateTime | - | ✅ | - |
| title | String | 200 | ✅ | - |
| description | String | 5000 | ✅ | - |
| doctor_name | String | 200 | ❌ | - |
| severity | Enum | low, medium, high | ❌ | - |
| status | Enum | active, resolved, chronic | ❌ | - |
| details | String | 10000 | ❌ | - |

**Indexes:**
- `user_id_idx` on `user_id`
- `record_type_idx` on `record_type`
- `record_date_idx` on `record_date`

**Permissions:** Read, Create, Update

---

### Collection: vital_signs

| Attribute Key | Type | Size | Required | Default |
|--------------|------|------|----------|---------|
| user_id | String | 36 | ✅ | - |
| temperature | Float | - | ❌ | - |
| blood_pressure | String | 20 | ❌ | - |
| heart_rate | Integer | - | ❌ | - |
| weight | Float | - | ❌ | - |
| recorded_at | DateTime | - | ✅ | - |

**Indexes:**
- `user_id_idx` on `user_id`
- `recorded_at_idx` on `recorded_at`

**Permissions:** Read, Create, Update

---

### Collection: consultations

| Attribute Key | Type | Size/Options | Required | Default |
|--------------|------|--------------|----------|---------|
| user_id | String | 36 | ✅ | - |
| status | Enum | pending, processing, completed | ❌ | pending |
| symptoms | String | 5000 | ✅ | - |
| ai_recommendation | String | 10000 | ❌ | - |
| doctor_approved | Boolean | - | ❌ | false |
| doctor_notes | String | 5000 | ❌ | - |

**Indexes:**
- `user_id_idx` on `user_id`
- `status_idx` on `status`

**Permissions:** Read, Create, Update

---

### Collection: chats

| Attribute Key | Type | Size | Required | Default |
|--------------|------|------|----------|---------|
| user_id | String | 36 | ✅ | - |
| title | String | 200 | ✅ | - |
| last_message | String | 500 | ❌ | - |

**Indexes:**
- `user_id_idx` on `user_id`

**Permissions:** Read, Create, Update, Delete

---

### Collection: chat_messages

| Attribute Key | Type | Size/Options | Required | Default |
|--------------|------|--------------|----------|---------|
| user_id | String | 36 | ✅ | - |
| chat_id | String | 36 | ✅ | - |
| content | String | 10000 | ✅ | - |
| is_ai | Boolean | - | ❌ | false |
| media_url | String | 500 | ❌ | - |
| media_type | Enum | image, audio, video | ❌ | - |

**Indexes:**
- `user_id_idx` on `user_id`
- `chat_id_idx` on `chat_id`

**Permissions:** Read, Create

---

### Collection: payments

| Attribute Key | Type | Size/Options | Required | Default |
|--------------|------|--------------|----------|---------|
| user_id | String | 36 | ✅ | - |
| amount | Float | - | ✅ | - |
| status | Enum | pending, completed, failed | ❌ | pending |
| payment_method | String | 100 | ✅ | - |
| description | String | 500 | ✅ | - |

**Indexes:**
- `user_id_idx` on `user_id`
- `status_idx` on `status`

**Permissions:** Read, Create, Update

---

### Collection: feedback

| Attribute Key | Type | Size | Required | Default |
|--------------|------|------|----------|---------|
| user_id | String | 36 | ✅ | - |
| rating | Integer | - | ✅ | - |
| comment | String | 2000 | ❌ | - |

**Note:** For rating, after creating the integer attribute:
1. Click on the `rating` attribute to edit it
2. Set **Min:** `1`
3. Set **Max:** `5`
4. Click **"Update"**

**Indexes:**
- `user_id_idx` on `user_id`

**Permissions:** Read, Create

---

## Part 4: Creating Storage Buckets

### Step 1: Navigate to Storage
1. In the left sidebar, click **"Storage"**
2. Click **"Create bucket"**

### Step 2: Create profile-images Bucket
1. **Bucket name:** `profile-images`
2. **Permissions:** Click "Add a role"
   - Select **"Users"** and check **"Read"**
   - Add another role: **"Users"** and check **"Create"**
   - Add another role: **"Users"** and check **"Update"**
   - Add another role: **"Users"** and check **"Delete"**
3. **File size limit:** `5242880` (5MB in bytes)
4. **Allowed file extensions:** In the text field, type:
   ```
   jpg,jpeg,png,gif,webp
   ```
5. Click **"Create"**
6. ✅ **Copy the Bucket ID** - save it as `PROFILE_IMAGES_BUCKET_ID`

### Step 3: Create chat-media Bucket
1. Click **"Create bucket"** again
2. **Bucket name:** `chat-media`
3. **Permissions:** 
   - **"Users"** - Read
   - **"Users"** - Create
   - **"Users"** - Delete
4. **File size limit:** `10485760` (10MB in bytes)
5. **Allowed file extensions:**
   ```
   jpg,jpeg,png,gif,webp,mp3,mp4,wav,m4a
   ```
6. Click **"Create"**
7. ✅ **Copy the Bucket ID** - save it as `CHAT_MEDIA_BUCKET_ID`

---

## Part 5: Collecting All IDs

After creating everything, you should have these IDs saved:

```
DATABASE_ID: [your database ID]
USERS_COLLECTION_ID: [from users collection]
NOTIFICATIONS_COLLECTION_ID: [from notifications collection]
APPOINTMENTS_COLLECTION_ID: [from appointments collection]
HEALTH_RECORDS_COLLECTION_ID: [from health_records collection]
VITAL_SIGNS_COLLECTION_ID: [from vital_signs collection]
CONSULTATIONS_COLLECTION_ID: [from consultations collection]
CHATS_COLLECTION_ID: [from chats collection]
CHAT_MESSAGES_COLLECTION_ID: [from chat_messages collection]
PAYMENTS_COLLECTION_ID: [from payments collection]
FEEDBACK_COLLECTION_ID: [from feedback collection]
PROFILE_IMAGES_BUCKET_ID: [from profile-images bucket]
CHAT_MEDIA_BUCKET_ID: [from chat-media bucket]
```

---

## Part 6: Update Your .env.local File

1. In your project root, create or edit `.env.local`
2. Add all your IDs:

```env
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
NEXT_PUBLIC_LEXRUNIT_API_KEY=your_api_key_here
```

3. Save the file

---

## Testing Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try to sign up with a test account
3. Check your Appwrite Console - you should see:
   - A new document in the **users** collection
   - The user should be able to log in successfully

---

## Common Issues & Solutions

### Issue: "Invalid permissions"
**Solution:** Make sure you added the "Users" role for each required permission (Read, Create, Update, Delete) in the collection settings.

### Issue: "Attribute not found"
**Solution:** Double-check that the attribute key matches exactly what's in the code (case-sensitive).

### Issue: "Document not found"
**Solution:** Check that document-level permissions are being set in the code using `getUserPermissions(userId)`.

### Issue: Can't upload images
**Solution:** Verify:
- File size is under the limit
- File extension is in the allowed list
- Bucket permissions include "Create" for Users role

---

## Need Help?

If you get stuck:
1. Check the Appwrite Console logs (in the project dashboard)
2. Check your browser console for errors
3. Verify all IDs are correctly copied to `.env.local`
4. Restart your dev server after changing `.env.local`

Good luck! 🚀
