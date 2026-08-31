import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    api.get(`/blog/${slug}`).then(({ data }) => setBlog(data)).catch(() => {});
  }, [slug]);

  if (!blog) return <div className="max-w-3xl mx-auto px-4 py-16"><div className="skeleton h-64 rounded-xl" /></div>;

  return (
    <>
      <SEOHead title={blog.title} description={blog.excerpt} path={`/blog/${slug}`} />
      <article className="max-w-3xl mx-auto px-4 py-16">
        <Link to="/blog" className="text-sm text-gold-dark hover:underline mb-4 inline-block">← Back to Blog</Link>
        <span className="text-xs text-gold uppercase tracking-wider">{blog.category}</span>
        <h1 className="font-display text-4xl mt-2 mb-4">{blog.title}</h1>
        <p className="text-sm text-muted mb-8">By {blog.author}</p>
        {blog.image && <img src={blog.image} alt={blog.title} className="w-full rounded-xl mb-8" />}
        <div className="prose text-muted leading-relaxed">{blog.content}</div>
      </article>
    </>
  );
}
