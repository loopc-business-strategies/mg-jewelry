import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [tiers, setTiers] = useState([]);
  const [goldRates, setGoldRates] = useState({
    rate24k: 7500, rate22k: 6900, rate21k: 6600, rate18k: 5600,
    defaultMakingCharge: 2000, defaultWastagePercent: 8, defaultTaxPercent: 3,
  });

  useEffect(() => {
    api.get('/admin/settings/bulk-pricing').then(({ data }) => setTiers(data)).catch(() => {});
    api.get('/admin/settings/gold-rates').then(({ data }) => setGoldRates(data)).catch(() => {});
  }, []);

  const saveTiers = async () => {
    try {
      await api.put('/admin/settings/bulk-pricing', { tiers });
      toast.success('Bulk pricing updated');
    } catch {
      toast.error('Failed to save');
    }
  };

  const saveGoldRates = async () => {
    try {
      await api.put('/admin/settings/gold-rates', goldRates);
      toast.success('Gold rates updated');
    } catch {
      toast.error('Failed to save gold rates');
    }
  };

  const deleteDemo = async (type) => {
    if (!confirm(`Delete all demo ${type}? This cannot be undone.`)) return;
    try {
      const endpoint = type === 'products' ? '/admin/demo-products' : '/admin/demo-data';
      const { data } = await api.delete(endpoint);
      toast.success(`Deleted ${data.deleted || data.products || 0} items`);
    } catch {
      toast.error('Failed to delete demo data');
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1>Settings</h1>

      <div className="bg-white rounded-xl p-6 shadow-sm border max-w-2xl">
        <h2 className="font-semibold text-charcoal text-xl mb-4">Bulk Pricing Tiers</h2>
        <div className="space-y-3">
          {tiers.map((tier, i) => (
            <div key={i} className="grid grid-cols-4 gap-3 text-sm">
              <input value={tier.minQty} onChange={(e) => { const t = [...tiers]; t[i].minQty = Number(e.target.value); setTiers(t); }} className="input-elegant" placeholder="Min" />
              <input value={tier.maxQty || ''} onChange={(e) => { const t = [...tiers]; t[i].maxQty = e.target.value ? Number(e.target.value) : null; setTiers(t); }} className="input-elegant" placeholder="Max" />
              <input value={tier.discountPercent} onChange={(e) => { const t = [...tiers]; t[i].discountPercent = Number(e.target.value); setTiers(t); }} className="input-elegant" placeholder="Discount %" />
              <input value={tier.label} onChange={(e) => { const t = [...tiers]; t[i].label = e.target.value; setTiers(t); }} className="input-elegant" placeholder="Label" />
            </div>
          ))}
        </div>
        <button onClick={saveTiers} className="mt-4 btn-primary-gold text-xs">Save Bulk Pricing</button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border max-w-2xl">
        <h2 className="font-semibold text-charcoal text-xl mb-4">Gold Rates (₹/gram)</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {['rate24k', 'rate22k', 'rate21k', 'rate18k', 'defaultMakingCharge', 'defaultWastagePercent', 'defaultTaxPercent'].map((key) => (
            <div key={key}>
              <label className="text-xs text-muted capitalize block mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="number"
                value={goldRates[key] || ''}
                onChange={(e) => setGoldRates({ ...goldRates, [key]: Number(e.target.value) })}
                className="input-elegant"
              />
            </div>
          ))}
        </div>
        <button onClick={saveGoldRates} className="mt-4 btn-primary-gold text-xs">Save Gold Rates</button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border max-w-2xl">
        <h2 className="font-semibold text-charcoal text-xl mb-4">Demo Data</h2>
        <p className="text-sm text-muted mb-4">Remove seeded demo products and orders safely.</p>
        <div className="flex gap-3">
          <button onClick={() => deleteDemo('products')} className="btn-outline-elegant text-xs">Delete Demo Products</button>
          <button onClick={() => deleteDemo('all')} className="btn-outline-elegant text-xs text-red-600">Delete All Demo Data</button>
        </div>
      </div>
    </div>
  );
}
