
export interface Job {
    id: string;
    title: string;
    location: string;
    type: string;
    description: string;
    requirements: string;
    salary?: string;
    publishedAt: string;
}

export interface JobApplication {
    id: string;
    jobId: string;
    jobTitle: string;
    fullName: string;
    email: string;
    phone: string;
    resumeUrl: string;
    coverLetter?: string;
    status: 'pending' | 'reviewed' | 'rejected' | 'hired';
    appliedAt: string;
}

export interface NewsArticle {
    id: string;
    title: string;
    slug: string;
    date: string; // ISO 8601 format
    summary: string;
    content: string;
    image: string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    author: string;
    date: string; // ISO 8601 format
    summary: string;
    content: string; // Markdown content
    image: string;
    tags?: string[];
}
