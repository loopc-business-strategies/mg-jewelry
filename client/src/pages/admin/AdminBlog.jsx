import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    api.get('/blog').then(({ data }) => setBlogs(data)).catch(() => {});
  }, []);

  return (
    <div className="p-8">
      <h1 className="mb-8">Blog Posts</h1>
      <div className="space-y-3">
        {blogs.map((b) => (
          <div key={b._id} className="bg-white rounded-xl p-4 shadow-sm border flex justify-between items-center">
            <div>
              <h3 className="font-medium">{b.title}</h3>
              <p className="text-sm text-muted">{b.category}</p>
            </div>
            <Link to={`/blog/${b.slug}`} className="text-sm text-gold-dark hover:underline">View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
