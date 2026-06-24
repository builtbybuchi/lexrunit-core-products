import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { getNews } from '../lib/dataService';
import { NewsArticle } from '../types';

const NewsPage: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            const data = await getNews();
            setArticles(data);
            setLoading(false);
        };
        fetchNews();
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
                title="Company News"
                subtitle="Stay updated with the latest announcements and milestones from Lexrunit."
            />
            <section className="py-20 bg-lex-bg">
                <div className="container mx-auto px-6 max-w-5xl">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lex-med-blue"></div>
                        </div>
                    ) : articles.length > 0 ? (
                        <div className="space-y-8">
                            {articles.map(article => (
                                <a href={`/news/${article.slug}`} key={article.id} className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                    <div className="md:flex">
                                        <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                                            <img
                                                src={article.image || 'https://placehold.co/600x400?text=News'}
                                                alt={article.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-8 md:w-2/3 flex flex-col justify-center">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="w-2 h-2 rounded-full bg-lex-bright-blue"></span>
                                                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">{formatDate(article.date)}</p>
                                            </div>
                                            <h2 className="text-2xl font-bold text-lex-dark-blue mb-3 group-hover:text-lex-med-blue transition-colors">{article.title}</h2>
                                            <p className="text-gray-700 leading-relaxed mb-4 line-clamp-2">{article.summary}</p>
                                            <span className="text-lex-med-blue font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Read full story
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 bg-white rounded-xl shadow-sm">
                            <p className="text-lg text-gray-600">No news articles to display at the moment.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default NewsPage;
