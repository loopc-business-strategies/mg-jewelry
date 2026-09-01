import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [tiers, setTiers] = useState([]);

  useEffect(() => {
    api.get('/admin/settings/bulk-pricing').then(({ data }) => setTiers(data)).catch(() => {});
  }, []);

  const save = async () => {
    try {
      await api.put('/admin/settings/bulk-pricing', { tiers });
      toast.success('Bulk pricing updated');
    } catch {
      toast.error('Failed to save');
    }
  };

  return (
    <div className="p-8">
      <h1 className="font-semibold text-charcoal text-3xl mb-8">Settings</h1>
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
        <button onClick={save} className="mt-4 btn-primary-gold text-xs">Save Changes</button>
      </div>
    </div>
  );
}
