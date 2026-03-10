'use client';

import React from 'react';
import { X } from 'lucide-react';
import { CatalogBundle } from '@/types';

interface BundleModalProps {
  editingBundleId: string | null;
  bundleForm: CatalogBundle;
  setBundleForm: (form: CatalogBundle) => void;
  bundleServiceInput: string;
  setBundleServiceInput: (v: string) => void;
  loading: boolean;
  onSave: () => void;
  onClose: () => void;
}

export default function BundleModal({
  editingBundleId,
  bundleForm, setBundleForm,
  bundleServiceInput, setBundleServiceInput,
  loading, onSave, onClose,
}: BundleModalProps) {

  const addService = () => {
    if (bundleServiceInput.trim()) {
      setBundleForm({ ...bundleForm, includedServices: [...bundleForm.includedServices, bundleServiceInput.trim()] });
      setBundleServiceInput('');
    }
  };

  const removeService = (idx: number) => {
    setBundleForm({ ...bundleForm, includedServices: bundleForm.includedServices.filter((_, i) => i !== idx) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold text-gray-900">{editingBundleId ? 'Edit Bundle' : 'Add New Bundle'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="text-sm font-semibold text-gray-700">Bundle Name</label>
            <input
              type="text"
              value={bundleForm.name}
              onChange={e => setBundleForm({ ...bundleForm, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1"
              placeholder="e.g. Startup Package"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea
              value={bundleForm.description}
              onChange={e => setBundleForm({ ...bundleForm, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1"
              placeholder="Brief summary of this package"
              rows={2}
            />
          </div>

          {/* Included Services */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Included Services</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={bundleServiceInput}
                onChange={e => setBundleServiceInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addService(); } }}
                className="flex-grow p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Type a service and press enter"
              />
              <button onClick={addService} className="bg-gray-100 text-gray-700 px-4 rounded-lg hover:bg-gray-200">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {bundleForm.includedServices.map((service, idx) => (
                <span key={idx} className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {service}
                  <button onClick={() => removeService(idx)} className="hover:text-red-500 ml-1"><X size={14} /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            {(['KES', 'USD', 'EUR', 'GBP'] as const).map(curr => (
              <div key={curr}>
                <label className="text-sm font-semibold text-gray-700">Price ({curr})</label>
                <input
                  type="number"
                  value={bundleForm.prices[curr] || ''}
                  onChange={e => setBundleForm({ ...bundleForm, prices: { ...bundleForm.prices, [curr]: Number(e.target.value) } })}
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
          <button onClick={onSave} disabled={loading} className="px-5 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors">
            {loading ? 'Saving...' : 'Save Bundle'}
          </button>
        </div>
      </div>
    </div>
  );
}
