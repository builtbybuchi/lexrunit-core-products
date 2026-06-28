import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}

export default function BlogPreview() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch('https://fra.cloud.appwrite.io/v1/databases/website-db/collections/blogs/documents', {
          headers: { 'X-Appwrite-Project': 'lexrunit-general-db' }
        });
        const data = await response.json();
        
        const drandreBlogs = (data.documents || [])
          .filter((doc: any) => doc.tags && Array.isArray(doc.tags) && doc.tags.includes('drandre'))
          .map((doc: any) => ({
            id: doc.$id,
            title: doc.title,
            excerpt: doc.excerpt || doc.content?.substring(0, 100) + '...',
            category: doc.category || 'Health',
            date: new Date(doc.publishedAt || doc.$createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            readTime: doc.readTime || '5 min read',
            image: doc.coverImage || doc.image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
          }))
          .slice(0, 3);
          
        setBlogs(drandreBlogs);
      } catch (e) {
        console.error('Error fetching blogs', e);
      }
    }
    fetchBlogs();
  }, []);

  if (blogs.length === 0) return null;

  return (
    <section id="blog-preview" className="py-24 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Latest Insights</span>
            <h2 className="text-4xl md:text-5xl font-bold text-primary-dark tracking-tight">
              Health & Technology <span className="text-primary">Blog</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Stay updated with the latest trends in digital health, AI innovations, and tips for maintaining a healthy lifestyle.
            </p>
          </div>
          
          <a href="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-primary/5 hover:bg-primary/10 text-primary font-semibold rounded-full transition-colors shrink-0">
            View All Posts <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.article 
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group bg-page rounded-3xl overflow-hidden border border-primary/5 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-dark text-xs font-bold rounded-full shadow-sm">
                    {blog.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {blog.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {blog.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-primary-dark mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  <a href={`/blog/${blog.id}`}>
                    {blog.title}
                  </a>
                </h3>
                
                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                  {blog.excerpt}
                </p>
                
                <div className="mt-auto pt-4 border-t border-primary/10 flex items-center justify-between">
                  <a href={`/blog/${blog.id}`} className="text-sm font-semibold text-primary group-hover:text-primary-dark flex items-center gap-1.5 transition-colors">
                    Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
