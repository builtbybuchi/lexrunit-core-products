import { Client, Databases, Storage, Permission, Role } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('lexrunit-general-db')
    .setKey('standard_f8c9fc153a47184784fb9ec3e68ed3b0dec070e4409f9cc4d3a69a7992eacef304813a7c00ec5d5b76458c78c2de32c52725a00530e8c520e47be7b2795b88c7bc08a069e8e14ef630648d6f65905d5081ad9492c00d0424ea00245214e783fb5e977686e00a0d02b7090a8bebffa2276e410ecfc8efa69aab83010cfdf49d7d');

const databases = new Databases(client);

const DATABASE_ID = 'website-db';

const COLLECTIONS = [
    {
        id: 'contacts',
        name: 'Contacts',
        permissions: [
            Permission.create(Role.any()),
            Permission.read(Role.users()), // Allow logged in users (admins) to read
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ],
        attributes: [
            { key: 'name', type: 'string', size: 128, required: true },
            { key: 'email', type: 'email', required: true },
            { key: 'subject', type: 'string', size: 256, required: true },
            { key: 'message', type: 'string', size: 5000, required: true },
            { key: 'createdAt', type: 'datetime', required: true },
        ]
    },
    {
        id: 'subscriptions',
        name: 'Subscriptions',
        permissions: [
            Permission.create(Role.any()),
            Permission.read(Role.users()),
            Permission.delete(Role.users()),
        ],
        attributes: [
            { key: 'email', type: 'email', required: true },
            { key: 'createdAt', type: 'datetime', required: true },
        ],
        indexes: [
            { key: 'email_index', type: 'unique', attributes: ['email'] }
        ]
    },
    {
        id: 'partners',
        name: 'Partner Inquiries',
        permissions: [
            Permission.create(Role.any()),
            Permission.read(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ],
        attributes: [
            { key: 'hospitalName', type: 'string', size: 128, required: true },
            { key: 'contactPerson', type: 'string', size: 128, required: true },
            { key: 'email', type: 'email', required: true },
            { key: 'phone', type: 'string', size: 50, required: true },
            { key: 'address', type: 'string', size: 256, required: true },
            { key: 'message', type: 'string', size: 5000, required: false },
            { key: 'status', type: 'string', size: 20, required: true, default: 'pending' },
            { key: 'createdAt', type: 'datetime', required: true },
        ]
    },
    {
        id: 'hospitals',
        name: 'Hospitals',
        permissions: [
            Permission.read(Role.any()), // Publicly visible
            Permission.create(Role.users()), // Only admins
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ],
        attributes: [
            { key: 'name', type: 'string', size: 128, required: true },
            { key: 'address', type: 'string', size: 256, required: true },
            { key: 'city', type: 'string', size: 64, required: true },
            { key: 'state', type: 'string', size: 64, required: true },
            { key: 'products', type: 'string', size: 64, required: false, array: true },
            { key: 'website', type: 'url', required: false },
            { key: 'phone', type: 'string', size: 50, required: false },
            { key: 'email', type: 'email', required: false },
        ],
        indexes: [
            { key: 'city_state_index', type: 'key', attributes: ['city', 'state'] },
            { key: 'products_index', type: 'key', attributes: ['products'] }
        ]
    },
    {
        id: 'blogs',
        name: 'Blogs',
        permissions: [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ],
        attributes: [
            { key: 'title', type: 'string', size: 256, required: true },
            { key: 'slug', type: 'string', size: 256, required: true },
            { key: 'content', type: 'string', size: 10000, required: true },
            { key: 'excerpt', type: 'string', size: 500, required: true },
            { key: 'author', type: 'string', size: 128, required: true },
            { key: 'image', type: 'url', required: true },
            { key: 'publishedAt', type: 'datetime', required: true },
            { key: 'tags', type: 'string', size: 64, required: false, array: true },
        ],
        indexes: [
            { key: 'slug_index', type: 'unique', attributes: ['slug'] }
        ]
    },
    {
        id: 'news',
        name: 'News',
        permissions: [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ],
        attributes: [
            { key: 'title', type: 'string', size: 256, required: true },
            { key: 'slug', type: 'string', size: 256, required: true },
            { key: 'content', type: 'string', size: 10000, required: true },
            { key: 'excerpt', type: 'string', size: 500, required: true },
            { key: 'image', type: 'url', required: true },
            { key: 'publishedAt', type: 'datetime', required: true },
        ],
        indexes: [
            { key: 'slug_index', type: 'unique', attributes: ['slug'] }
        ]
    },
    {
        id: 'jobs',
        name: 'Jobs',
        permissions: [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ],
        attributes: [
            { key: 'title', type: 'string', size: 256, required: true },
            { key: 'location', type: 'string', size: 128, required: true },
            { key: 'type', type: 'string', size: 64, required: true },
            { key: 'description', type: 'string', size: 5000, required: true },
            { key: 'requirements', type: 'string', size: 5000, required: true },
            { key: 'salary', type: 'string', size: 128, required: false },
            { key: 'publishedAt', type: 'datetime', required: true },
        ]
    },
    {
        id: 'applications',
        name: 'Job Applications',
        permissions: [
            Permission.create(Role.any()),
            Permission.read(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ],
        attributes: [
            { key: 'jobId', type: 'string', size: 64, required: true },
            { key: 'jobTitle', type: 'string', size: 256, required: true },
            { key: 'fullName', type: 'string', size: 128, required: true },
            { key: 'email', type: 'email', required: true },
            { key: 'phone', type: 'string', size: 50, required: true },
            { key: 'resumeUrl', type: 'url', required: true },
            { key: 'coverLetter', type: 'string', size: 5000, required: false },
            { key: 'status', type: 'string', size: 32, required: true, default: 'pending' },
            { key: 'appliedAt', type: 'datetime', required: true },
        ]
    },
    {
        id: 'waitlist',
        name: 'Waitlist',
        permissions: [
            Permission.create(Role.any()),
            Permission.read(Role.users()),
            Permission.delete(Role.users()),
        ],
        attributes: [
            { key: 'name', type: 'string', size: 128, required: true },
            { key: 'email', type: 'email', required: true },
            { key: 'createdAt', type: 'datetime', required: true },
        ],
        indexes: [
            { key: 'email_index', type: 'unique', attributes: ['email'] }
        ]
    },
    {
        id: 'feedback',
        name: 'Feedback',
        permissions: [
            Permission.create(Role.any()),
            Permission.read(Role.users()),
            Permission.delete(Role.users()),
        ],
        attributes: [
            { key: 'name', type: 'string', size: 128, required: true },
            { key: 'email', type: 'email', required: true },
            { key: 'product', type: 'string', size: 64, required: true },
            { key: 'rating', type: 'string', size: 10, required: true },
            { key: 'message', type: 'string', size: 5000, required: true },
            { key: 'createdAt', type: 'datetime', required: true },
        ]
    }
];

const BUCKETS = [
    {
        id: 'resumes',
        name: 'Resumes',
        permissions: [
            Permission.create(Role.any()),
            Permission.read(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ],
        fileSecurity: true,
        enabled: true,
        maxFileSize: 5242880, // 5MB
        allowedFileExtensions: ['pdf', 'doc', 'docx']
    }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function retry(fn, retries = 3, delay = 2000) {
    try {
        return await fn();
    } catch (error) {
        if (retries > 0) {
            console.log(`Operation failed, retrying in ${delay}ms... (${retries} retries left)`);
            await sleep(delay);
            return retry(fn, retries - 1, delay * 2);
        }
        throw error;
    }
}

async function setup() {
    try {
        // 1. Check/Create Database
        try {
            await retry(() => databases.get(DATABASE_ID));
            console.log(`Database ${DATABASE_ID} exists.`);
        } catch (error) {
            console.log(`Database ${DATABASE_ID} not found. Creating...`);
            await retry(() => databases.create(DATABASE_ID, 'Website DB'));
            console.log(`Database ${DATABASE_ID} created.`);
        }

        // 2. Process Collections
        for (const col of COLLECTIONS) {
            console.log(`Processing collection: ${col.name} (${col.id})...`);

            try {
                await retry(() => databases.getCollection(DATABASE_ID, col.id));
                console.log(`Collection ${col.id} exists.`);
            } catch (error) {
                console.log(`Creating collection ${col.id}...`);
                await retry(() => databases.createCollection(DATABASE_ID, col.id, col.name, col.permissions));
                console.log(`Collection ${col.id} created.`);
            }

            await sleep(1000); // Delay between collection ops

            // 3. Attributes
            for (const attr of col.attributes) {
                if (attr.key === 'createdAt') continue; // Skip createdAt, use system $createdAt

                try {
                    if (attr.type === 'string') {
                        await retry(() => databases.createStringAttribute(DATABASE_ID, col.id, attr.key, attr.size, attr.required, attr.default, attr.array));
                    } else if (attr.type === 'email') {
                        await retry(() => databases.createEmailAttribute(DATABASE_ID, col.id, attr.key, attr.required, attr.default, attr.array));
                    } else if (attr.type === 'url') {
                        await retry(() => databases.createUrlAttribute(DATABASE_ID, col.id, attr.key, attr.required, attr.default, attr.array));
                    } else if (attr.type === 'datetime') {
                        await retry(() => databases.createDatetimeAttribute(DATABASE_ID, col.id, attr.key, attr.required, attr.default, attr.array));
                    } else if (attr.type === 'boolean') {
                        await retry(() => databases.createBooleanAttribute(DATABASE_ID, col.id, attr.key, attr.required, attr.default, attr.array));
                    }
                    console.log(`Attribute ${attr.key} created.`);
                    await sleep(1000); // Delay between attribute creations
                } catch (error) {
                    if (error.code === 409) {
                        console.log(`Attribute ${attr.key} already exists.`);
                    } else {
                        console.error(`Error creating attribute ${attr.key}:`, error.message);
                    }
                }
            }

            // 4. Indexes
            if (col.indexes) {
                console.log('Waiting for attributes to be available before indexing...');
                await sleep(5000); // Increased wait time

                for (const idx of col.indexes) {
                    try {
                        await retry(() => databases.createIndex(DATABASE_ID, col.id, idx.key, idx.type, idx.attributes));
                        console.log(`Index ${idx.key} created.`);
                    } catch (error) {
                        if (error.code === 409) {
                            console.log(`Index ${idx.key} already exists.`);
                        } else {
                            console.error(`Error creating index ${idx.key}:`, error.message);
                        }
                    }
                    await sleep(1000);
                }
            }
        }

        // 5. Buckets
        const storage = new Storage(client);
        for (const bucket of BUCKETS) {
            console.log(`Processing bucket: ${bucket.name} (${bucket.id})...`);
            try {
                await retry(() => storage.getBucket(bucket.id));
                console.log(`Bucket ${bucket.id} exists.`);
            } catch (error) {
                console.log(`Creating bucket ${bucket.id}...`);
                await retry(() => storage.createBucket(
                    bucket.id,
                    bucket.name,
                    bucket.permissions,
                    bucket.fileSecurity,
                    bucket.enabled,
                    bucket.maxFileSize,
                    bucket.allowedFileExtensions
                ));
                console.log(`Bucket ${bucket.id} created.`);
            }
            await sleep(1000);
        }

        console.log('Setup complete!');
    } catch (error) {
        console.error('Setup failed:', error);
    }
}

setup();
