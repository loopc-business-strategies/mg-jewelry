import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.get('/admin/customers').then(({ data }) => setCustomers(data)).catch(() => {});
  }, []);

  return (
    <div className="p-8">
      <h1 className="font-semibold text-charcoal text-3xl mb-8">Customers</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Phone</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-4">{c.name}</td>
                <td className="p-4">{c.email}</td>
                <td className="p-4">{c.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
