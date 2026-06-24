import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { getBlogPostBySlug } from '../lib/dataService';
import { BlogPost } from '../types';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';

interface BlogPostPageProps {
    slug: string;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug }) => {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const foundPost = await getBlogPostBySlug(slug);
            setPost(foundPost || null);
            setLoading(false);
        };
        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center py-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lex-med-blue"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div>
                <Helmet>
                    <title>Post Not Found - Lexrunit</title>
                </Helmet>
                <PageHeader title="Post Not Found" subtitle="Sorry, we couldn't find the blog post you're looking for." />
                <div className="text-center py-20">
                    <a href="/blog" className="text-lex-med-blue hover:underline">Return to Blog</a>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div>
            <Helmet>
                <title>{post.title} - Lexrunit Blog</title>
                <meta name="description" content={post.summary} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.summary} />
                <meta property="og:image" content={post.image} />
                <meta property="og:type" content="article" />
                <meta name="author" content={post.author} />
            </Helmet>
            <PageHeader
                title={post.title}
                subtitle={`By ${post.author} on ${formatDate(post.date)}`}
            />
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src={post.image || 'https://placehold.co/800x400?text=No+Image'}
                            alt={post.title}
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    <div className="flex gap-2 mb-6">
                        {post.tags?.map(tag => (
                            <span key={tag} className="text-sm font-bold text-lex-med-blue bg-lex-light-blue/20 px-3 py-1 rounded-full uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <article className="prose lg:prose-xl max-w-none text-gray-800 prose-headings:text-lex-dark-blue prose-a:text-lex-med-blue">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </article>

                    <div className="mt-12 border-t pt-8 flex justify-between items-center">
                        <a href="/blog" className="bg-lex-med-blue text-white font-bold py-2 px-5 rounded-lg hover:bg-lex-bright-blue transition-colors duration-300">
                            &larr; Back to Blog
                        </a>

                        {/* Share buttons could go here */}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BlogPostPage;
