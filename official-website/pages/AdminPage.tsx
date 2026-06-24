import React, { useState, useEffect } from 'react';
import { DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { Models, Query, ID } from 'appwrite';
import ContentEditor from '../components/admin/ContentEditor';
import { useUser, SignIn, useAuth } from '@clerk/clerk-react';

// Types
type Contact = Models.Document & {
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
};

type Subscription = Models.Document & {
    email: string;
    createdAt: string;
};

type Partner = Models.Document & {
    hospitalName: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    message?: string;
    status: string;
    createdAt: string;
};

type Hospital = Models.Document & {
    name: string;
    address: string;
    city: string;
    state: string;
    products?: string[];
    website?: string;
    phone?: string;
    email?: string;
};

type BlogPost = Models.Document & {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author: string;
    image: string;
    tags?: string[];
    publishedAt: string;
};

type NewsArticle = Models.Document & {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image: string;
    publishedAt: string;
};

type WaitlistEntry = Models.Document & {
    name: string;
    email: string;
    createdAt: string;
};

type Job = Models.Document & {
    title: string;
    location: string;
    type: string;
    description: string;
    requirements: string;
    salary?: string;
    publishedAt: string;
};

type FeedbackEntry = Models.Document & {
    name: string;
    email: string;
    product: string;
    rating: string;
    message: string;
    createdAt: string;
};

const AdminPage: React.FC = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    const { getToken } = useAuth();

    const apiDb = {
        listDocuments: async (dbId: string, collectionId: string, queries?: any[]) => {
            const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL || 'http://localhost:8001/api/v1';
            const token = await getToken();
            const res = await fetch(`${BASE_URL}/admin/collections/${collectionId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('API Error');
            const data = await res.json();
            return { documents: data };
        },
        createDocument: async (dbId: string, collectionId: string, docId: string, data: any) => {
            const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL || 'http://localhost:8001/api/v1';
            const token = await getToken();
            const res = await fetch(`${BASE_URL}/admin/collections/${collectionId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('API Error');
            return res.json();
        },
        updateDocument: async (dbId: string, collectionId: string, docId: string, data: any) => {
            const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL || 'http://localhost:8001/api/v1';
            const token = await getToken();
            const res = await fetch(`${BASE_URL}/admin/collections/${collectionId}/${docId}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('API Error');
            return res.json();
        },
        deleteDocument: async (dbId: string, collectionId: string, docId: string) => {
            const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL || 'http://localhost:8001/api/v1';
            const token = await getToken();
            const res = await fetch(`${BASE_URL}/admin/collections/${collectionId}/${docId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('API Error');
            return res.json();
        }
    };

    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState<'inquiries' | 'contacts' | 'subscriptions' | 'hospitals' | 'blogs' | 'news' | 'jobs' | 'waitlist' | 'feedback' | 'higs'>('inquiries');

    // Data states
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
    const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);

    // Hospital Registration Form State
    const [hospitalForm, setHospitalForm] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        products: [] as string[],
        website: '',
        phone: '',
        email: ''
    });
    const [regStatus, setRegStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);

    // Blog/News Editor State
    const [isEditingContent, setIsEditingContent] = useState(false);
    const [contentType, setContentType] = useState<'blog' | 'news' | null>(null);
    const [editingItem, setEditingItem] = useState<BlogPost | NewsArticle | null>(null);
    const [contentForm, setContentForm] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        author: '',
        image: '',
        tags: '',
        publishedAt: new Date().toISOString().slice(0, 16)
    });

    // Job Editor State
    const [isEditingJob, setIsEditingJob] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [jobForm, setJobForm] = useState({
        title: '',
        location: '',
        type: 'Full-time',
        description: '',
        requirements: '',
        salary: '',
        publishedAt: new Date().toISOString().slice(0, 16)
    });

    useEffect(() => {
        if (isLoaded) {
            if (isSignedIn && user) {
                const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL || 'http://localhost:8001/api/v1';
                getToken().then(token => {
                    fetch(`${BASE_URL}/users/role`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.role === 'admin') {
                            setIsAdmin(true);
                        } else {
                            setIsAdmin(false);
                            alert('You are not authorized as an admin.');
                        }
                    })
                    .catch(() => setIsAdmin(false))
                    .finally(() => setLoading(false));
                });
            } else {
                setLoading(false);
            }
        }
    }, [isLoaded, isSignedIn, user]);

    useEffect(() => {
        if (isAdmin) {
            fetchData();
        }
    }, [isAdmin, activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'contacts') {
                const res = await apiDb.listDocuments(DATABASE_ID, COLLECTIONS.CONTACTS, [Query.orderDesc('$createdAt')]);
                setContacts(res.documents as unknown as Contact[]);
            } else if (activeTab === 'subscriptions') {
                const res = await apiDb.listDocuments(DATABASE_ID, COLLECTIONS.SUBSCRIPTIONS, [Query.orderDesc('$createdAt')]);
                setSubscriptions(res.documents as unknown as Subscription[]);
            } else if (activeTab === 'inquiries') {
                const res = await apiDb.listDocuments(DATABASE_ID, COLLECTIONS.PARTNERS, [Query.orderDesc('$createdAt')]);
                setPartners(res.documents as unknown as Partner[]);
            } else if (activeTab === 'hospitals') {
                const res = await apiDb.listDocuments(DATABASE_ID, COLLECTIONS.HOSPITALS, [Query.orderDesc('$createdAt')]);
                setHospitals(res.documents as unknown as Hospital[]);
            } else if (activeTab === 'blogs') {
                const res = await apiDb.listDocuments(DATABASE_ID, COLLECTIONS.BLOGS, [Query.orderDesc('publishedAt')]);
                setBlogs(res.documents as unknown as BlogPost[]);
            } else if (activeTab === 'news') {
                const res = await apiDb.listDocuments(DATABASE_ID, COLLECTIONS.NEWS, [Query.orderDesc('publishedAt')]);
                setNews(res.documents as unknown as NewsArticle[]);
            } else if (activeTab === 'jobs') {
                const res = await apiDb.listDocuments(DATABASE_ID, COLLECTIONS.JOBS, [Query.orderDesc('publishedAt')]);
                setJobs(res.documents as unknown as Job[]);
            } else if (activeTab === 'waitlist') {
                const res = await apiDb.listDocuments(DATABASE_ID, COLLECTIONS.WAITLIST, [Query.orderDesc('$createdAt')]);
                setWaitlist(res.documents as unknown as WaitlistEntry[]);
            } else if (activeTab === 'feedback') {
                const res = await apiDb.listDocuments(DATABASE_ID, COLLECTIONS.FEEDBACK, [Query.orderDesc('$createdAt')]);
                setFeedback(res.documents as unknown as FeedbackEntry[]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // ... (Hospital handlers omitted for brevity, keeping existing ones if possible, but for replace_file_content I need to provide full content or careful chunks. Since I'm replacing the whole file effectively to restructure, I'll include them)

    const handleRegisterHospital = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegStatus('submitting');
        try {
            const trimmedPayload = {
                ...hospitalForm,
                name: hospitalForm.name.trim(),
                address: hospitalForm.address.trim(),
                city: hospitalForm.city.trim(),
                state: hospitalForm.state.trim()
            };

            (['website', 'phone', 'email'] as const).forEach((field) => {
                const value = hospitalForm[field].trim();
                if (value) {
                    (trimmedPayload as any)[field] = value;
                } else {
                    delete (trimmedPayload as any)[field];
                }
            });

            if (editingHospital) {
                await apiDb.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.HOSPITALS,
                    editingHospital.$id,
                    trimmedPayload
                );
            } else {
                await apiDb.createDocument(
                    DATABASE_ID,
                    COLLECTIONS.HOSPITALS,
                    ID.unique(),
                    trimmedPayload
                );
            }
            setRegStatus('success');
            cancelEditing();
            fetchData();
            setTimeout(() => setRegStatus('idle'), 3000);
        } catch (error) {
            console.error('Registration failed:', error);
            setRegStatus('error');
        }
    };

    const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setHospitalForm(prev => ({ ...prev, products: [...prev.products, value] }));
        } else {
            setHospitalForm(prev => ({ ...prev, products: prev.products.filter(p => p !== value) }));
        }
    };

    const handleHospitalInputChange = (field: keyof typeof hospitalForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setHospitalForm(prev => ({ ...prev, [field]: value }));
    };

    const startEditing = (hospital: Hospital) => {
        setEditingHospital(hospital);
        setHospitalForm({
            name: hospital.name,
            address: hospital.address,
            city: hospital.city,
            state: hospital.state,
            products: hospital.products || [],
            website: hospital.website || '',
            phone: hospital.phone || '',
            email: hospital.email || ''
        });
    };

    const cancelEditing = () => {
        setEditingHospital(null);
        setHospitalForm({
            name: '',
            address: '',
            city: '',
            state: '',
            products: [],
            website: '',
            phone: '',
            email: ''
        });
    };

    const handleDelete = async (collectionId: string, documentId: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            await apiDb.deleteDocument(DATABASE_ID, collectionId, documentId);
            fetchData();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete item.');
        }
    };

    const handleStatusUpdate = async (documentId: string, newStatus: string) => {
        try {
            await apiDb.updateDocument(DATABASE_ID, COLLECTIONS.PARTNERS, documentId, { status: newStatus });
            fetchData();
        } catch (error) {
            console.error('Status update failed:', error);
        }
    };

    // Content Editor Handlers
    const openEditor = (type: 'blog' | 'news', item?: BlogPost | NewsArticle) => {
        setContentType(type);
        setEditingItem(item || null);
        if (item) {
            setContentForm({
                title: item.title,
                slug: item.slug,
                content: item.content,
                excerpt: item.excerpt,
                author: (item as BlogPost).author || '',
                image: item.image,
                tags: (item as BlogPost).tags?.join(', ') || '',
                publishedAt: new Date(item.publishedAt).toISOString().slice(0, 16)
            });
        } else {
            setContentForm({
                title: '',
                slug: '',
                content: '',
                excerpt: '',
                author: user?.fullName || 'Admin',
                image: '',
                tags: '',
                publishedAt: new Date().toISOString().slice(0, 16)
            });
        }
        setIsEditingContent(true);
    };

    const closeEditor = () => {
        setIsEditingContent(false);
        setEditingItem(null);
        setContentType(null);
    };

    const handleContentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contentType) return;

        try {
            const payload: any = {
                title: contentForm.title,
                slug: contentForm.slug,
                content: contentForm.content,
                excerpt: contentForm.excerpt,
                image: contentForm.image,
                publishedAt: new Date(contentForm.publishedAt).toISOString()
            };

            if (contentType === 'blog') {
                payload.author = contentForm.author;
                payload.tags = contentForm.tags.split(',').map(t => t.trim()).filter(t => t);
            }

            if (editingItem) {
                await apiDb.updateDocument(
                    DATABASE_ID,
                    contentType === 'blog' ? COLLECTIONS.BLOGS : COLLECTIONS.NEWS,
                    editingItem.$id,
                    payload
                );
            } else {
                await apiDb.createDocument(
                    DATABASE_ID,
                    contentType === 'blog' ? COLLECTIONS.BLOGS : COLLECTIONS.NEWS,
                    ID.unique(),
                    payload
                );
            }
            closeEditor();
            fetchData();
        } catch (error) {
            console.error('Content save failed:', error);
            alert('Failed to save content. Check console for details.');
        }
    };

    const generateSlug = (title: string) => {
        const slug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        setContentForm(prev => ({ ...prev, slug }));
    };

    // Job Editor Handlers
    const openJobEditor = (job?: Job) => {
        setEditingJob(job || null);
        if (job) {
            setJobForm({
                title: job.title,
                location: job.location,
                type: job.type,
                description: job.description,
                requirements: job.requirements,
                salary: job.salary || '',
                publishedAt: new Date(job.publishedAt).toISOString().slice(0, 16)
            });
        } else {
            setJobForm({
                title: '',
                location: '',
                type: 'Full-time',
                description: '',
                requirements: '',
                salary: '',
                publishedAt: new Date().toISOString().slice(0, 16)
            });
        }
        setIsEditingJob(true);
    };

    const closeJobEditor = () => {
        setIsEditingJob(false);
        setEditingJob(null);
    };

    const handleJobSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                title: jobForm.title,
                location: jobForm.location,
                type: jobForm.type,
                description: jobForm.description,
                requirements: jobForm.requirements,
                salary: jobForm.salary,
                publishedAt: new Date(jobForm.publishedAt).toISOString()
            };

            if (editingJob) {
                await apiDb.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.JOBS,
                    editingJob.$id,
                    payload
                );
            } else {
                await apiDb.createDocument(
                    DATABASE_ID,
                    COLLECTIONS.JOBS,
                    ID.unique(),
                    payload
                );
            }
            closeJobEditor();
            fetchData();
        } catch (error) {
            console.error('Job save failed:', error);
            alert('Failed to save job.');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lex-med-blue"></div></div>;
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 pt-24 pb-12">
                <SignIn routing="hash" />
            </div>
        );
    }

    if (isEditingContent) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col pt-24">
                <div className="container mx-auto px-6 py-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-lex-dark-blue">
                                {editingItem ? `Edit ${contentType === 'blog' ? 'Blog Post' : contentType === 'news' ? 'News Article' : 'HIGS Event'}` : `New ${contentType === 'blog' ? 'Blog Post' : contentType === 'news' ? 'News Article' : 'HIGS Event'}`}
                            </h2>
                            <button onClick={closeEditor} className="text-gray-500 hover:text-gray-700">Cancel</button>
                        </div>
                        <form onSubmit={handleContentSubmit} className="space-y-6">
                            {contentType === 'higs' ? (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input type="text" value={contentForm.date} onChange={e => setContentForm({...contentForm, date: e.target.value})} className="w-full border rounded p-2 focus:ring focus:ring-lex-med-blue" required placeholder="e.g. Next Saturday, 10am GMT" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration URL (Luma link)</label>
                                        <input type="url" value={contentForm.registrationUrl} onChange={e => setContentForm({...contentForm, registrationUrl: e.target.value})} className="w-full border rounded p-2 focus:ring focus:ring-lex-med-blue" required placeholder="https://luma.com/..." />
                                    </div>
                                    <div className="mb-6 flex items-center">
                                        <input type="checkbox" checked={contentForm.isActive} onChange={e => setContentForm({...contentForm, isActive: e.target.checked})} className="mr-2" id="higs-active" />
                                        <label htmlFor="higs-active" className="text-sm font-medium text-gray-700">Set as Active Event</label>
                                    </div>
                                </>
                            ) : (
                                <>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={contentForm.title}
                                        onChange={(e) => {
                                            setContentForm({ ...contentForm, title: e.target.value });
                                            if (!editingItem) generateSlug(e.target.value);
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                                    <input
                                        type="text"
                                        value={contentForm.slug}
                                        onChange={(e) => setContentForm({ ...contentForm, slug: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                        required
                                    />
                                </div>
                            </div>

                            {contentType === 'blog' && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                                        <input
                                            type="text"
                                            value={contentForm.author}
                                            onChange={(e) => setContentForm({ ...contentForm, author: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            value={contentForm.tags}
                                            onChange={(e) => setContentForm({ ...contentForm, tags: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            placeholder="e.g. Healthcare, Technology, AI"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                                    <input
                                        type="url"
                                        value={contentForm.image}
                                        onChange={(e) => setContentForm({ ...contentForm, image: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                                    <input
                                        type="datetime-local"
                                        value={contentForm.publishedAt}
                                        onChange={(e) => setContentForm({ ...contentForm, publishedAt: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (Short Summary)</label>
                                <textarea
                                    value={contentForm.excerpt}
                                    onChange={(e) => setContentForm({ ...contentForm, excerpt: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24 resize-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <ContentEditor
                                    initialContent={contentForm.content}
                                    onChange={(content) => setContentForm({ ...contentForm, content })}
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={closeEditor}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-lex-med-blue text-white rounded-lg hover:bg-lex-bright-blue font-bold"
                                >
                                    Save {contentType === 'blog' ? 'Post' : contentType === 'news' ? 'Article' : 'Event'}
                                </button>
                            </div>
                            </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    if (isEditingJob) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-24">
            <div className="container mx-auto px-6 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-lex-dark-blue">
                            {editingJob ? 'Edit Job' : 'New Job'}
                        </h2>
                        <button onClick={closeJobEditor} className="text-gray-500 hover:text-gray-700">Cancel</button>
                    </div>
                    <form onSubmit={handleJobSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                <input
                                    type="text"
                                    value={jobForm.title}
                                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={jobForm.location}
                                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={jobForm.type}
                                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Salary (Optional)</label>
                                <input
                                    type="text"
                                    value={jobForm.salary}
                                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={jobForm.description}
                                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                            <textarea
                                value={jobForm.requirements}
                                onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                            <input
                                type="datetime-local"
                                value={jobForm.publishedAt}
                                onChange={(e) => setJobForm({ ...jobForm, publishedAt: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={closeJobEditor}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-lex-med-blue text-white rounded-lg hover:bg-lex-bright-blue font-bold"
                            >
                                Save Job
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-24">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-lex-dark-blue">Admin Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{user?.primaryEmailAddress?.emailAddress}</span>
                    <a href="/" className="text-sm text-lex-med-blue font-medium">Go Home</a>
                </div>
            </div>
        </header>

        <div className="flex-1 container mx-auto px-6 py-8">
            {/* Tabs */}
            <div className="flex space-x-4 mb-8 border-b border-gray-200 overflow-x-auto pb-1">
                <button onClick={() => setActiveTab('inquiries')} className={`pb-2 px-4 font-medium whitespace-nowrap ${activeTab === 'inquiries' ? 'text-lex-med-blue border-b-2 border-lex-med-blue' : 'text-gray-500 hover:text-gray-700'}`}>Partner Inquiries</button>
                <button onClick={() => setActiveTab('contacts')} className={`pb-2 px-4 font-medium whitespace-nowrap ${activeTab === 'contacts' ? 'text-lex-med-blue border-b-2 border-lex-med-blue' : 'text-gray-500 hover:text-gray-700'}`}>Contact Messages</button>
                <button onClick={() => setActiveTab('subscriptions')} className={`pb-2 px-4 font-medium whitespace-nowrap ${activeTab === 'subscriptions' ? 'text-lex-med-blue border-b-2 border-lex-med-blue' : 'text-gray-500 hover:text-gray-700'}`}>Subscribers</button>
                <button onClick={() => setActiveTab('hospitals')} className={`pb-2 px-4 font-medium whitespace-nowrap ${activeTab === 'hospitals' ? 'text-lex-med-blue border-b-2 border-lex-med-blue' : 'text-gray-500 hover:text-gray-700'}`}>Registered Hospitals</button>
                <button onClick={() => setActiveTab('blogs')} className={`pb-2 px-4 font-medium whitespace-nowrap ${activeTab === 'blogs' ? 'text-lex-med-blue border-b-2 border-lex-med-blue' : 'text-gray-500 hover:text-gray-700'}`}>Blog Posts</button>
                <button onClick={() => setActiveTab('news')} className={`pb-2 px-4 font-medium whitespace-nowrap ${activeTab === 'news' ? 'text-lex-med-blue border-b-2 border-lex-med-blue' : 'text-gray-500 hover:text-gray-700'}`}>News Articles</button>
                <button onClick={() => setActiveTab('jobs')} className={`pb-2 px-4 font-medium whitespace-nowrap ${activeTab === 'jobs' ? 'text-lex-med-blue border-b-2 border-lex-med-blue' : 'text-gray-500 hover:text-gray-700'}`}>Jobs</button>
                <button onClick={() => setActiveTab('waitlist')} className={`pb-2 px-4 font-medium whitespace-nowrap ${activeTab === 'waitlist' ? 'text-lex-med-blue border-b-2 border-lex-med-blue' : 'text-gray-500 hover:text-gray-700'}`}>Waitlist</button>
                <button onClick={() => setActiveTab('feedback')} className={`pb-2 px-4 font-medium whitespace-nowrap ${activeTab === 'feedback' ? 'text-lex-med-blue border-b-2 border-lex-med-blue' : 'text-gray-500 hover:text-gray-700'}`}>Feedback</button>
                <button onClick={() => setActiveTab('higs')} className={`pb-2 px-4 font-medium whitespace-nowrap ${activeTab === 'higs' ? 'text-lex-med-blue border-b-2 border-lex-med-blue' : 'text-gray-500 hover:text-gray-700'}`}>HIGS Events</button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
                {activeTab === 'inquiries' && (
                    <div>
                        <h2 className="text-lg font-bold mb-4">Hospital Partnership Inquiries</h2>
                        {partners.length === 0 ? (
                            <p className="text-gray-500">No inquiries found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-200 text-gray-600 text-sm">
                                            <th className="py-3 px-2">Date</th>
                                            <th className="py-3 px-2">Hospital</th>
                                            <th className="py-3 px-2">Contact</th>
                                            <th className="py-3 px-2">Email/Phone</th>
                                            <th className="py-3 px-2">Message</th>
                                            <th className="py-3 px-2">Status</th>
                                            <th className="py-3 px-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {partners.map((p) => (
                                            <tr key={p.$id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-2 text-sm">{new Date(p.$createdAt).toLocaleDateString()}</td>
                                                <td className="py-3 px-2 font-medium">{p.hospitalName}</td>
                                                <td className="py-3 px-2 text-sm">{p.contactPerson}</td>
                                                <td className="py-3 px-2 text-sm">
                                                    <div>{p.email}</div>
                                                    <div className="text-gray-500 text-xs">{p.phone}</div>
                                                </td>
                                                <td className="py-3 px-2 text-sm max-w-xs truncate" title={p.message}>{p.message}</td>
                                                <td className="py-3 px-2">
                                                    <select
                                                        value={p.status}
                                                        onChange={(e) => handleStatusUpdate(p.$id, e.target.value)}
                                                        className={`text-xs px-2 py-1 rounded-full border-none focus:ring-2 focus:ring-lex-med-blue cursor-pointer ${p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="contacted">Contacted</option>
                                                        <option value="registered">Registered</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <button onClick={() => handleDelete(COLLECTIONS.PARTNERS, p.$id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'contacts' && (
                    <div>
                        <h2 className="text-lg font-bold mb-4">Contact Messages</h2>
                        {contacts.length === 0 ? (
                            <p className="text-gray-500">No messages found.</p>
                        ) : (
                            <div className="space-y-4">
                                {contacts.map((c) => (
                                    <div key={c.$id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lex-dark-blue">{c.subject}</h3>
                                                <p className="text-sm text-gray-600">From: {c.name} ({c.email})</p>
                                            </div>
                                            <span className="text-xs text-gray-500">{new Date(c.$createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <p className="text-gray-700 mt-2">{c.message}</p>
                                            <button onClick={() => handleDelete(COLLECTIONS.CONTACTS, c.$id)} className="text-red-500 hover:text-red-700 text-sm ml-4">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'subscriptions' && (
                    <div>
                        <h2 className="text-lg font-bold mb-4">Newsletter Subscribers</h2>
                        {subscriptions.length === 0 ? (
                            <p className="text-gray-500">No subscribers found.</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {subscriptions.map((s) => (
                                    <li key={s.$id} className="py-3 flex justify-between items-center">
                                        <span className="text-gray-800">{s.email}</span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(s.$createdAt).toLocaleDateString()}
                                            <button onClick={() => handleDelete(COLLECTIONS.SUBSCRIPTIONS, s.$id)} className="text-red-500 hover:text-red-700 text-sm ml-4">Delete</button>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {activeTab === 'hospitals' && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <h2 className="text-lg font-bold mb-4">Registered Hospitals</h2>
                            {hospitals.length === 0 ? (
                                <p className="text-gray-500">No hospitals registered yet.</p>
                            ) : (
                                <div className="grid gap-4">
                                    {hospitals.map((h) => (
                                        <div key={h.$id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lex-med-blue">{h.name}</h3>
                                                    <p className="text-sm text-gray-600">{h.address}, {h.city}, {h.state}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => startEditing(h)} className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                                                    <button onClick={() => handleDelete(COLLECTIONS.HOSPITALS, h.$id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                                                </div>
                                            </div>
                                            {(h.phone || h.email || h.website) && (
                                                <div className="mt-2 text-sm text-gray-600 space-y-1">
                                                    {h.phone && <div>Phone: {h.phone}</div>}
                                                    {h.email && <div>Email: {h.email}</div>}
                                                    {h.website && (
                                                        <a href={h.website} target="_blank" rel="noopener noreferrer" className="text-lex-med-blue hover:underline">Website</a>
                                                    )}
                                                </div>
                                            )}
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {h.products?.map(p => (
                                                    <span key={p} className="text-xs bg-lex-light-blue/20 text-lex-med-blue px-2 py-1 rounded">
                                                        {p === 'lexcare-hms' ? 'HMS' : p === 'dr-andre' ? 'Dr. Andre' : 'Patient App'}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl h-fit">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lex-dark-blue">{editingHospital ? 'Edit Hospital' : 'Register New Hospital'}</h3>
                                {editingHospital && (
                                    <button onClick={cancelEditing} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                                )}
                            </div>
                            <form onSubmit={handleRegisterHospital} className="space-y-4">
                                <input type="text" placeholder="Hospital Name" className="w-full px-3 py-2 border rounded-lg" value={hospitalForm.name} onChange={handleHospitalInputChange('name')} required />
                                <input type="text" placeholder="Address" className="w-full px-3 py-2 border rounded-lg" value={hospitalForm.address} onChange={handleHospitalInputChange('address')} required />
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="text" placeholder="City" className="w-full px-3 py-2 border rounded-lg" value={hospitalForm.city} onChange={handleHospitalInputChange('city')} required />
                                    <input type="text" placeholder="State" className="w-full px-3 py-2 border rounded-lg" value={hospitalForm.state} onChange={handleHospitalInputChange('state')} required />
                                </div>
                                <div className="space-y-2">
                                    <input type="url" placeholder="Website (optional)" className="w-full px-3 py-2 border rounded-lg" value={hospitalForm.website} onChange={handleHospitalInputChange('website')} />
                                    <input type="tel" placeholder="Phone (optional)" className="w-full px-3 py-2 border rounded-lg" value={hospitalForm.phone} onChange={handleHospitalInputChange('phone')} />
                                    <input type="email" placeholder="Email (optional)" className="w-full px-3 py-2 border rounded-lg" value={hospitalForm.email} onChange={handleHospitalInputChange('email')} />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Products Used:</p>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" value="lexcare-hms" onChange={handleProductChange} checked={hospitalForm.products.includes('lexcare-hms')} />
                                        <span className="text-sm">LexCare HMS</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" value="dr-andre" onChange={handleProductChange} checked={hospitalForm.products.includes('dr-andre')} />
                                        <span className="text-sm">Dr. Andre</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" value="lexcare-patients" onChange={handleProductChange} checked={hospitalForm.products.includes('lexcare-patients')} />
                                        <span className="text-sm">Patient App</span>
                                    </label>
                                </div>

                                <button type="submit" disabled={regStatus === 'submitting'} className="w-full bg-lex-med-blue text-white py-2 rounded-lg font-bold hover:bg-lex-bright-blue transition-colors disabled:opacity-50">
                                    {regStatus === 'submitting' ? (editingHospital ? 'Updating...' : 'Registering...') : (editingHospital ? 'Update Hospital' : 'Register Hospital')}
                                </button>
                                {regStatus === 'success' && <p className="text-green-600 text-sm text-center">Hospital registered successfully!</p>}
                                {regStatus === 'error' && <p className="text-red-600 text-sm text-center">Registration failed.</p>}
                            </form>
                        </div>
                    </div>
                )}

                {activeTab === 'blogs' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold">Blog Posts</h2>
                            <button
                                onClick={() => openEditor('blog')}
                                className="px-4 py-2 bg-lex-med-blue text-white rounded-lg hover:bg-lex-bright-blue font-bold text-sm"
                            >
                                New Post
                            </button>
                        </div>
                        {blogs.length === 0 ? (
                            <p className="text-gray-500">No blog posts found.</p>
                        ) : (
                            <div className="space-y-4">
                                {blogs.map((post) => (
                                    <div key={post.$id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-lex-dark-blue">{post.title}</h3>
                                            <p className="text-sm text-gray-600">By {post.author} · {new Date(post.publishedAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => openEditor('blog', post)} className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                                            <button onClick={() => handleDelete(COLLECTIONS.BLOGS, post.$id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'news' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold">News Articles</h2>
                            <button
                                onClick={() => openEditor('news')}
                                className="px-4 py-2 bg-lex-med-blue text-white rounded-lg hover:bg-lex-bright-blue font-bold text-sm"
                            >
                                New Article
                            </button>
                        </div>
                        {news.length === 0 ? (
                            <p className="text-gray-500">No news articles found.</p>
                        ) : (
                            <div className="space-y-4">
                                {news.map((article) => (
                                    <div key={article.$id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-lex-dark-blue">{article.title}</h3>
                                            <p className="text-sm text-gray-600">{new Date(article.publishedAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => openEditor('news', article)} className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                                            <button onClick={() => handleDelete(COLLECTIONS.NEWS, article.$id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'jobs' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold">Job Openings</h2>
                            <button
                                onClick={() => openJobEditor()}
                                className="px-4 py-2 bg-lex-med-blue text-white rounded-lg hover:bg-lex-bright-blue font-bold text-sm"
                            >
                                New Job
                            </button>
                        </div>
                        {jobs.length === 0 ? (
                            <p className="text-gray-500">No job openings found.</p>
                        ) : (
                            <div className="space-y-4">
                                {jobs.map((job) => (
                                    <div key={job.$id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-lex-dark-blue">{job.title}</h3>
                                            <p className="text-sm text-gray-600">{job.location} · {job.type}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => openJobEditor(job)} className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                                            <button onClick={() => handleDelete(COLLECTIONS.JOBS, job.$id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'waitlist' && (
                    <div>
                        <h2 className="text-lg font-bold mb-4">Dr. Andre Waitlist</h2>
                        {waitlist.length === 0 ? (
                            <p className="text-gray-500">No waitlist entries found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-200 text-gray-600 text-sm">
                                            <th className="py-3 px-2">Date</th>
                                            <th className="py-3 px-2">Name</th>
                                            <th className="py-3 px-2">Email</th>
                                            <th className="py-3 px-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {waitlist.map((entry) => (
                                            <tr key={entry.$id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-2 text-sm">{new Date(entry.$createdAt).toLocaleDateString()}</td>
                                                <td className="py-3 px-2 font-medium">{entry.name}</td>
                                                <td className="py-3 px-2 text-sm">{entry.email}</td>
                                                <td className="py-3 px-2">
                                                    <button onClick={() => handleDelete(COLLECTIONS.WAITLIST, entry.$id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'feedback' && (
                    <div>
                        <h2 className="text-lg font-bold mb-4">Product Feedback</h2>
                        {feedback.length === 0 ? (
                            <p className="text-gray-500">No feedback found.</p>
                        ) : (
                            <div className="space-y-4">
                                {feedback.map((f) => (
                                    <div key={f.$id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lex-dark-blue">{f.name}</h3>
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{f.product}</span>
                                                </div>
                                                <p className="text-sm text-gray-600">{f.email}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="font-bold text-yellow-500">{f.rating}</span>
                                                <span className="text-gray-400 text-sm">/ 5</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mt-2">{f.message}</p>
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                            <span className="text-xs text-gray-500">{new Date(f.$createdAt).toLocaleString()}</span>
                                            <button onClick={() => handleDelete(COLLECTIONS.FEEDBACK, f.$id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    </div >
);
};

export default AdminPage;