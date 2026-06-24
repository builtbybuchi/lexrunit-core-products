import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { getNewsArticleBySlug } from '../lib/dataService';
import { NewsArticle } from '../types';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';

interface NewsArticlePageProps {
    slug: string;
}

const NewsArticlePage: React.FC<NewsArticlePageProps> = ({ slug }) => {
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            const foundArticle = await getNewsArticleBySlug(slug);
            setArticle(foundArticle || null);
            setLoading(false);
        };
        fetchArticle();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center py-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lex-med-blue"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div>
                <Helmet>
                    <title>Article Not Found - Lexrunit</title>
                </Helmet>
                <PageHeader title="Article Not Found" subtitle="Sorry, we couldn't find the news article you're looking for." />
                <div className="text-center py-20">
                    <a href="/news" className="text-lex-med-blue hover:underline">Return to News</a>
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
                <title>{article.title} - Lexrunit News</title>
                <meta name="description" content={article.summary} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.summary} />
                <meta property="og:image" content={article.image} />
                <meta property="og:type" content="article" />
            </Helmet>
            <PageHeader
                title={article.title}
                subtitle={`Published on ${formatDate(article.date)}`}
            />
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src={article.image || 'https://placehold.co/800x400?text=News'}
                            alt={article.title}
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    <article className="prose lg:prose-xl max-w-none text-gray-800 prose-headings:text-lex-dark-blue prose-a:text-lex-med-blue">
                        <ReactMarkdown>{article.content}</ReactMarkdown>
                    </article>

                    <div className="mt-12 border-t pt-8">
                        <a href="/news" className="bg-lex-med-blue text-white font-bold py-2 px-5 rounded-lg hover:bg-lex-bright-blue transition-colors duration-300">
                            &larr; Back to News
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NewsArticlePage;
