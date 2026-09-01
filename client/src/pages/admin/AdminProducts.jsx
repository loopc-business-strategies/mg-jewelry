import { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';
import { getProductImages } from '../../utils/imageConfig';

const emptyForm = {
  name: '', sku: '', category: 'chains', subcategory: '', description: '',
  price: '', mrp: '', wholesalePrice: '', moq: 10, stock: 100,
  metal: 'Gold', purity: '18K', gender: 'unisex',
  weight: '', weightRange: '', length: '', width: '', diameter: '',
  design: '', finish: 'Polished', goldColour: 'Yellow',
  productionLeadTime: '2–4 weeks', availability: 'made_to_order',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

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

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        mrp: Number(form.mrp),
        wholesalePrice: Number(form.wholesalePrice || form.price * 0.65),
        moq: Number(form.moq),
        stock: Number(form.stock),
        discount: Math.round(((form.mrp - form.price) / form.mrp) * 100),
        images: getProductImages(form.category, form.subcategory, form.sku || Date.now()),
        shortDescription: form.description?.slice(0, 80),
      };
      await api.post('/admin/products', payload);
      toast.success('Product created');
      setShowForm(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl">Products</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-gold text-white px-4 py-2 rounded-lg text-sm">
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createProduct} className="bg-white rounded-xl border p-6 mb-8 grid md:grid-cols-3 gap-4">
          {['name', 'sku', 'category', 'subcategory', 'price', 'mrp', 'wholesalePrice', 'stock', 'metal', 'purity', 'gender', 'weight', 'weightRange', 'length', 'width', 'diameter', 'design', 'finish', 'goldColour', 'productionLeadTime', 'moq'].map((field) => (
            <div key={field}>
              <label className="text-xs font-medium capitalize block mb-1">{field}</label>
              <input
                required={['name', 'sku', 'category', 'price', 'mrp'].includes(field)}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          ))}
          <div className="md:col-span-3">
            <label className="text-xs font-medium block mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} />
          </div>
          <div className="md:col-span-3">
            <button type="submit" className="bg-charcoal text-white px-6 py-2 rounded-lg text-sm">Save Product</button>
          </div>
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
