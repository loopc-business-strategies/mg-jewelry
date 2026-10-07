import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import SafeImage from '../components/SafeImage';
import SEOHead from '../components/SEOHead';
import { useTranslation } from '../hooks/useTranslation';
import { blogCategoryText } from '../utils/displayText';

export default function BlogPostPage() {
  const { slug } = useParams();
  const { t, tf, lang } = useTranslation();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    api.get(`/blog/${slug}`).then(({ data }) => setBlog(data)).catch(() => {});
  }, [slug, lang]);

  if (!blog) return <div className="max-w-3xl mx-auto px-4 py-16"><div className="skeleton h-64 rounded-xl" /></div>;

  return (
    <>
      <SEOHead title={blog.title} description={blog.excerpt} path={`/blog/${slug}`} />
      <article className="max-w-3xl mx-auto px-4 py-16">
        <Link to="/blog" className="text-sm text-gold-dark hover:underline mb-4 inline-block">{t('ui.backToBlog')}</Link>
        <span className="text-xs text-gold uppercase tracking-wider">{blogCategoryText(t, blog.category)}</span>
        <h1 className="mt-2 mb-4">{blog.title}</h1>
        <p className="text-sm text-muted mb-8">{tf('ui.byAuthor', { author: blog.author })}</p>
        {blog.image && <SafeImage src={blog.image} alt={blog.title} category="rings" className="w-full rounded-xl mb-8" />}
        <div className="prose text-muted leading-relaxed">{blog.content}</div>
      </article>
    </>
  );
}
