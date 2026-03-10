'use client';

import React from 'react';
import { X } from 'lucide-react';
import { CatalogService } from '@/types';

interface ServiceModalProps {
  editingServiceId: string | null;
  serviceForm: CatalogService;
  setServiceForm: (form: CatalogService) => void;
  loading: boolean;
  onSave: () => void;
  onClose: () => void;
}

export default function ServiceModal({ editingServiceId, serviceForm, setServiceForm, loading, onSave, onClose }: ServiceModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in zoom-in-95">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">{editingServiceId ? 'Edit Service' : 'Add New Service'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Service Name</label>
            <input
              type="text"
              value={serviceForm.name}
              onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1"
              placeholder="e.g. Logo Design"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <input
              type="text"
              value={serviceForm.category}
              onChange={e => setServiceForm({ ...serviceForm, category: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1"
              placeholder="e.g. Branding"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            {(['KES', 'USD', 'EUR', 'GBP'] as const).map(curr => (
              <div key={curr}>
                <label className="text-sm font-semibold text-gray-700">Price ({curr})</label>
                <input
                  type="number"
                  value={serviceForm.prices[curr] || ''}
                  onChange={e => setServiceForm({ ...serviceForm, prices: { ...serviceForm.prices, [curr]: Number(e.target.value) } })}
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
          <button onClick={onSave} disabled={loading} className="px-5 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors">
            {loading ? 'Saving...' : 'Save Service'}
          </button>
        </div>
      </div>
    </div>
  );
}
