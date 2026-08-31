const Category = require('../models/Category');

const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ order: 1 });
  res.json(categories);
};

const getCategoryBySlug = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (category) res.json(category);
  else res.status(404).json({ message: 'Category not found' });
};

const createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
};

const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (category) res.json(category);
  else res.status(404).json({ message: 'Category not found' });
};

const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (category) res.json({ message: 'Category removed' });
  else res.status(404).json({ message: 'Category not found' });
};

module.exports = { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
