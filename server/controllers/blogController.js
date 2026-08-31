const Blog = require('../models/Blog');

const getBlogs = async (req, res) => {
  const filter = { isPublished: true };
  if (req.query.category) filter.category = req.query.category;
  const blogs = await Blog.find(filter).sort({ createdAt: -1 });
  res.json(blogs);
};

const getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
  if (blog) res.json(blog);
  else res.status(404).json({ message: 'Blog not found' });
};

const createBlog = async (req, res) => {
  const blog = await Blog.create(req.body);
  res.status(201).json(blog);
};

const updateBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (blog) res.json(blog);
  else res.status(404).json({ message: 'Blog not found' });
};

const deleteBlog = async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (blog) res.json({ message: 'Blog removed' });
  else res.status(404).json({ message: 'Blog not found' });
};

module.exports = { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog };
