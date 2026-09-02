import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import SafeImage from '../components/SafeImage';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    api.get('/blog').then(({ data }) => setBlogs(data)).catch(() => {});
  }, []);

  return (
    <>
      <SEOHead title="Blog" description="Jewellery guides, buying tips, and fashion trends." path="/blog" />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-center mb-12">Jewellery Journal</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link key={blog._id} to={`/blog/${blog.slug}`} className="group">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-cream mb-4">
                {blog.image && <SafeImage src={blog.image} alt={blog.title} category="rings" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />}
              </div>
              <span className="text-xs text-gold uppercase tracking-wider">{blog.category}</span>
              <h2 className="font-semibold text-charcoal text-xl mt-1 group-hover:text-gold transition-colors">{blog.title}</h2>
              <p className="text-sm text-muted mt-2 line-clamp-2">{blog.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
