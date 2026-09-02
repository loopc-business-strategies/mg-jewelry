import { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';
import { getProductImages } from '../../utils/imageConfig';

const LANGS = [
  { code: 'en', label: 'English', required: true },
  { code: 'ru', label: 'Russian' },
  { code: 'uz', label: 'Uzbek' },
  { code: 'ar', label: 'Arabic' },
  { code: 'tr', label: 'Turkish' },
];

const emptyForm = {
  name: '', sku: '', category: 'rings', subcategory: '', description: '',
  price: '', mrp: '', wholesalePrice: '', moq: 10, stock: 100,
  metal: 'Gold', purity: '18K', gender: 'women',
  translations: { en: { name: '', description: '', shortDescription: '' }, ru: {}, uz: {}, ar: {}, tr: {} },
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [activeLang, setActiveLang] = useState('en');

  const load = () => api.get('/products?limit=100').then(({ data }) => setProducts(data.products)).catch(() => {});

  useEffect(() => { load(); }, []);

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const updateTranslation = (lang, field, value) => {
    setForm((f) => {
      const next = {
        ...f,
        translations: {
          ...f.translations,
          [lang]: { ...f.translations[lang], [field]: value },
        },
      };
      if (lang === 'en' && ['name', 'description'].includes(field)) {
        next[field] = value;
      }
      return next;
    });
  };

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      const en = form.translations.en || {};
      const name = en.name || form.name;
      const description = en.description || form.description;
      const payload = {
        ...form,
        name,
        description,
        price: Number(form.price),
        mrp: Number(form.mrp),
        wholesalePrice: Number(form.wholesalePrice || form.price * 0.65),
        moq: Number(form.moq),
        stock: Number(form.stock),
        discount: Math.round(((form.mrp - form.price) / form.mrp) * 100),
        images: getProductImages(form.category, form.subcategory, form.sku || Date.now()),
        shortDescription: en.shortDescription || description?.slice(0, 80),
        translations: {
          ...form.translations,
          en: {
            ...en,
            name,
            description,
            shortDescription: en.shortDescription || description?.slice(0, 80),
          },
        },
      };
      await api.post('/admin/products', payload);
      toast.success('Product created');
      setShowForm(false);
      setForm(emptyForm);
      setActiveLang('en');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create');
    }
  };

  const tr = form.translations[activeLang] || {};

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1>Products</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-gold text-white px-4 py-2 rounded-lg text-sm">
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createProduct} className="bg-white rounded-xl border p-6 mb-8 space-y-4">
          <div className="flex flex-wrap gap-2 border-b pb-4">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => setActiveLang(code)}
                className={`px-3 py-1.5 text-xs rounded-md border ${activeLang === code ? 'bg-gold text-white border-gold' : 'bg-white'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium block mb-1">Name ({activeLang.toUpperCase()}){activeLang === 'en' ? ' *' : ''}</label>
              <input
                required={activeLang === 'en'}
                value={tr.name || ''}
                onChange={(e) => updateTranslation(activeLang, 'name', e.target.value)}
                className="input-elegant"
              />
            </div>
            {activeLang === 'en' && ['sku', 'category', 'subcategory', 'price', 'mrp', 'wholesalePrice', 'stock', 'metal', 'purity', 'gender'].map((field) => (
              <div key={field}>
                <label className="text-xs font-medium capitalize block mb-1">{field}</label>
                <input
                  required={['name', 'sku', 'category', 'price', 'mrp'].includes(field)}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="input-elegant"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Description ({activeLang.toUpperCase()})</label>
            <textarea
              value={tr.description || ''}
              onChange={(e) => updateTranslation(activeLang, 'description', e.target.value)}
              className="input-elegant"
              rows={3}
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Short Description ({activeLang.toUpperCase()})</label>
            <input
              value={tr.shortDescription || ''}
              onChange={(e) => updateTranslation(activeLang, 'shortDescription', e.target.value)}
              className="input-elegant"
            />
          </div>

          <button type="submit" className="btn-primary-gold text-xs">Save Product</button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">SKU</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.sku}</td>
                <td className="p-4 capitalize">{p.category}</td>
                <td className="p-4">{formatPrice(p.price)}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">
                  <button onClick={() => deleteProduct(p._id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
