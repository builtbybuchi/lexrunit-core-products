import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client, Databases, Query } from 'node-appwrite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://lexrunit.com';
const PROJECT_ID = '68e67ffd0007ce1f504f';
const ENDPOINT = 'https://storage.lexrunit.com/v1';
const DATABASE_ID = 'website-db';
const COLLECTIONS = {
    BLOGS: 'blogs',
    NEWS: 'news'
};

const STATIC_ROUTES = [
    '/',
    '/about',
    '/products',
    '/products/dr-andre',
    '/products/sinod',
    '/products/academicx',
    '/products/drave-registry',
    '/philosophy',
    '/careers',
    '/contact',
    '/news',
    '/blog',
    '/lexcare-hms',
    '/lexcare-patients',
    '/find-hospitals',
    '/partner',
    '/kernal-systems'
];

async function generateSitemap() {
    console.log('Generating sitemap...');

    const client = new Client()
        .setEndpoint(ENDPOINT)
        .setProject(PROJECT_ID);

    const databases = new Databases(client);

    let blogs = [];
    let news = [];

    try {
        const blogsResponse = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.BLOGS,
            [Query.limit(100)]
        );
        blogs = blogsResponse.documents;
    } catch (error) {
        console.error('Error fetching blogs:', error.message);
    }

    try {
        const newsResponse = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.NEWS,
            [Query.limit(100)]
        );
        news = newsResponse.documents;
    } catch (error) {
        console.error('Error fetching news:', error.message);
    }

    console.log(`Found ${blogs.length} blogs and ${news.length} news articles.`);

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static routes
    STATIC_ROUTES.forEach(route => {
        sitemap += `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>
`;
    });

    // Add blog posts
    blogs.forEach(post => {
        if (post.slug) {
            sitemap += `  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt || post.publishedAt || new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
        }
    });

    // Add news articles
    news.forEach(article => {
        if (article.slug) {
            sitemap += `  <url>
    <loc>${BASE_URL}/news/${article.slug}</loc>
    <lastmod>${article.updatedAt || article.publishedAt || new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
        }
    });

    sitemap += `</urlset>`;

    const publicDir = path.join(__dirname, '../public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');

    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`Sitemap generated at ${sitemapPath}`);
}

generateSitemap();
