import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { getBlogPosts } from '../lib/dataService';
import { BlogPost } from '../types';

const BlogPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const data = await getBlogPosts();
            setPosts(data);
            setLoading(false);
        };
        fetchPosts();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div>
            <PageHeader
                title="Our Blog"
                subtitle="Insights, ideas, and stories from the team at Lexrunit."
            />
            <section className="py-20 bg-lex-bg">
                <div className="container mx-auto px-6">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lex-med-blue"></div>
                        </div>
                    ) : posts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map(post => (
                                <a href={`/blog/${post.slug}`} key={post.id} className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden group">
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={post.image || 'https://placehold.co/600x400?text=No+Image'}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex gap-2 mb-3">
                                            {post.tags?.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-xs font-bold text-lex-med-blue bg-lex-light-blue/20 px-2 py-1 rounded-full uppercase tracking-wider">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h2 className="text-2xl font-bold text-lex-dark-blue mb-3 group-hover:text-lex-med-blue transition-colors">{post.title}</h2>
                                        <p className="text-gray-600 flex-grow mb-4 line-clamp-3">{post.summary}</p>
                                        <div className="mt-auto border-t pt-4 text-sm text-gray-500 flex justify-between items-center">
                                            <span>By {post.author}</span>
                                            <span>{formatDate(post.date)}</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 bg-white rounded-2xl shadow-sm max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No posts yet</h3>
                            <p className="text-gray-600">Check back soon for updates!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default BlogPage;
